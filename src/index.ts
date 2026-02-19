import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponses } from "./middleware/logging.js";

// Base Setup
const app = express();
const PORT = 8080;

// Static
app.use("/app", express.static("./src/app"));

// Global Middleware
app.use(middlewareLogResponses);

// Routes  Custom Middleware
app.get("/healthz", handlerReadiness);

// App Listener
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});