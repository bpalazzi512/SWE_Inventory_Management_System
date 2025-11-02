import app from "./app";
import { connectDatabase } from "./config/database";

const port = process.env.PORT || 3000;

// Connect to MongoDB and start server
connectDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });