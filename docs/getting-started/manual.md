For full use, you need to install `Node.JS v20`, `PostgreSQL v15`, `Python v13.3`, `Nginx`

### Steps 1 - Preparing files

```shell
git clone https://github.com/Redume/Kekkai.git
```

```shell
cd Kekkai
```

### Steps 2 - Change config files

??? note "Nginx Configuration"
    In `nginx.conf`, you need to specify your domain or ipv4 address
    ```nginx
        ...
            listen 443 ssl;
            server_name localhost; # Your domain
        ...
    ```

??? note "The main config is `config_sample.yaml` for Kekkai"
    ```yaml
    database: 
        user: 'DATABASE_USERNAME'
        password: 'DATABASE_PASSWORD'
        host: 'DATABASE_HOST'
        name: 'DATABASE_NAME'
        port: 5432
    ...
    ```

    Fill in the data in the `database` item, as well as in the `.env` config

### Steps 3 - Install libs

Install library. In `/shared/logger`, `/shared/config`, `/shared/database`, `/collect-currency`,` /server`, 
the required node.JS libraries In each of the directories, you need to write this command

```shell
npm install
```

and install python libs
```shell
pip install -r requirements.txt
```

Start the nginx service
```shell
sudo systemctl start nginx.service
```

### Steps 4 - Launch Services

Launch each of the services
There are all three services `MainService`, `Collect-currency`, `Chart`

- `MainService` is an API for getting the exchange rate
```shell
cd server & node .
```
- `Collect-Currency` is a service for collecting  and save the rate in a database
```shell
cd collect-currency/src/ && node .
```
- `ChartService` is a service for creating currency rate charts
```shell
python3 main.py
```