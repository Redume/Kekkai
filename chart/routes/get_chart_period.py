"""
This module defines the route for fetching a chart for a specific currency pair and period.

It includes the endpoint `/api/getChart/{period}` which allows users to request a chart for
a given currency pair (from_currency and conv_currency)
over a specified time period (week, month, quarter, or year).
"""
from datetime import datetime
from dateutil.relativedelta import relativedelta

from fastapi import APIRouter, status, Request, HTTPException, Depends

from function.create_chart import create_chart
from schemas.currency import Currency

# pylint: disable=duplicate-code
router = APIRouter()

@router.get("/api/getChart/{period}", status_code=status.HTTP_201_CREATED)
async def get_chart_period(
    req: Request,
    currency: Currency = Depends()
    ) -> dict:
    """
    Fetches a chart for a given currency pair and a specific period.

    The period can be one of the following: 
        'week', 'month', 'quarter', 'year'.
    Based on the selected period, 
        it calculates the start date and retrieves the chart data.

    :param response: The response object used to set status and message.
    :param request: The request object used 
        to retrieve details of the incoming request.
    :param from_currency: The base currency in the pair (e.g., 'USD').
    :param conv_currency: The target currency in the pair (e.g., 'EUR').
    :param period: The time period for which the chart is requested
    (e.g., 'week', 'month', 'quarter', 'year').
    :return: A response containing the chart URL or an error message 
        if parameters are invalid.
    """
    if not currency.from_currency or not currency.conv_currency:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='The from_currency and conv_currency fields are required.'
        )

    days, month, years = 0, 0, 0

    match currency.period:
        case 'week':
            days = -7
        case 'month':
            month = -1
        case 'quarter':
            month = -3
        case 'year':
            years = -1

    currency.end_date = datetime.now()
    currency.start_date = currency.end_date + relativedelta(
        months=month,
        days=days,
        years=years
    )

    chart = await create_chart(currency, req.app.state.db)

    if not chart:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='No data found.'
        )

    return await prepare_chart_response(req, chart)

async def prepare_chart_response(req: Request, chart_name: str) -> dict:
    """
    Prepares the response to return the URL of the generated chart.

    If the chart data is not found, 
        it returns a 404 error with an appropriate message.
    Otherwise, it returns a URL to access the chart image.

    :param response: The response object used to set status and message.
    :param request: The request object used 
        to retrieve details of the incoming request.
    :param chart_name: The name of the generated chart 
        (used to build the URL).
    :return: A dictionary with the chart URL or an error message 
        if no chart is found.
    """
    if not chart_name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='No data found.'
        )

    host = req.headers.get("host")
    url_scheme = req.headers.get("X-Forwarded-Proto", req.url.scheme)

    return {
        'detail': f'{url_scheme}://{host}/static/charts/{chart_name}.png',
    }
