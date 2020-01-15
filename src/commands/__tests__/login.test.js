const loginCommand = require("../login");

const dummyContext = (userId, message) => ({
  from: {
    id: userId
  },
  message: {
    text: message
  },
  reply: jest.fn()
});

describe("login command", () => {
  it("is a function", async () => {
    expect(typeof loginCommand).toEqual("function");
  });

  let loginParams;
  let middlewareParams;

  const resetLoginParams = () => {
    loginParams = {
      authenticator: jest.fn(),
      authenticatedUsers: new Map(),
      loginFailedHandler: jest.fn(),
      loginSucceededHandler: jest.fn(),
      loginRedundantHandler: jest.fn(),
      loginHelpHandler: jest.fn()
    };
  };
  const resetMiddlewareParams = () => {
    middlewareParams = [{}, jest.fn()];
  };

  resetLoginParams();
  resetMiddlewareParams();
  beforeEach(() => {
    resetLoginParams();
    resetMiddlewareParams();
  });

  Object.keys(loginParams).forEach(key => {
    it(`throws an error if parameter ${key} is missing`, async () => {
      const paramsWithoutKey = {
        ...loginParams,
        [key]: undefined
      };
      expect(() => loginCommand(paramsWithoutKey)).toThrow();
    });
  });

  it("returns a function", async () => {
    expect(typeof loginCommand(loginParams)).toEqual("function");
  });

  it(`returns a function that throws an error if parameter ctx is missing`, async () => {
    await expect(
      loginCommand(loginParams)(undefined, jest.fn())
    ).rejects.toThrow();
  });

  it(`returns a function that throws an error if parameter next is missing`, async () => {
    await expect(loginCommand(loginParams)({})).rejects.toThrow();
  });

  describe("login middleware", () => {
    let middleware;
    beforeEach(() => {
      resetLoginParams();
      resetMiddlewareParams();
      middleware = loginCommand(loginParams);
    });

    it("calls the help handler if no login string is provided", async () => {
      const userId = "some-id";
      const customMiddlewareParams = [
        dummyContext(userId, "/login"),
        middlewareParams[1]
      ];

      await middleware(...customMiddlewareParams);

      expect(loginParams.loginHelpHandler).toHaveBeenCalled();
    });

    it("calls the login redundant handler if the user is already logged in", async () => {
      const userId = "someId";
      loginParams.authenticatedUsers.set(userId, {});

      const customMiddlewareParams = [
        dummyContext(userId, "/login something"),
        middlewareParams[1]
      ];

      await middleware(...customMiddlewareParams);

      expect(loginParams.loginHelpHandler).not.toHaveBeenCalled();
      expect(loginParams.loginRedundantHandler).toHaveBeenCalled();
    });

    it("calls the authenticator function with the userId and token and calls the authentication succeeded handler and puts the user in the authenticatedUsers", async () => {
      const userId = "someId";
      const userObject = {};
      loginParams.authenticator = jest.fn(() => {
        return userObject;
      });
      middleware = loginCommand(loginParams);

      const customMiddlewareParams = [
        dummyContext(userId, "/login something"),
        middlewareParams[1]
      ];

      await middleware(...customMiddlewareParams);

      expect(loginParams.loginHelpHandler).not.toHaveBeenCalled();
      expect(loginParams.loginRedundantHandler).not.toHaveBeenCalled();
      expect(loginParams.authenticator).toHaveBeenCalledWith({
        userId,
        token: "something"
      });
      expect(loginParams.authenticatedUsers.get(userId)).toBe(userObject);
      expect(loginParams.loginSucceededHandler).toHaveBeenCalled();
    });

    it("calls the login failed handler if the authenticator returns undefined", async () => {
      const userId = "someId";
      loginParams.authenticator = jest.fn(() => undefined);
      middleware = loginCommand(loginParams);

      const customMiddlewareParams = [
        dummyContext(userId, "/login something"),
        middlewareParams[1]
      ];

      await middleware(...customMiddlewareParams);

      expect(loginParams.loginFailedHandler).toHaveBeenCalled();
    });
  });
});
