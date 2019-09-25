const loginHelp = ({ ctx }) => {
  if (!ctx) {
    throw new Error("Ctx is missing.");
  }

  ctx.reply(
    "/login <login string>\n\nSupply a login string to authenticate yourself."
  );
};

module.exports = loginHelp;
