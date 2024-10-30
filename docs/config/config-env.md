Kekkai can be configured using the `.env` file in the working directory. `.env.example`.

`.env` config is used to configure PosgreSQL running in Docker Compose.

!!! info
    If you are not using Docker Compose, you do not need to edit this config

??? note "Example file `.env.example`"
    ```
    # Connection secret for postgres. You should change it to a random password
    # Please use only the characters `A-Za-z0-9`, without special characters or spaces

    POSTGRES_PASSWORD=my_password

    # If you do not know what you are doing, then you should not edit the values below
    ###################################################################################
    POSTGRES_DB=kekkai
    DB_HOST=postgres
    POSTGRES_USER=postgres
    ```

This config only edits the password for PosgreSQL.

Please use only the characters `A-Za-z0-9`, without special characters or spaces