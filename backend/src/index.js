const { app, ensureDbConnected } = require("./app");

const PORT = process.env.PORT || 4000;

ensureDbConnected()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB", err);
    process.exit(1);
  });
