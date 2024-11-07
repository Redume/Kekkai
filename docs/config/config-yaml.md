Kekkai can be configured using the `config.yaml` file in the working directory. `config.example.yaml`.

??? "Example file `config.example.yaml`"
    ```
    # For more information, see the documentation
    # https://kekkai-docs.redume.su/

    database:
        user: 'DATABASE_USERNAME'
        password: 'DATABASE_PASSWORD'
        host: 'DATABASE_HOST'
        name: 'DATABASE_NAME'
        port: 5432
    server:
        host: '0.0.0.0'
        ssl:
            private_key: '/CertSSL/privkey.pem'
            cert: '/CertSSL/fullchain.pem'
            work: true
        log:
            print: true
            level: 'info'
    analytics:
        plausible_api: 'https://plausible.io/api/event/'
        plausible_domain: 'PLAUSIBLE_DOMAIN'
        plausible_token: 'PLAUSIBLE_TOKEN'
        work: true
    currency:
        chart:
            save: false
        collecting:
            fiat: true
            schedule: '30 8 * * *'
        fiat:
            - USD
            - RUB
            - EUR
            - UAH
            - TRY
            - KZT
    ```

## Database
Kekkai is used as a `PostgreSQL` database.

!!! info
    If you installed Kekkai via Docker Compose, then install it in the `database.host` value of `postgres`.
    The rest of the data does not have to be filled in. They need to be filled in `.env`.

    What should it look like:
    ```yaml
    database:
        ...
        host: 'postgres'
        ...
    ...
    ```

## Server
!!! info
    If you installed Kekkai via Docker Compose, then changing `server.host`, `server.ssl` is not recommended.

### SSL
Create a folder CertSSL to store your certificates
```shell
mkdir CertSSL
```

Copy your certificates to the CertSSL folder. 

It is recommended to rename the certificates to `privkey.pem` and `fullchain.pem`. If this is not possible, you need to change the SSL name in `nginx.conf` (if using Docker Compose)

## Analytics
Kekkai uses [`Plausbile`](https://plausible.io/) as an analyst. Minimal data is transferred for anilithics. Such as: browser, OS, status code, url, where the user came from. Most of the data is built on User Agent. It is possible to disable analytics in Kekkai.


??? note 
    ```yaml
    ...
    analytics:
        plausible_api: 'https://plausible.io/api/event/'
        plausible_domain: 'PLAUSIBLE_DOMAIN'
        plausible_token: 'PLAUSIBLE_TOKEN'
        work: true
    ...
    ```

- `plausible_api`: This is where the Plausible instance is specified. The official instance is specified by default.
- `plausible_domain`: Kekkai Instance Domain. It should be added to Plausible first, and then to the config. You can add the domain [here](https://plausible.io/sites/new?flow=provisioning).
- `plausible_token`: Api token for authorization and sending requests. You can create it [here](https://plausible.io/settings/api-keys).
- `work`: Enable or disable analytics. 

## Currency
`DuckDuckGo` (fiat currency collection) is used to collect currency rates.

??? note
    ```yaml
    ...
    currency:
        chart:
            save: false
    collecting:
        fiat: true
        schedule: '30 8 * * *'
    fiat:
        - USD
        - RUB
        - EUR
        - UAH
        - TRY
        - KZT
    ```

- `currency.chart.save`: Enable or disable saving graphs.
- `currency.collecting`: Enable or disable cryptocurrency or fiat currency exchange rate collection.
- `currency.schedule`: Currency collection interval (Configurable via cron. It is recommended to use [crontab.guru](https://crontab.guru), not supported in `Non-standard format`, like `@daily`).
- `currency.fiat`: A list of fiat currencies that will be saved to the database.