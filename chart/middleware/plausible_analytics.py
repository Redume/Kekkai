"""
This module provides middleware for integrating Plausible Analytics
into a FastAPI application.
"""
from http import HTTPStatus

import httpx
from user_agents import parse as ua_parse

from chart.utils.load_config import load_config

config = load_config('config.yaml')

# pylint: disable=too-few-public-methods
class PlausibleAnalytics:
    """
    Middleware for sending events to Plausible Analytics.

    This middleware intercepts each incoming request, collects metadata such as
    user-agent, request path, and response status, and sends it as an event to
    Plausible Analytics.
    """
    async def __call__(self, request, call_next):
        response = await call_next(request)

        if HTTPStatus(response.status_code).is_client_error:
            return response

        user_agent = request.headers.get('user-agent', 'unknown')
        user_agent_parsed = ua_parse(user_agent)

        event = {
            "domain": config['analytics']['plausible_domain'],
            "name": request.url.path or '404 - Not Found',
            "url": str(request.url),
            "props": {
                "method": request.method,
                "statusCode": response.status_code,
                "browser": f"{user_agent_parsed.browser.family} "
                           f"{user_agent_parsed.browser.version_string}",
                "os": f"{user_agent_parsed.os.family} "
                      f"{user_agent_parsed.os.version_string}",
                "source": request.headers.get('referer', 'direct'),
            },
        }

        async with httpx.AsyncClient() as client:
            try:
                await client.post(
                    config['analytics']['plausible_api'],
                    json=event,
                    headers={
                        "Authorization": f"Bearer {config['analytics']['plausible_token']}",
                        "Content-Type": "application/json",
                        "User-Agent": request.headers.get('user-agent', 'unknown'),
                    },
                )
            except httpx.RequestError as e:
                print(f"Request error while sending event to Plausible: {e}")
            except httpx.HTTPStatusError as e:
                print(f"HTTP status error while sending event to Plausible: {e}")
            # pylint: disable=broad-exception-caught
            except Exception as e:
                print(f"Unexpected error sending event to Plausible: {e}")

        return response
