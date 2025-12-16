import pandas as pd
import subprocess
import tempfile
import sqlite3
from minio import Minio
import io
import psycopg
from psycopg.rows import dict_row

import dagster as dg
import requests
from requests.packages.urllib3.exceptions import InsecureRequestWarning
import ssl
import urllib.request
import json
import os

sample_data_file = "src/dagster_quickstart/defs/data/sample_data.csv"
processed_data_file = "src/dagster_quickstart/defs/data/processed_data.csv"


@dg.asset
def processed_data():
    ## Read data from the CSV
    df = pd.read_csv(sample_data_file)

    ## Add an age_group column based on the value of age
    df["age_group"] = pd.cut(
        df["age"], bins=[0, 30, 40, 100], labels=["Young", "Middle", "Senior"]
    )

    ## Save processed data
    df.to_csv(processed_data_file, index=False)
    return "Data loaded successfully"



@dg.asset
def water_level():
    os.makedirs("output", exist_ok=True)
    url = "https://www.lrh-wc.usace.army.mil/wm/data/json/projects/sug_15M.min.json.js"
    result = subprocess.run(
        ["curl", "-k", url],  # -k ignores SSL cert
        capture_output=True,
        check=True,
    )
    data = json.loads(result.stdout)
    with open("output/water_level.json", "w") as f:
        json.dump(data, f, indent=2)

    yield dg.AssetMaterialization.file(path="output/water_level.json", description="idk man")

    yield dg.Output(data, "result")

@dg.asset
def climbing_ticks():
    r = requests.get("https://www.mountainproject.com/user/7079884/lane-katris/tick-export")
    with open("output/climbing_ticks.csv", "wb") as f:
      f.write(r.content)

    yield dg.AssetMaterialization.file(path="output/climbing_ticks.csv", description="idk man")
    yield dg.Output(r.content, "result")

# @dg.asset(deps=[climbing_ticks])
# def build_website():
#     print("build website")

# @dg.asset(deps=[climbing_ticks,water_level,processed_data])
# def create_asset_manifest():
#     print("create manifest")

@dg.asset
def sqlmesh():
    project_dir = "/home/lane/git"
    subprocess.run(["docker",
    "run","--rm","-v","/home/lane/.sqlmesh/config.yaml:/sqlmesh_project/config.yaml", "sqlmesh"],
                   cwd=project_dir,
                   check=True)

@dg.asset
def volleyball_websites():
    project_dir = "/home/lane/git/volleyball"
    api_token = os.getenv("CLOUDFLARE_API_TOKEN")
    account_id = os.getenv("CLOUDFLARE_ACCOUNT_ID")

    subprocess.run(["docker", "run", "--rm", 
"-e", 
                    "CLOUDFLARE_API_TOKEN=" + api_token,
                    "-e", 
                    "CLOUDFLARE_ACCOUNT_ID=" + account_id,
                    "volleyball"], cwd=project_dir,check=True)

@dg.job
def deploy_volleyball_websites():
    volleyball_websites()

# todo: create minio file for volleyball json file so the voleyball website can load
@dg.asset
def volleyball_feed():
    conn = psycopg.connect(
            os.getenv("POSTGRES_URL"),
        row_factory=dict_row,   # rows come back as dicts
    )

    with conn.cursor() as cur:
        cur.execute("""
        with calendar as (SELECT d::date d
                  FROM generate_series('2023-01-01'::date, '2025-12-31'::date, '1 day') AS d
                  WHERE extract(dow FROM d) = 1 -- 1 = Monday
),
    files as (
        select *
        from markdown_file_models m
        where file_path like '/Adventures%' and file_path ilike '%volleyball%'
    ),
    overrides as (
        select '2025-08-11'::date date, 'no idea why, maybe weather' reason
    )
-- todo: probably need to go against the events table to know when we don't play or a way to persist something other than null also this could tie if i documented the price or not or I could do a config DAG to know if i've added it to git or put it all in sql
-- todo: what about the league when we didn't play? is this an override like above
-- todo: or is it by "week" if we played? But, what if we have 2 games? The season could be designed in sql

select c.d, f.file_date,f.file_path,
       case
           when o.date is not null then concat('overriden: ', o.reason)
           when f.file_date is not null then 'played'
           else 'missing'
           end status
from calendar c
left join files f on f.file_date::date = c.d
left join overrides o on c.d = o.date
where c.d <= current_date
order by c.d desc


""")
        rows = cur.fetchall()   # list of dicts

    # 2. Convert to JSON bytes
    json_bytes = json.dumps(rows, default=str).encode("utf-8")


    # Sqlmesh creates it, this creates the file
    client = Minio(
            endpoint="server1:9000",
        access_key=os.getenv("MINIO_ACCESS_KEY"),
        secret_key=os.getenv("MINIO_SECRET_KEY"),
        secure=False
    )

    client.put_object(
        bucket_name="public",
        object_name="test_volleyball_feed.json",
        data=io.BytesIO(json_bytes),
        length=len(json_bytes),
        content_type="application/json",
    )


    df = pd.DataFrame(rows)
    with tempfile.NamedTemporaryFile(delete=False,suffix=".sqlite") as tmp:
        temp_path = tmp.name
        sqlite_conn = sqlite3.connect(temp_path)
        df.to_sql("volleyball_feed", sqlite_conn, if_exists="replace",index=False)
        sqlite_conn.close()

        with open(temp_path, "rb") as f:
            data = f.read()

        client.put_object(
            bucket_name="public",
            object_name="test_volleyball_feed.sqlite",
            data=io.BytesIO(data),
            length=len(data),
            content_type="application/octet-stream",
        )



# quartz
#   copy markdown files
#   quartz build
#   cloudflare deploy
