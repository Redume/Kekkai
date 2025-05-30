"""lifespan handler"""

from contextlib import asynccontextmanager

from database.server import Database
from utils.config.load_config import load_config
from utils.config.get_dsn import get_dsn

config = load_config("config.hjson")
db = Database(get_dsn(config["database"]))


@asynccontextmanager
async def lifespan(app) -> None:
    """Connecting and disconnecting to the database"""
    await db.connect()
    app.state.db = db
    yield
    await db.disconnect()
