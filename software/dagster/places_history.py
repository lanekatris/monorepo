from zipfile import ZipFile
import json
import pandas as pd
from dagster import (
    AssetExecutionContext,
    InitResourceContext,
    InputContext,
    MetadataValue,
    StringSource,
    asset,
    IOManager,
    OutputContext,
    io_manager,
)


# from dagster_postgres import ()


@asset(io_manager_key="db_io")
def create_place_list_from_google_takeout():
    zip = ZipFile(
        "C:\\Code\\monorepo\\software\\dagster\\data\\takeout-20230703T122719Z-001.zip"
    )

    names = []
    addresses = []

    for file in zip.namelist():
        if (
            # "Takeout/Location History/Semantic Location History/2022/2022_JUNE.json"
            "Semantic Location History"
            in file
        ):
            contents = json.loads(zip.read(file))
            for line in contents["timelineObjects"]:
                if "placeVisit" in line:
                    l = line["placeVisit"]["location"]
                    addresses.append(l.get("address"))
                    names.append(l.get("name"))

    df = pd.DataFrame({"Address": addresses, "Name": names})
    df = df.drop_duplicates()
    print("length of array", len(df))
    df.to_csv("data/my_location_history.csv")
    print(df)
    # write to postgres


# @asset()
# def put_it_in_postgres():
