const makeAuthenticator = require("../");

describe("telegraf-authentication-middleware", () => {
  it("full usage", async () => {
    const userId = "some-id";
    const userObject = {};
    const token = "something";
    const authenticator = jest.fn(({ token }) => {
      expect(token).toEqual(token);
      return userObject;
    });
    const { middleware, getAuthenticatedUser } = makeAuthenticator({
      authenticator
    });

    const loginCtx = {
      updateType: "message",
      from: {
        id: userId
      },
      message: {
        text: `/login ${token}`
      },
      reply: jest.fn()
    };
    const next = () => {};

    await middleware(loginCtx, next);

    const user = getAuthenticatedUser({ userId });
    expect(user).toBe(userObject);

    const anyCtx = {
      updateType: "blub",
      from: {
        id: userId
      },
      message: {
        text: "irrelevant"
      },
      reply: jest.fn()
    };

    await middleware(anyCtx, next);

    expect(anyCtx.user).toBe(userObject);

    const logoutCtx = {
      updateType: "message",
      from: {
        id: userId
      },
      message: {
        text: "/logout"
      },
      reply: jest.fn()
    };

    await middleware(logoutCtx, next);

    const user2 = getAuthenticatedUser({ userId });
    expect(user2).toEqual(undefined);
  });

  it("set authenticated users on startup", async () => {
    const userId = "some-id";
    const userObject = {};
    const authenticatedUsers = new Map();
    authenticatedUsers.set(userId, userObject);

    const { middleware, getAuthenticatedUsers } = makeAuthenticator({
      authenticator: jest.fn(),
      authenticatedUsers
    });

    const anyCtx = {
      updateType: "blub",
      from: {
        id: userId
      },
      message: {
        text: "irrelevant"
      },
      reply: jest.fn()
    };
    const next = () => {};

    await middleware(anyCtx, next);

    expect(getAuthenticatedUsers()).toEqual(new Map([[userId, userObject]]));
  });
});
