"""
This module initializes the database connection pool using asyncpg.

It reads database configuration from a YAML file 
and creates a connection pool
that can be used throughout the application for database operations.
"""

from datetime import datetime, date
from typing import Optional, List, Dict, Any
from pathlib import Path
import json

import asyncpg

from utils.config.load_config import load_config

config = load_config('config.hjson')

def custom_encoder(obj):
    """
    Custom JSON encoder for non-serializable objects.

    This function is used as the default encoder in json.dumps 
    to convert objects
    that are not natively JSON serializable into a JSON-friendly format. 
    In particular, it converts date and datetime objects 
    to their ISO 8601 string representation.

    Args:
        obj: The object to encode.

    Returns:
        str: The ISO 8601 formatted string if obj is a date or datetime.

    Raises:
        TypeError: If the object is not a date or datetime instance 
        and cannot be serialized.
    """
    if isinstance(obj, (date, datetime)):
        return obj.isoformat()

    raise TypeError(
        f"Object of type {obj.__class__.__name__} is not JSON serializable"
        )

class Database:
    """
    A class to manage PostgreSQL database connections and operations.

    This class provides methods to:
    - Establish a connection pool using asyncpg.
    - Create database tables from an SQL schema file.
    - Manage database connections efficiently.

    Attributes:
        dsn (str): The Data Source Name (DSN) 
            for connecting to the database.
        pool (Optional[asyncpg.Pool]): The connection pool. 
            None if not connected.

    Example:
        ```python
        db = Database("postgresql://user:password@localhost/dbname")
        await db.connect()
        # Perform database operations
        await db.disconnect()
        ```

    Raises:
        RuntimeError: If connection to the database fails 
            or table creation fails.
    """
    def __init__(self, dsn: str):
        """Initilization Database"""
        self.dsn = dsn
        self.pool: Optional[asyncpg.Pool] = None

    async def connect(self) -> None:
        """Initialize database connection pool"""
        try:
            self.pool = await asyncpg.create_pool(self.dsn)
            await self._create_table()
        except Exception as e:
            raise RuntimeError(
                f"Failed to connect to the database: {e}"
                ) \
            from e

    async def disconnect(self) -> None:
        """Close all connections in the pool"""
        if self.pool:
            await self.pool.close()

    async def _create_table(self) -> None:
        """Create table from SQL-file"""
        sql_file = Path(__file__).parent / "schemas" / "data.sql"
        with open(sql_file, 'r', encoding='utf-8') as file:
            sql = file.read()

        async with self.pool.acquire() as conn:
            await conn.execute(sql)

    async def fetch(self, query: str, *args) -> List[Dict]:
        """
        Fetch a single row from the database 
        and return it as a JSON response.

        Args:
            query (str): The SQL query to execute.
            *args: Parameters to be used in the query.

        Returns:
            Dict[str, Any]: 
                A dictionary representing the fetched row. 
                `[]` if no rows are found.
        """
        if not self.pool:
            raise RuntimeError("Database connection is not initialized.")

        async with self.pool.acquire() as conn:
            result = await conn.fetchrow(query, *args)

        return json.loads(
            json.dumps(dict(result), default=custom_encoder)
        ) if result else []

    async def fetchmany(self, query: str, *args) -> List[Dict[str, Any]]:
        """
        Fetch multiple rows from the database 
        and return them as a JSON response.

        Args:
            query (str): The SQL query to execute.
            *args: Parameters to be used in the query.

        Returns:
            List[Dict[str, Any]]: 
                A list of dictionaries representing the fetched rows. 
                `[]` if no rows are found.
        """
        if not self.pool:
            raise RuntimeError("Database connection is not initialized.")

        async with self.pool.acquire() as conn:
            results = await conn.fetch(query, *args)

        return json.loads(
            json.dumps([dict(row) for row in results], default=custom_encoder)
        ) if results else []

    async def update(self, query: str, *args) -> List[Dict[str, Any]]:
        """
        Executes an update query on the database.

        Args:
            query (str): The SQL update query to be executed.
            *args: Parameters to be passed into the query.

        Returns:
            List[Dict[str, Any]]: A list of dictionaries representing 
            the updated rows, or None if no rows were affected.

        Raises:
            RuntimeError: If the database connection is not initialized.
        """
        if not self.pool:
            raise RuntimeError("Database connection is not initialized.")

        async with self.pool.acquire() as conn:
            if "RETURNING" in query.upper():
                rows = await conn.fetch(query, *args)
                return {
                    "updated_rows": len(rows), 
                    "data": [
                        dict(row) for row in rows
                        ]
                        } if rows else {"updated_rows": 0, "data": []}
            else:
                result = await conn.execute(query, *args)
                updated_rows = int(result.split()[-1])
                return {"updated_rows": updated_rows}

    async def insert(self, query: str, *args) -> Dict[str, Any]:
        """
        Inserts a new record into the database.

        Args:
            query (str): The SQL INSERT query to be executed.
            *args: Parameters to be passed into the query.

        Returns:
            Dict[str, Any]: 
                A dictionary with the inserted row(s) if the query contains 
                "RETURNING", otherwise a confirmation message.

        Raises:
            RuntimeError: If the database connection is not initialized.
        """
        if not self.pool:
            raise RuntimeError("Database connection is not initialized.")

        async with self.pool.acquire() as conn:
            if "RETURNING" in query.upper():
                rows = await conn.fetch(query, *args)
                return {
                    "inserted_rows": len(rows),
                    "data": [dict(row) for row in rows]
                } if rows else {"inserted_rows": 0, "data": []}
            else:
                result = await conn.execute(query, *args)
                inserted_rows = int(result.split()[-1])
                return {"inserted_rows": inserted_rows}
