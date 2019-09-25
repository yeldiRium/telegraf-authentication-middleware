const login = ({
  authenticator,
  authenticatedUsers,
  loginFailedHandler,
  loginSucceededHandler,
  loginRedundantHandler,
  loginHelpHandler
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

  return async (ctx, next) => {
    if (!ctx) {
      throw new Error("Ctx is missing.");
    }
    if (!next) {
      throw new Error("Next is missing.");
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
      userId
    });

    if (user === undefined) {
      await loginFailedHandler({
        ctx,
        token: token
      });
      return;
    }

    authenticatedUsers.set(userId, user);

    await loginSucceededHandler({
      ctx,
      token: token
    });
  };
};

module.exports = login;
