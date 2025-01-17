Currencies are identified by standard three-letter `ISO 4217` currency codes.

## Getting the currency rate for a certain day.

### Request
=== "Shell"
    === "Curl"
        ```bash
        curl --request GET \
        --url https://kekkai-api.redume.su/api/getRate/?from_currency=RUB&conv_currency=USD&date=2024-10-16
        ```

=== "Python"
    === "Requests"
        ```py
        import requests

        res = requests.get('https://kekkai-api.redume.su/api/getRate/', {
            'from_currency': 'RUB',
            'conv_currency': 'USD',
            'date': '2024-10-16',
        }, timeout=3)

        print(res.json())
        ```


=== "Node.JS"
    === "Axios"
        ```js
        const axios = require('axios');

        axios.get('https://kekkai-api.redume.su/api/getRate/', {
            timeout: 3000,
            'from_currency': 'RUB',
            'conv_currency': 'USD',
            'date': '2024-10-16',
            }
        )
            .then((res) => {
                console.log(JSON.stringify(res.json()));
            })
            .catch((err) => {
                console.error(err);
            });
        ```

### Query Parameters
| Parameter         | Description                                                            |
|-------------------|------------------------------------------------------------------------|
| `from_currency`*  | `ISO 4217` code of the currency from which the conversion takes place  |
| `conv_currency`*  | `ISO 4217` code of the currency to which the conversion is performed   |
| `date`*           | Currency rate date in the format `YYYYY-DD-MM`                         |
| `conv_amount`     | Multiplier for number conversion (Optional)                            |

`*` - Required arguments

### Response
!!! info "Output"
    ```json
    [
        {
            "from_currency": "RUB",
            "conv_currency": "USD",
            "rate": 0.01,
            "date": "2024-10-17T00:00:00.000Z"
        }
    ]
    ```

## Get currency exchange rate for a certain period
Getting the list of the array with currency rate for a certain period of time.

### Request
=== "Shell"
    === "Curl"
        ```bash
        curl --request GET \
        --url https://kekkai-api.redume.su/api/getRate/?from_currency=RUB&conv_currency=USD&start_date=2024-10-16&end_date=2024-10-20
        ```

=== "Python"
    === "Requests"
        ```py
        import requests

        res = requests.get('https://kekkai-api.redume.su/api/getRate/', {
            'from_currency': 'RUB',
            'conv_currency': 'USD',
            'start_date': '2024-10-16',
            'end_date': '2024-10-20',
        }, timeout=3)

        print(res.json())
        ```


=== "Node.JS"
    === "Axios"
        ```js
        const axios = require('axios');

        axios.get('https://kekkai-api.redume.su/api/getRate/', {
            timeout: 3000,
            'from_currency': 'RUB',
            'conv_currency': 'USD',
            'start_date': '2024-10-16',
            'end_date': '2024-10-20',
            }
        )
            .then((res) => {
                console.log(res['data']);
            })
            .catch((err) => {
                console.error(err);
            });
        ```

### Query params
| Parameter        | Description                                                             |
|------------------|-------------------------------------------------------------------------|
| `from_currency`* | `ISO 4217` code of the currency from which the conversion takes place   |
| `conv_currency`* | `ISO 4217` code of the currency to which the conversion is performed    |
| `start_date`*    | Start date of the period in the format `YYYYY-DD-MM`                    |
| `end_date`*      | Period end date in the format `YYYYY-DD-MM`                             |

`*` - Required arguments

### Response
!!! info "Output"
    ```json
    [
        {
            "from_currency": "RUB",
            "conv_currency": "USD",
            "rate": 0.01,
            "date": "2024-10-17T00:00:00.000Z"
        },
        {
            "from_currency": "RUB",
            "conv_currency": "USD",
            "rate": 0.01,
            "date": "2024-10-18T00:00:00.000Z"
        },
        {
            "from_currency": "RUB",
            "conv_currency": "USD",
            "rate": 0.01,
            "date": "2024-10-19T00:00:00.000Z"
        },
        {
            "from_currency": "RUB",
            "conv_currency": "USD",
            "rate": 0.01,
            "date": "2024-10-20T00:00:00.000Z"
        },
        {
            "from_currency": "RUB",
            "conv_currency": "USD",
            "rate": 0.01,
            "date": "2024-10-21T00:00:00.000Z"
        }
    ]
    ```