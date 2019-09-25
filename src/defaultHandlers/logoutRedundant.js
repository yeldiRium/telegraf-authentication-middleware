const logoutRedundantHandler = ({ ctx }) => {
  if (!ctx) {
    throw new Error("Ctx is missing.");
  }

  ctx.reply("You are not logged in.");
};

module.exports = logoutRedundantHandler;
