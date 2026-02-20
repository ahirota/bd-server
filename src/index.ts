// Package Imports
import express from "express";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";

// App Imports
import { config } from "./config.js";
import { handlerReadiness } from "./api/readiness.js";
import { handlerMetrics } from "./api/metrics.js";
import { handlerReset } from "./api/reset.js";
import { handlerCreateUser } from "./api/users.js";
import { handlerCreateChirp } from "./api/chirps.js";
import { middlewareLogResponses } from "./middleware/logging.js";
import { middlewareMetricsInc } from "./middleware/metrics.js";
import { middlewareErrorHandler } from "./middleware/error.js";

// Auto Migration
const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

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
app.post("/api/users", handlerCreateUser);
app.post("/api/chirps", handlerCreateChirp);

// Error Handler
app.use(middlewareErrorHandler);

// App Listener
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});