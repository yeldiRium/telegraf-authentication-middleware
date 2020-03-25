/**
 * Returns a telegraf middleware that checks a given token or password or
 * whatever against an authentication function.
 * The `authenticator` function either returns a user object for valid creden-
 * tials or `null` or `undefined` for an invalid token.
 * After successful authentication the user is stored in the
 * `authenticatedUsers`.
 *
 * @param {*}        authenticator         An authentication strategy.
 * @param {Map}      authenticatedUsers    A map of authenticated users of the
 *                                         form userId => user object.
 * @param {Function} loginFailedHandler    A handler that is called when the
 *                                         login fails. May be asynchronous.
 * @param {Function} loginSucceededHandler A handler that is called when the
 *                                         login succeeds. May be asynchronous.
 * @param {Function} loginRedundantHandler A handler that is called when user is
 *                                         already logged in. May be asynchro-
 *                                         nous.
 * @param {Function} loginHelpHandler      A handler that is called when the
 *                                         login command is called with missing
 *                                         parameters. May be asynchronous.
 */
const login = ({
  authenticator,
  authenticatedUsers,
  loginFailedHandler,
  loginSucceededHandler,
  loginRedundantHandler,
  loginHelpHandler,
}) => {
  if (!authenticator) {
    throw new Error("Authenticator is missing.");
  }
  if (!authenticatedUsers) {
    throw new Error("Authenticated users are missing.");
  }
  if (!loginFailedHandler) {
    throw new Error("Login failed handler is missing.");
  }
  if (!loginSucceededHandler) {
    throw new Error("Login succeeded handler is missing.");
  }
  if (!loginRedundantHandler) {
    throw new Error("Login redundant handler is missing.");
  }
  if (!loginHelpHandler) {
    throw new Error("Login help handler is missing.");
  }

  return async (ctx) => {
    if (!ctx) {
      throw new Error("Ctx is missing.");
    }

    const token = ctx.message.text.slice("/login".length).trim();

    if (token.length === 0) {
      await loginHelpHandler({ ctx });
      return;
    }

    const userId = ctx.from.id;

    if (authenticatedUsers.has(userId)) {
      await loginRedundantHandler({ ctx });
      return;
    }

    const user = await authenticator({
      token: token,
      userId,
    });

    if (user === null || user === undefined) {
      await loginFailedHandler({
        ctx,
        token: token,
      });
      return;
    }

    authenticatedUsers.set(userId, user);

    await loginSucceededHandler({
      ctx,
      token: token,
    });
  };
};

module.exports = login;
