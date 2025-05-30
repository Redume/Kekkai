"""
This is the main application file for the chart service using FastAPI.

The application serves static files, provides endpoints for generating charts,
and integrates with Plausible Analytics for tracking usage.
"""

import uvicorn
from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError

from utils.lifespan import lifespan
from utils.config.load_config import load_config
from utils.exception_handler import custom_validation_exception

from middleware.plausible_analytics import PlausibleAnalytics
from routes import get_chart

app = FastAPI(lifespan=lifespan)
config = load_config("config.hjson")

app.add_exception_handler(RequestValidationError, custom_validation_exception)

app.middleware("http")(PlausibleAnalytics())

app.include_router(get_chart.router)

if __name__ == "__main__":
    uvicorn.run(app, host=config["server"]["host"], port=3030)
