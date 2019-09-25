const logout = ({ ctx, userId }) => {
  if (!ctx) {
    throw new Error("Ctx is missing.");
  }
  if (!userId) {
    throw new Error("User id is missing.");
  }

  ctx.reply("Logout successful.");
};

module.exports = logout;
