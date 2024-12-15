"""
This module contains the route for retrieving a chart based on a given currency pair and date range.
It defines the `/api/getChart/` endpoint that processes requests for generating charts.
"""
from fastapi import APIRouter, status, Request, Response
from pydantic import BaseModel

from chart.function.create_chart import create_chart
from chart.routes.get_chart_period import prepare_chart_response

router = APIRouter()

class ChartRequestParams(BaseModel):
    """
    A Pydantic model that represents the request parameters for generating a chart.

    This model is used to validate and group the request parameters:
    from_currency, conv_currency, start_date, and end_date.
    """
    from_currency: str
    conv_currency: str
    start_date: str
    end_date: str

@router.get("/api/getChart/", status_code=status.HTTP_201_CREATED)
async def get_chart(
        response: Response,
        request: Request,
        params: ChartRequestParams
):
    """
    Fetches a chart for a given currency pair and date range.

    :param response: The response object used for returning the HTTP response.
    :param request: The request object containing details about the incoming request.
    :param params: Contains the request parameters:
    from_currency, conv_currency, start_date, and end_date.
    :return: A chart or an error message if the request is invalid.
    """
    if not params.from_currency or not params.conv_currency:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {
            'status': status.HTTP_400_BAD_REQUEST,
            'message': 'The from_currency and conv_currency fields are required.',
        }

    if not params.start_date or not params.end_date:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {
            'status': status.HTTP_400_BAD_REQUEST,
            'message': 'The start_date and end_date fields are required.',
        }

    chart = await create_chart(
        params.from_currency,
        params.conv_currency,
        params.start_date,
        params.end_date
    )
    return await prepare_chart_response(response, request, chart)
