const contextHasCommand = ({ ctx, command }) => {
  if (!ctx) {
    throw new Error("Ctx is missing.");
  }
  if (!command) {
    throw new Error("Command is missing.");
  }

  return (
    ctx.updateType === "message" && ctx.message.text.startsWith(`/${command}`)
  );
};

module.exports = contextHasCommand;
