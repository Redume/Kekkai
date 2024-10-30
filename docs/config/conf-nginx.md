Kekkai is used by `Nginx` to redirect to the correct microservice.

## Change domain

Change localhost to your `domain` or `ipv4` based on your needs. If you need to use Kekkai locally, you don't need to change anything,

??? note
    ```
    ...
    server_name localhost; # Your domain
    ...
    ```


## Change name for SSL
This is where the name of the SSL files changes. This needs to be edited if you have a different one

Change `privkey.pem` and `fullchain.pem` to the names of the files you have.

??? note
    ```
    ...
    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    ...
    ```

