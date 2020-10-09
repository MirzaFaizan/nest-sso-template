# Nest JS SSO boilerplate

## Description

This `nest` template offers a developer ready to go experience, 0 setup required with pre built SSO and much more. batteries included.

- MariaDB
- Bcrypt
- Send Grid Mail
- Redis
- TypeORM

Following plugins were added for enhanced developer experience:

- TypeScript
- Jest with supertest
- Eslint with prettier
- Husky hooks

## Requirements

- Docker
- NodeJS
- TypeScript

## Installation

```
bash
# docker setup
docker-compose up -d

# copy sample env file to .env file
cp sample.env .env

# install required dependencies
yarn install

# run migrations
yarn migrate
```

## Running the app

```
bash
# development watch mode
yarn start:dev

# production mode
yarn start:prod
```
