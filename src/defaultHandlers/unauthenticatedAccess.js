const unauthenticatedAccess = ({ ctx }) => {
  if (!ctx) {
    throw new Error("Ctx is missing.");
  }

  ctx.reply("You cannot do this without logging in first.");
};

module.exports = unauthenticatedAccess;
