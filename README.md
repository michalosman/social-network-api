# Odinbook API

This is an API part of an Odinbook which I made as a [final project](https://www.theodinproject.com/lessons/nodejs-odin-book) submission for [The Odin Project](https://www.theodinproject.com/).

[Frontend repository](https://github.com/michalosman/odinbook)

[Live Demo](https://odinbook-mo.netlify.app/) :point_left:

## Endpoints

### Users

| Description                 | Method | URL                           |
| --------------------------- | ------ | ----------------------------- |
| Register                    | POST   | /api/users/register           |
| Login                       | POST   | /api/users/login              |
| Logout from current session | POST   | /api/users/logout             |
| Logout from all sessions    | POST   | /api/users/logout/all         |
| Get current user data       | GET    | /api/users                    |
| Get other user profile      | GET    | /api/users/:id                |
| Search users                | GET    | /api/users/search             |
| Edit own profile            | PATCH  | /api/users                    |
| Request friend              | PATCH  | /api/users/:id/friend/request |
| Accept friend               | PATCH  | /api/users/:id/friend/accept  |
| Reject friend               | PATCH  | /api/users/:id/friend/reject  |
| Remove friend               | PATCH  | /api/users/:id/friend/remove  |

### Posts

| Description       | Method | URL                         |
| ----------------- | ------ | --------------------------- |
| Create post       | POST   | /api/posts                  |
| Get own feed      | GET    | /api/posts/feed             |
| Get user timeline | GET    | /api/posts/timeline/:userId |
| Like post         | PATCH  | /api/posts/:id/like         |
| Unlike post       | PATCH  | /api/posts/:id/unlike       |

### Comments

| Description       | Method | URL                   |
| ----------------- | ------ | --------------------- |
| Create comment    | POST   | /api/comments/:postId |
| Get post comments | GET    | /api/comments/:postId |

## Technologies used

- [TypeScript](https://www.typescriptlang.org/)
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [JWT](https://jwt.io/)
- [zod](https://zod.dev/)
- [supertest](https://github.com/visionmedia/supertest)
- [mongodb-memory-server](https://github.com/nodkz/mongodb-memory-server)
- [Postman](https://www.postman.com/)

## Getting started

### Clone repository

```
git clone https://github.com/michalosman/odinbook-api.git
cd odinbook-api
```

### Set up environment variables

```
PORT=<The port the server will run on, e.g. 5000>
CLIENT_URL=<Address of the client, e.g. http://localhost:3000/>
MONGO_URI_PROD=<URI used to connect to a production MongoDB database>
MONGO_URI_DEV=<URI used to connect to a development MongoDB database>
SESSION_SECRET=<Secret used to sign the session ID cookie>
ACCESS_TOKEN_PUBLIC_KEY=<Public access token RSA key>
ACCESS_TOKEN_PRIVATE_KEY=<Private access token RSA key>
REFRESH_TOKEN_PUBLIC_KEY=<Public refresh token RSA key>
REFRESH_TOKEN_PRIVATE_KEY=<Private refresh token RSA key>
MY_USER_ID=<Your user ID (optional)>
TEST_USER_ID=<Test user ID (optional)>
```

### Install packages and start server

```
npm i
npm start
```

## Notes

### Database schema

![database schema](https://user-images.githubusercontent.com/40360401/179564502-f6736f42-4671-4c65-8b10-2c29d655dfcb.png)

### Error handling

#### HTTP error classes

Makes throwing errors more intuitive and explicit

```js
// Before
if (doesExist) {
  throw new Error('User already exists')
}
```

```js
// After
if (doesExist) {
  throw new Conflict('User already exists')
}
```

#### Error handler middleware

Handles all errors in one place

```js
// Before
try {
  const user = await UserService.register(req.body)
  res.json({ data: user })
} catch (error) {
  res.json({
    error: {
      code: error.code,
      message: error.message,
    },
  })
}
```

```js
// After
try {
  const user = await UserService.register(req.body)
  res.json({ data: user })
} catch (error) {
  next(error)
}
```

#### express-async-errors library

Passes thrown errors straight to error handler

```js
// Before
try {
  const user = await UserService.register(req.body) // this will throw
  res.json({ data: user })
} catch (error) {
  next(error)
}
```

```js
// After
const user = await UserService.register(req.body) // this will throw
res.json({ data: user })
```

### Authentication

For users authentication I used JWT tokens which are stored on client side as cookies (accessToken & refreshToken). The access token expires every 5 minutes and is used for short term authentication. The refresh token expires every year and is used to refresh access tokens.

#### Security

Refresh tokens are stored in database and are verified on each access token refresh. If refresh token gets stolen user can use "Logout from all sessions" option to remove all tokens from database so they can't be used to refresh the access token anymore.

#### Flow

The diagram below represents the flow of processing authenticated requests.

![JWT](https://user-images.githubusercontent.com/40360401/179546347-13e54e46-5c28-45bf-b2e5-bbc5d01a58d0.png)
