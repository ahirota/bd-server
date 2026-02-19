import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { handlerMetrics, handlerReset } from "./api/metrics.js";
import { middlewareLogResponses } from "./middleware/logging.js";
import { middlewareMetricsInc } from "./middleware/metrics.js";

// Base Setup
const app = express();
const PORT = 8080;

// Static
app.use("/app", middlewareMetricsInc, express.static("./src/app"));

// Global Middleware
app.use(middlewareLogResponses);

// Admin Endpoints
app.get("/admin/metrics", handlerMetrics);
app.post("/admin/reset", handlerReset);

// API Endpoints
app.get("/api/healthz", handlerReadiness);

// App Listener
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});