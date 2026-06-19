import json

import asyncpg
from fastapi import Request


async def _init_connection(conn: asyncpg.Connection) -> None:
    await conn.set_type_codec("json", encoder=json.dumps, decoder=json.loads, schema="pg_catalog")
    await conn.set_type_codec("jsonb", encoder=json.dumps, decoder=json.loads, schema="pg_catalog")


async def create_pool(dsn: str) -> asyncpg.Pool:
    return await asyncpg.create_pool(
        dsn,
        min_size=2,
        max_size=10,
        command_timeout=30,
        max_inactive_connection_lifetime=300,
        init=_init_connection,
    )


def get_pool(request: Request) -> asyncpg.Pool:
    return request.app.state.pool
