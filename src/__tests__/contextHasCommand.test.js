const contextHasCommand = require("../contextHasCommand");

describe("contextHasCommand", () => {
  it("is a function", async () => {
    expect(typeof contextHasCommand).toEqual("function");
  });

  it("throws an error if ctx is missing", async () => {
    expect(() => contextHasCommand({ command: jest.fn() })).toThrow();
  });

  it("throws an error if command is missing", async () => {
    expect(() => contextHasCommand({ ctx: {} })).toThrow();
  });

  it("returns true if the context is of type message and the message starts with /{command}", async () => {
    const ctx = {
      updateType: "message",
      message: {
        text: "/test bli bla blub"
      }
    };
    const command = "test";

    expect(contextHasCommand({ ctx, command })).toEqual(true);
  });

  it("returns false if the context is not of type message", async () => {
    const ctx = {
      updateType: "blub",
      message: {
        text: "/test bli bla blub"
      }
    };
    const command = "test";

    expect(contextHasCommand({ ctx, command })).toEqual(false);
  });

  it("returns false if the message does not start with /{command}", async () => {
    const ctx = {
      updateType: "message",
      message: {
        text: "uiae eaui"
      }
    };
    const command = "test";

    expect(contextHasCommand({ ctx, command })).toEqual(false);
  });
});
