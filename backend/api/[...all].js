const { app, ensureDbConnected } = require("../src/app");

module.exports = async (req, res) => {
  try {
    await ensureDbConnected();
    return app(req, res);
  } catch (err) {
    console.error("Serverless handler error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
