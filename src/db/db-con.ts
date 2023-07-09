import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

// for migrations
const migrationClient = new pg.Pool({
  connectionString: "postgres://test:test@0.0.0.0:5432/test",
});
await migrationClient.connect();
console.log("run migrations");
const db = drizzle(migrationClient, { schema });
// migrate(db, { migrationsFolder: "drizzle" });
console.log("finished migrations");

export const getDbConnection = () => db;
export const closeDbConnection = () => migrationClient.end();

process.addListener("beforeExit", closeDbConnection);
process.addListener("SIGINT", closeDbConnection);
