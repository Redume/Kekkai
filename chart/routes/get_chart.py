"""
Module for handling currency exchange rate chart requests.

Defines an API endpoint that processes requests to visualize historical
currency exchange rate data.
It validates input parameters, fetches data from the database,
and returns a dynamically generated chart image as a response.

Supports multiple backends for chart generation,
including Typst and Matplotlib.
"""

from datetime import datetime

from chart_backend import matplotlib, typst
from database.server import Database
from dateutil.relativedelta import relativedelta
from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import StreamingResponse
from schemas.currency import Currency

router = APIRouter()


@router.get("/api/getChart/", status_code=status.HTTP_200_OK)
async def get_chart(req: Request, currency: Currency = Depends()) -> StreamingResponse:
    """
    API endpoint to generate and return a currency exchange rate chart.

    Processes GET requests to produce
    a chart visualizing historical exchange rate data
    for a specified currency pair and time range.

    Args:
        req (Request): The FastAPI request object.
        currency (Currency): Dependency-injected currency
            query parameters including:
            - from_currency: base currency code.
            - conv_currency: target currency code.
            - start_date: start of the data range (datetime).
            - end_date: end of the data range (datetime).
            - period: optional predefined period
                like 'week', 'month', etc.
            - backend: chart rendering backend,
                e.g., 'typst' or 'matplotlib'.

    Returns:
        StreamingResponse: A streaming response containing
        the generated chart image (PNG).

    Raises:
        HTTPException: For invalid or missing query parameters
        or if no data is found.
    """
    if not currency.from_currency or not currency.conv_currency:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The from_currency and conv_currency fields are required.",
        )

    days, month, years = 0, 0, 0

    if currency.period:
        match currency.period:
            case "week":
                days = -7
            case "month":
                month = -1
            case "quarter":
                month = -3
            case "year":
                years = -1

        currency.end_date = datetime.now()
        currency.start_date = currency.end_date + relativedelta(
            months=month, days=days, years=years
        )
    else:
        if not currency.start_date or not currency.end_date:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The start_date and end_date fields are required.",
            )

        if currency.start_date > currency.end_date:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The start_date cannot be later than the end_date.",
            )

    db: Database = req.app.state.db

    data = await db.fetchmany(
        "SELECT date, rate FROM currency "
        "WHERE (date BETWEEN $1 AND $2) "
        "AND from_currency = $3 AND conv_currency = $4 ORDER BY date",
        currency.start_date,
        currency.end_date,
        currency.from_currency.upper(),
        currency.conv_currency.upper(),
    )

    if not data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No data to plot",
        )

    dates = [datetime.fromtimestamp(row["date"]) for row in data]
    rates = [float(row["rate"]) for row in data]

    current_year = datetime.now().year

    labels = [
        d.strftime("%m-%d") if d.year == current_year else d.strftime("%Y-%m-%d")
        for d in dates
    ]

    if len(dates) < 3:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No data to plot",
        )

    chart = None
    match currency.backend:
        case "typst":
            chart = await typst.create_chart(currency, dates, rates)
        case "matplotlib":
            chart = await matplotlib.create_chart(currency, dates, rates)

    if chart is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="No data found."
        )

    return StreamingResponse(chart, media_type="image/png")
