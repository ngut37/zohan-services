# Zohan services
This repository is for the back-end side application for the Zohan project.
It's RESTful API that allows CRUD operations.
## 🪜 Stack
- router: [Koa-Joi router](https://www.npmjs.com/package/koa-joi-router)
- database: [MongoDB](https://www.mongodb.com/)
- ODM/ORM: [mongoose](https://mongoosejs.com/)
## 🏃‍♂️ How to run (the app)
- Install the packages.
- **Create an `.env` file**
- (optional): seed the database with cadastral data
- run the app

_📌 Note: [yarn](https://yarnpkg.com/) is used in this project_
### Install packages
```bash
$ yarn
```
### Environment variables
#### App
- `APP_ENV` - (`development` | `test` | `production`) application environment
- `PORT` - (integer) port number for the app to listen on
#### Database
- `MONGO_URL` - (MongoDB URI) URI of the database the app will be accessing
#### JWT tokens
- `ACCESS_TOKEN_SECRET` - (string) secret for generating and validating access tokens
- `REFRESH_TOKEN_SECRET` - (string) secret for generating and validating refresh tokens
- `ACCESS_TOKEN_EXPIRATION_DURATION` - (timespan format [vercel/ms](https://github.com/zeit/ms.js)) access token expiration time
- `REFRESH_EXPIRATION_DURATION` - (timespan format [vercel/ms](https://github.com/zeit/ms.js)) refresh token expiration interval
### Build and run
```bash
$ yarn build
$ yarn start
```
### Monitored run (development)
```bash
$ yarn dev
```
### Seed cadastral data
_📌 Note: this should be run locally. Change the `MONGO_URL` in `.env` and set the seeding destination_
```bash
$ yarn build
$ yarn start:seed-cadastral-data
```