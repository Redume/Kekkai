Creating a currency rate chart.

## Creating a graph for a certain period

### Request
=== "Shell"
    === "Curl"
        ```bash
        curl --request GET \
        --url https://kekkai-api.redume.su/api/getChart/week?from_currency=RUB&conv_currency=USD
        ```
=== "Python"
    === "Request"
        ```python
        import requests

        res = requests.get('https://kekkai-api.redume.su/api/getChart/week', {
            'from_currency': 'USD',
            'conv_currency': 'RUB',
        }, timeout=3)

        print(res.json())
        ```

=== "Node.JS"
    === "Axios"
        ```js
        const axios = require('axios');

        axios.get('https://kekkai-api.redume.su/api/getChart/week', {
            timeout: 3000,
            'from_currency': 'USD',
            'conv_currency': 'RUB',  
        })
            .then((res) => {
                console.log(res['data']);
            })
            .catch((err) => {
                console.error(err);
            });
        ```

### Query params
| Parameter      | Description                                                             |
|----------------|-------------------------------------------------------------------------|
| `from_currency`* | `ISO 4217` code of the currency from which the conversion takes place |
| `conv_currency`* | `ISO 4217` code of the currency to which the conversion is performed  |

### URL params
| Parameter     | Description                                                             |
|---------------|-------------------------------------------------------------------------|
| `period`      | Available parameters: `week`, `month`, `quarter`, `year`                |

`*` - Required arguments

### Response
!!! info "Output"
    ```json
    {
        "status": 201,
        "message": "http://kekkai-api.redume.su/static/charts/RUB_USD_20241108_DQVDN7.png"
    }
    ```


## Creating a schedule for specific days

### Request
=== "Shell"
    === "Curl"
        ```bash
        curl --request GET \
        --url https://kekkai-api.redume.su/api/getChart/?from_currency=RUB&conv_currency=USD&start_date=2024-10-31&end_date=2024-11-08
        ```
=== "Python"
    === "Request"
        ```python
        import requests

        res = requests.get('https://kekkai-api.redume.su/api/getChart/', {
            'from_currency': 'USD',
            'conv_currency': 'RUB',
            'start_date': '2024-10-31',
            'end_date': '2024-11-08'
        }, timeout=3)

        print(res.json())
        ```

=== "Node.JS"
    === "Axios"
        ```js
        const axios = require('axios');

        axios.get('https://kekkai-api.redume.su/api/getChart/', {
            timeout: 3000,
            'from_currency': 'USD',
            'conv_currency': 'RUB',  
            'start_date': '2024-10-31',
            'end_date': '2024-11-08'
        })
            .then((res) => {
                console.log(res['data']);
            })
            .catch((err) => {
                console.error(err);
            });
        ```

### Query params
| Parameter      | Description                                                             |
|----------------|-------------------------------------------------------------------------|
| `from_currency`* | `ISO 4217` code of the currency from which the conversion takes place |
| `conv_currency`* | `ISO 4217` code of the currency to which the conversion is performed  |
| `start_date`*    | Start date of the period in the format `YYYYY-DD-MM`                  |
| `end_date`*      | Period end date in the format `YYYYY-DD-MM`                           |

`*` - Required arguments

### Response
!!! info "Output"
    ```json
    {
        "status": 400,
        "message": "http://kekkai-api.redume.su/static/charts/RUB_USD_20241108_1T2RI3.png"
    }
    ```

## What the name of the chart file consists of
Example: ``.../RUB_USD_20241108_DQVDN7.png``

- `RUB_USD` - Name of currencies.
- `20241108` - Schedule request date in `YYYMMDD` format.
- `DQVDN7` - Random file character identifier.

All charts are in the charts folder, which is in the root directory (`./kekkai/chart`)