const logout = ({
  authenticatedUsers,
  logoutHandler,
  logoutRedundantHandler
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
