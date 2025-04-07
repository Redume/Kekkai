"""
This module defines the route for fetching a chart for a specific currency pair and period.

It includes the endpoint `/api/getChart/{period}` which allows users to request a chart for
a given currency pair (from_currency and conv_currency)
over a specified time period (week, month, quarter, or year).
"""
from datetime import datetime
from dateutil.relativedelta import relativedelta

from fastapi import APIRouter, status, Request, Response

from function.create_chart import create_chart

# pylint: disable=duplicate-code
router = APIRouter()

@router.get("/api/getChart/{period}", status_code=status.HTTP_201_CREATED)
async def get_chart_period(
        response: Response,
        request: Request,
        from_currency: str = None,
        conv_currency: str = None,
        period: str = None,
):
    """
    Fetches a chart for a given currency pair and a specific period.

    The period can be one of the following: 'week', 'month', 'quarter', 'year'.
    Based on the selected period, it calculates the start date and retrieves the chart data.

    :param response: The response object used to set status and message.
    :param request: The request object used to retrieve details of the incoming request.
    :param from_currency: The base currency in the pair (e.g., 'USD').
    :param conv_currency: The target currency in the pair (e.g., 'EUR').
    :param period: The time period for which the chart is requested
    (e.g., 'week', 'month', 'quarter', 'year').
    :return: A response containing the chart URL or an error message if parameters are invalid.
    """
    if not from_currency or not conv_currency:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {
            'status': status.HTTP_400_BAD_REQUEST,
            'message': 'The from_currency and conv_currency fields are required.',
        }

    if period not in ['week', 'month', 'quarter', 'year']:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {'message': 'Invalid period.', 'status_code': status.HTTP_400_BAD_REQUEST}

    days, month, years = 0, 0, 0

    if period == 'week':
        days = -7
    elif period == 'month':
        month = -1
    elif period == 'quarter':
        month = -3
    elif period == 'year':
        years = -1

    end_date = datetime.now()
    start_date = end_date + relativedelta(months=month, days=days, years=years)

    chart = await create_chart(
        from_currency,
        conv_currency,
        start_date.strftime('%Y-%m-%d'),
        end_date.strftime('%Y-%m-%d')
    )

    return await prepare_chart_response(response, request, chart)


async def prepare_chart_response(
        response: Response,
        request: Request,
        chart_name: str
):
    """
    Prepares the response to return the URL of the generated chart.

    If the chart data is not found, it returns a 404 error with an appropriate message.
    Otherwise, it returns a URL to access the chart image.

    :param response: The response object used to set status and message.
    :param request: The request object used to retrieve details of the incoming request.
    :param chart_name: The name of the generated chart (used to build the URL).
    :return: A dictionary with the chart URL or an error message if no chart is found.
    """
    if not chart_name:
        response.status_code = status.HTTP_404_NOT_FOUND
        return {'message': 'No data found.', 'status_code': status.HTTP_404_NOT_FOUND}

    host = request.headers.get("host")
    url_scheme = request.headers.get("X-Forwarded-Proto", request.url.scheme)

    return {
        'detail': f'{url_scheme}://{host}/static/charts/{chart_name}.png',
    }
