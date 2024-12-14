import asyncpg
import yaml

config = yaml.safe_load(open("config.yaml", "r"))

async def create_pool() -> asyncpg.pool.Pool:
    pool = await asyncpg.create_pool(
        user=config['database']['user'],
        password=config['database']['password'],
        database=config['database']['name'],
        host=config['database']['host'],
        port=config['database']['port'],
        min_size=5,
        max_size=20
    )

    return pool