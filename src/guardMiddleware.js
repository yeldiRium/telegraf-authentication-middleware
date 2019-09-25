const guardMiddleware = ({ unauthenticatedAccessHandler }) => {
  if (!unauthenticatedAccessHandler) {
    throw new Error("Unauthenticated access handler is missing.");
  }

  return async (ctx, next) => {
    if (!ctx) {
      throw new Error("Ctx is missing.");
    }
    if (!next) {
      throw new Error("Next is missing.");
    }

    if (ctx.user === undefined) {
      await unauthenticatedAccessHandler();
      return;
    }

    next();
  };
};

module.exports = guardMiddleware;
