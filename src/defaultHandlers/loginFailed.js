const loginFailed = ({ ctx, token }) => {
  if (!ctx) {
    throw new Error("Ctx is missing.");
  }
  if (!token) {
    throw new Error("Login string is missing");
  }

  ctx.reply("Login failed. Please try again.");
};

module.exports = loginFailed;
