Currencies are identified by standard three-letter `ISO 4217` currency codes.

## Get data on available dates and currencies.

### Request
=== "Shell"
=== "Curl"
```bash
curl --request GET \
--url https://kekkai-api.redume.su/api/metadata/
```

=== "Python"
    === "Requests"
        ```py
        import requests
        
        res = requests.get('https://kekkai-api.redume.su/api/metadata/', timeout=3)

        print(res.json())
        ```

=== "Node.JS"
    === "Axios"
        ```js
        const axios = require('axios');

        axios.get('https://kekkai-api.redume.su/api/metadata/')
            .then((res) => {
                console.log(JSON.stringify(res.json()));
            })
            .catch((err) => {
                console.error(err);
            });
        ```

### Response
!!! info "Output"
    ```json
    {
        "first_date": "2024-11-26T21:00:00.000Z",
        "last_date": "2025-01-01T21:00:00.000Z",
        "currencies": {
            "crypto": [
                "USDT",
                "TON",
                "BTC",
                "ETH"
            ],
            "fiat": [
                "USD",
                "RUB",
                "EUR",
                "UAH",
                "TRY",
                "KZT"
            ]
        }
    }
    ```
