# Telegraf Authentication Middleware

A simple authentication middleware for the [telegraf](https://github.com/telegraf/telegraf) framework.

```sh
npm install @yeldirium/telegraf-authentication-middleware
# or
yarn install @yeldirium/telegraf-authentication-middleware
```

## Status

| Category         | Status                                                                                                                                                            |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Version          | [![npm](https://img.shields.io/npm/v/@yeldirium/telegraf-authentication-middleware)](https://www.npmjs.com/package/@yeldirium/telegraf-authentication-middleware) |
| Dependencies     | ![David](https://img.shields.io/david/yeldirium/telegraf-authentication-middleware)                                                                               |
| Dev dependencies | ![David](https://img.shields.io/david/dev/yeldirium/telegraf-authentication-middleware)                                                                           |
| Build            | ![GitHub Actions](https://github.com/yeldiRium/telegraf-authentication-middleware/workflows/Release/badge.svg?branch=master)                                      |
| License          | ![GitHub](https://img.shields.io/github/license/yeldiRium/telegraf-authentication-middleware)                                                                     |

# Why this module?

If you have a telegram application and want to let your users login to a sission
via `/login <token>` and logout via `/logout` and supply the authentication
method by yourself, then this is for you.
You provide a way to authenticate users based on user id and login token and you
may provide a number of handlers for the various of the login/logout process.

# How to use it?

```javascript
const makeAuthenticator = require("@yeldirium/telegraf-authentication-middleware");
const telegraf = require("telegraf");

// Very naive implementation of an authentication method.
const authenticator = async ({ userId, token }) => {
  const user = await database.lookupUser(userId);
  if (user.token === token) {
    return user;
  }
  return undefined;
};

const { middleware, guardMiddleware } = makeAuthenticator({ authenticator });

const bot = telegraf(token);

bot.use(middleware);

// The guardMiddleware terminates the request if no user is logged in.
bot.command("restricted", guardMiddleware(), ctx => {
  console.log(ctx.user); // The currently logged in user.
});
```

You can start the `authenticator` with a map of authenticated users. This way
you can store sessions in a database and retrieve them on startup:

```javascript
const makeAuthenticator = require("@yeldirium/telegraf-authentication-middleware");
const telegraf = require("telegraf");

const authenticatedUsers = new Map();
(await database.findAuthenticatedUsers()).forEach(({ userId, userObject }) => {
  authenticatedUsers.set(userId, userObject);
});

// Very naive implementation of an authentication method.
const authenticator = async ({ userId, token }) => {
  // ...
};

const { middleware } = makeAuthenticator({ authenticator, authenticatedUsers });
```

And dump the users that currently authenticated to store them somewhere:

```javascript
// ...
const { middleware, getAuthenticatedUsers } = makeAuthenticator({
  authenticator
});

console.log(getAuthenticatedUsers()); // Map of all currently authenticated users.
```
