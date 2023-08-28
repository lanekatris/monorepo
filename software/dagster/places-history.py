import pprint
from zipfile import ZipFile
import json
import pandas as pd


class Location:
    def __init__(self, name, address):
        self.name = name
        self.address = address


def idk():
    zip = ZipFile(
        "C:\\Code\\monorepo\\software\\dagster\\data\\takeout-20230703T122719Z-001.zip"
    )

    # locations = []
    names = []
    addresses = []

    for file in zip.namelist():
        # if "Semantic Location History" in file:
        # print(file)
        if (
            # "Takeout/Location History/Semantic Location History/2022/2022_JUNE.json"
            "Semantic Location History"
            in file
        ):
            # print(json.loads(zip.read(file)))
            contents = json.loads(zip.read(file))
            for line in contents["timelineObjects"]:
                if "placeVisit" in line:
                    l = line["placeVisit"]["location"]
                    # locations.append(Location(l.get("name"), l["address"]))
                    # df.append(
                    #     {"name": l.get("name"), "address": l.get("address")},
                    #     ignore_index=True,
                    # )
                    addresses.append(l.get("address"))
                    names.append(l.get("name"))

    # first_file = zip.namelist().pop(0)
    # print(first_file)
    # print(json.loads(zip.read(first_file)))

    # print(locations.pop(0).name, locations.pop(0).address)
    df = pd.DataFrame({"Address": addresses, "Name": names})
    df = df.drop_duplicates()
    print("length of array", len(df))

    # TODO: load dataframe
    # df = pd.DataFrame(locations)
    df.to_csv("data/my_location_history.csv")
    print(df)


idk()
