import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { handlerMetrics, handlerReset } from "./api/metrics.js";
import { handlerValidateChirp } from "./api/validation.js";
import { middlewareLogResponses } from "./middleware/logging.js";
import { middlewareMetricsInc } from "./middleware/metrics.js";
import { middlewareErrorHandler } from "./middleware/error.js";

// Base Setup
const app = express();
const PORT = 8080;

// Static
app.use("/app", middlewareMetricsInc, express.static("./src/app"));

// Global Middleware
app.use(middlewareLogResponses);
app.use(express.json());

// Admin Endpoints
app.get("/admin/metrics", handlerMetrics);
app.post("/admin/reset", handlerReset);

// API Endpoints
app.get("/api/healthz", handlerReadiness);
app.post("/api/validate_chirp", handlerValidateChirp);

// Error Handler
app.use(middlewareErrorHandler);

// App Listener
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});