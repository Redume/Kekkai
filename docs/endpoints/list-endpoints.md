## API Base URL
All requests to our API should be directed to the URL below:

```
https://kekkai-api.redume.su/api/
```


## API Endpoints
Kekkai has 3 API endpoints: `getRate`, `getChart` and `configurations`. Below you will find a list of parameters that each endpoint requires and a description of what the API does.

| Service      | API Endpoint                                           | Description                                                        |
|--------------|--------------------------------------------------------|--------------------------------------------------------------------|
| Get Rate     | `https://kekkai-api.redume.su/api/getRate/`            | Get currency exchange rate for a specific day or period            |
| Create Chart | `https://kekkai-api.redume.su/api/getChart`            | Creating a chart with exchange rate                                |
| Get Config   | `https://kekkai-api.redume.su/api/configurations/json` | Get instance config file                                           |