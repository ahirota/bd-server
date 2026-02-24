import type { MigrationConfig } from "drizzle-orm/migrator";
process.loadEnvFile();

// API CONFIG
type APIConfig = {
  fileserverHits: number;
  platform: string;
  jwtSecret: string;
  jwtExp: number;
  polkaApiKey: string;
};

const apiConfig: APIConfig = {
  fileserverHits: 0,
  platform: envOrThrow("PLATFORM"),
  jwtSecret: envOrThrow("JWT_SECRET"),
  jwtExp: 3600,
  polkaApiKey: envOrThrow("POLKA_KEY")
}

// MIGRATION CONFIG
const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};

// DATABASE CONFIG
type DBConfig = {
  url: string;
  migrationConfig: MigrationConfig;
};

const dbConfig: DBConfig = {
  url: envOrThrow("DB_URL"),
  migrationConfig: migrationConfig
}

// APP CONFIG (UNION)
type AppConfig = {
  api: APIConfig;
  db: DBConfig;
}

export const config: AppConfig = {
  api: apiConfig,
  db: dbConfig
}

// Helper Functions
function envOrThrow(key: string) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}