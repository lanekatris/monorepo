from dagster import (
    Definitions,
    IOManager,
    InitResourceContext,
    InputContext,
    OutputContext,
    StringSource,
    io_manager,
    load_assets_from_modules,
)
from . import places_history
from sqlalchemy import create_engine
import pandas as pd


all_assets = load_assets_from_modules([places_history])


class PostgresDataframeIOManager(IOManager):
    def __init__(self, url: str) -> None:
        self.url = url

    def handle_output(self, context: OutputContext, obj: pd.DataFrame):
        # Skip handling if the output is None
        if obj is None:
            return

        table_name = context.asset_key.to_python_identifier()
        #
        engine = create_engine(self.url)
        #
        obj.to_sql(table_name, engine, if_exists="replace", index=False)

        # Recording metadata from an I/O manager:
        # https://docs.dagster.io/concepts/io-management/io-managers#recording-metadata-from-an-io-manager
        context.add_output_metadata({"db": "neondb", "table_name": table_name})

    def load_input(self, context: InputContext):
        # upstream_output.asset_key is the asset key given to the Out that we're loading for
        table_name = context.upstream_output.asset_key.to_python_identifier()
        #
        engine = create_engine(self.url)
        df = pd.read_sql(f"SELECT * FROM public.{table_name}", engine)
        return df


@io_manager(config_schema={"url": StringSource})
def postgres_pandas_io_manager(
    init_context: InitResourceContext,
) -> PostgresDataframeIOManager:
    return PostgresDataframeIOManager(
        url=init_context.resource_config["PG_DB_CONN_STRING"]
        #         pwd=init_context.resource_config["pwd"],
        #         uid=init_context.resource_config["uid"],
        #         server=init_context.resource_config["server"],
        #   db=init_context.resource_config["db"],
        #   port=init_context.resource_config["port"],
    )


defs = Definitions(
    assets=all_assets,
    resources={
        "db_io": postgres_pandas_io_manager.configured({"env": "PG_DB_CONN_STRING"})
    },
)
