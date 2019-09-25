const loginSucceeded = ({ ctx, token }) => {
  if (!ctx) {
    throw new Error("Ctx is missing.");
  }
  if (!token) {
    throw new Error("Login string is missing");
  }

  ctx.reply("Login successful.");
};

module.exports = loginSucceeded;
