Docker Compose is the recommended method to run Kekkai in production. 
Below are the steps to deploy Kekkai with Docker Compose.

Kekkai requires Docker Compose version 2.x.

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
    ```
    ...
        listen 443 ssl;
        server_name localhost; # Your domain
    ...
    ```

    To set up SSL
    ```bash
    mkdir CertSLL
    ```

    After that, copy the SSL certificates to the `CertSSL` folder, if the names are different, 
    then change either the name of the certificates or in `nginx.conf`

    ```
    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    ```

??? note "The main config is `config.sample.yaml` for Kekkai"
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


??? note "`.env.sample` config for PostgreSQL"
    ```.env
    # Connection secret for postgres. You should change it to a random password
    # Please use only the characters `A-Za-z0-9`, without special characters or spaces

    POSTGRES_PASSWORD=my_password

    # If you do not know what you are doing, then you should not edit the values below
    ###################################################################################
    POSTGRES_DB=kekkai
    DB_HOST=postgres
    POSTGRES_USER=postgres
    ```

    - Populate custom database information if necessary.
    - Consider changing `DB_PASSWORD` to a custom value. 
    Postgres is not publically exposed, so this password is only used for - local authentication. 
    To avoid issues with Docker parsing this value, it is best to use only the characters `A-Za-z0-9`.

!!! note 
    After editing, rename the config files by removing `.sample` in the name


### Steps 3 - Start the containers
```shell title='Start the containers using docker compose command'
docker compose -f "docker-compose.yaml" up -d --build
```