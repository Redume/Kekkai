from datetime import datetime
import dateutil.relativedelta

from fastapi import APIRouter, status, Request, Response

from chart.function.create_chart import create_chart

router = APIRouter()

@router.get("/api/getChart/{period}", status_code=status.HTTP_201_CREATED)
async def get_chart_period(
        response: Response,
        request: Request,
        from_currency: str = None,
        conv_currency: str = None,
        period: str = None,
):

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
    start_date = end_date + dateutil.relativedelta.relativedelta(months=month, days=days, years=years)

    chart = await create_chart(
        from_currency,
        conv_currency,
        start_date.strftime('%Y-%m-%d'),
        end_date.strftime('%Y-%m-%d')
    )

    return await prepare_chart_response(response, request, chart)


async def prepare_chart_response(response: Response, request: Request, chart_name: str):
    if not chart_name:
        response.status_code = status.HTTP_404_NOT_FOUND
        return {'message': 'No data found.', 'status_code': status.HTTP_404_NOT_FOUND}

    host = request.headers.get("host")
    url_schema = request.url.scheme

    return {
        'status': status.HTTP_201_CREATED,
        'message': f'{url_schema}://{host}/static/charts/{chart_name}.png',
    }
