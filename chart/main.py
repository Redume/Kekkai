"""
This is the main application file for the chart service using FastAPI.

The application serves static files, provides endpoints for generating charts,
and integrates with Plausible Analytics for tracking usage.
"""

import os

import uvicorn
from fastapi import FastAPI
from starlette.staticfiles import StaticFiles

from middleware.plausible_analytics import PlausibleAnalytics
from routes import get_chart, get_chart_period
from utils.load_config import load_config

app = FastAPI()
config = load_config('config.hjson')

if not os.path.exists('../charts'):
    os.mkdir('../charts')

app.mount('/static/charts', StaticFiles(directory='../charts/'))
app.middleware('http')(PlausibleAnalytics())

app.include_router(get_chart.router)
app.include_router(get_chart_period.router)


if __name__ == '__main__':
    uvicorn.run(
        app,
        host=config['server']['host'],
        port=3030,
        ssl_keyfile=
        config['server']['ssl']['private_key']
        if config['server']['ssl']['enabled']
        else None,
        ssl_certfile=
        config['server']['ssl']['cert']
        if config['server']['ssl']['enabled']
        else None
    )
