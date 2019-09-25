const loginRedundant = ({ ctx }) => {
  if (!ctx) {
    throw new Error("Ctx is missing.");
  }

  ctx.reply("You are already logged in.");
};

module.exports = loginRedundant;
