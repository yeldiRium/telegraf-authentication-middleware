const logoutCommand = require("../logout");

const dummyContext = (userId, message) => ({
  from: {
    id: userId
  },
  message: {
    text: message
  },
  reply: jest.fn()
});

describe("logout command", () => {
  it("is a function", async () => {
    expect(typeof logoutCommand).toEqual("function");
  });

  let logoutParams;
  let middlewareParams;

  const resetLogoutParams = () => {
    logoutParams = {
      authenticatedUsers: new Map(),
      logoutHandler: jest.fn(),
      logoutRedundantHandler: jest.fn()
    };
  };
  const resetMiddlewareParams = () => {
    middlewareParams = [{}, jest.fn()];
  };

  resetLogoutParams();
  resetMiddlewareParams();
  beforeEach(() => {
    resetLogoutParams();
    resetMiddlewareParams();
  });

  Object.keys(logoutParams).forEach(key => {
    it(`throws an error if parameter ${key} is missing`, async () => {
      const paramsWithoutKey = {
        ...logoutParams,
        [key]: undefined
      };
      expect(() => logoutCommand(paramsWithoutKey)).toThrow();
    });
  });

  it("returns a function", async () => {
    expect(typeof logoutCommand(logoutParams)).toEqual("function");
  });

  it(`returns a function that throws an error if parameter ctx is missing`, async () => {
    await expect(
      logoutCommand(logoutParams)(undefined, jest.fn())
    ).rejects.toThrow();
  });

  it(`returns a function that throws an error if parameter next is missing`, async () => {
    await expect(logoutCommand(logoutParams)({})).rejects.toThrow();
  });

  describe("logout middleware", () => {
    let middleware;
    beforeEach(() => {
      resetLogoutParams();
      resetMiddlewareParams();
      middleware = logoutCommand(logoutParams);
    });

    it("calls the logout redundant helper if the user is not logged in", async () => {
      const userId = "some-id";
      const customMiddlewareParams = [
        dummyContext(userId, "/logout"),
        middlewareParams[1]
      ];

      await middleware(...customMiddlewareParams);

      expect(logoutParams.logoutRedundantHandler).toHaveBeenCalled();
    });

    it("calls the logout handler and removes the user", async () => {
      const userId = "some-id";
      const userObject = {};
      logoutParams.authenticatedUsers.set(userId, userObject);
      const customMiddlewareParams = [
        dummyContext(userId, "/logout"),
        middlewareParams[1]
      ];

      await middleware(...customMiddlewareParams);

      expect(logoutParams.logoutHandler).toHaveBeenCalled();
      expect(logoutParams.authenticatedUsers.get(userId)).toBe(undefined);
    });
  });
});
