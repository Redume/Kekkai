import os

import uvicorn
import yaml

from fastapi import FastAPI
from starlette.staticfiles import StaticFiles

from chart.middleware.plausible_analytics import PlausibleAnalytics
from chart.routes import get_chart, get_chart_period

app = FastAPI()
config = yaml.safe_load(open('config.yaml'))

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
        ssl_keyfile=config['server']['ssl']['private_key'] if config['server']['ssl']['work'] else None,
        ssl_certfile=config['server']['ssl']['cert'] if config['server']['ssl']['work'] else None
    )
