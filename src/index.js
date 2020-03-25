const contextHasCommand = require("./contextHasCommand");
const defaultLoginFailedHandler = require("./defaultHandlers/loginFailed");
const defaultLoginSucceededHandler = require("./defaultHandlers/loginSucceeded");
const defaultLoginHelpHandler = require("./defaultHandlers/loginHelp");
const defaultLoginRedundantHandler = require("./defaultHandlers/loginRedundant");
const defaultLogoutHandler = require("./defaultHandlers/logout");
const defaultLogoutRedundantHandler = require("./defaultHandlers/logoutRedundant");
const defaultUnauthenticatedAccessHandler = require("./defaultHandlers/unauthenticatedAccess");
const guardMiddleware = require("./guardMiddleware");
const loginCommand = require("./commands/login");
const logoutCommand = require("./commands/logout");

const makeAuthenticator = ({
  authenticator,
  authenticatedUsers = new Map(),
  loginFailedHandler = defaultLoginFailedHandler,
  loginSucceededHandler = defaultLoginSucceededHandler,
  loginHelpHandler = defaultLoginHelpHandler,
  loginRedundantHandler = defaultLoginRedundantHandler,
  logoutHandler = defaultLogoutHandler,
  logoutRedundantHandler = defaultLogoutRedundantHandler,
  unauthenticatedAccessHandler = defaultUnauthenticatedAccessHandler,
}) => {
  if (!authenticator) {
    throw new Error("Authenticator is missing.");
  }

  const middleware = async (ctx, next) => {
    if (!ctx) {
      throw new Error("Ctx is missing.");
    }
    if (!next) {
      throw new Error("Next is missing.");
    }

    let hasProcessedCommand = false;

    if (contextHasCommand({ ctx, command: "login" })) {
      await loginCommand({
        authenticator,
        authenticatedUsers,
        loginFailedHandler,
        loginSucceededHandler,
        loginRedundantHandler,
        loginHelpHandler,
      })(ctx, next);

      hasProcessedCommand = true;
    }

    if (contextHasCommand({ ctx, command: "logout" })) {
      await logoutCommand({
        authenticatedUsers,
        logoutHandler,
        logoutRedundantHandler,
      })(ctx, next);

      hasProcessedCommand = true;
    }

    const userId = ctx.from.id;
    const user = authenticatedUsers.get(userId);
    if (user !== undefined) {
      ctx.user = user;
    }

    if (hasProcessedCommand) {
      return;
    }

    return next();
  };

  const getAuthenticatedUser = ({ userId }) => {
    if (!userId) {
      throw new Error("User id is missing.");
    }

    return authenticatedUsers.get(userId);
  };

  const getAuthenticatedUsers = () => {
    return new Map(authenticatedUsers.entries());
  };

  const guard = guardMiddleware({
    unauthenticatedAccessHandler,
  });

  return {
    middleware,
    getAuthenticatedUser,
    getAuthenticatedUsers,
    guardMiddleware: guard,
  };
};

module.exports = makeAuthenticator;
