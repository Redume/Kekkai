"""
This module initializes the database connection pool using asyncpg.

It reads database configuration from a YAML file and creates a connection pool
that can be used throughout the application for database operations.
"""

import asyncpg

from chart.utils.load_config import load_config

config = load_config('config.yaml')

async def create_pool() -> asyncpg.pool.Pool:
    """
    Creates and returns a connection pool for the PostgreSQL database.

    The function uses configuration settings loaded from a YAML file to
    establish the connection pool. The pool allows multiple database
    connections to be reused efficiently across the application.

    Returns:
        asyncpg.pool.Pool: The connection pool object.
    """
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
