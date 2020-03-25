const guardMiddleware = require("../guardMiddleware");

describe("guard middleware", () => {
  it("is a function", async () => {
    expect(typeof guardMiddleware).toEqual("function");
  });

  it("throws an error if parameter unauthenticatedAccessHandler is missing", async () => {
    expect(() => guardMiddleware()).toThrow();
  });

  it("calls the unauthenticated access handler if no user is in the ctx", async () => {
    const unauthenticatedAccessHandler = jest.fn();
    const ctx = {};
    const next = jest.fn();

    await guardMiddleware({ unauthenticatedAccessHandler })(ctx, next);

    expect(unauthenticatedAccessHandler).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it("calls next if a user is in the ctx", async () => {
    const unauthenticatedAccessHandler = jest.fn();
    const ctx = {
      user: {},
    };
    const next = jest.fn();

    await guardMiddleware({ unauthenticatedAccessHandler })(ctx, next);

    expect(unauthenticatedAccessHandler).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
});
