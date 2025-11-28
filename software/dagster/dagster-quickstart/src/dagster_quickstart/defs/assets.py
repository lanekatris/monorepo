import pandas as pd
import subprocess

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

@dg.asset(deps=[climbing_ticks])
def build_website():
    print("build website")

@dg.asset(deps=[climbing_ticks,water_level,processed_data])
def create_asset_manifest():
    print("create manifest")
