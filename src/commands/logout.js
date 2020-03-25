/**
 * Returns a telegraf middleware that removes the user from the
 * `authenticatedUsers` or calls the `logoutRedundantHandler` if the user is not
 * logged in.
 *
 * @param {Map}      authenticatedUsers     A map of authenticated users.
 * @param {Function} logoutHandler          A handler that is called when the
 *                                          login fails. May be asynchronous.
 * @param {Function} logoutRedundantHandler A handler that is called when the
 *                                          login fails. May be asynchronous.
 */
const logout = ({
  authenticatedUsers,
  logoutHandler,
  logoutRedundantHandler,
}) => {
  if (!authenticatedUsers) {
    throw new Error("Authenticated users are missing.");
  }
  if (!logoutHandler) {
    throw new Error("Logout handler is missing.");
  }
  if (!logoutRedundantHandler) {
    throw new Error("Logout redundant handler is missing.");
  }

  return async (ctx, next) => {
    if (!ctx) {
      throw new Error("Ctx is missing.");
    }
    if (!next) {
      throw new Error("Next is missing.");
    }

    const userId = ctx.from.id;

    if (!authenticatedUsers.has(userId)) {
      await logoutRedundantHandler({ ctx });
      return;
    }

    authenticatedUsers.delete(userId);
    await logoutHandler({ ctx, userId });
  };
};

module.exports = logout;
