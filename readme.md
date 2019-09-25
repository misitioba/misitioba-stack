# misitioba-stack

Docker stack (docker-compose) for misitioba.com

## Features

- netdata
- portainer
- mongo + gui (mongo-express)
- mysql + gui (adminer)

## Enviromental variables

```md
MONGO_ROOT_USERNAME=
MONGO_ROOT_PWD=
MYSQL_ROOT_PWD=
```

## Usage

- Copy env-example into .env

- Configure .env

- Run compose in headless mode

    ```js
    docker-compose up -d
    ```

## Database data

The data is persistent and mounted from:

- ./mongo
- ./mysql

## Questions

- misitioba.com
- arancibiajav@gmail.com