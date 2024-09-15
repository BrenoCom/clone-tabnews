import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database.js";

export default async function migrations(req, res) {
  const allowedMethods = ["GET", "POST"];
  if (!allowedMethods.includes(req.method.toUpperCase()))
    return res.status(405).json({
      error: `Method "${req.method}" not allowed`,
    });

  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const defaultMigrationOptions = {
      dbClient: dbClient,
      dryRun: true,
      dir: resolve("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };

    if (req.method === "GET") {
      const migrations = await migrationRunner(defaultMigrationOptions);

      return res.status(200).json(migrations);
    }

    if (req.method === "POST") {
      const migrations = await migrationRunner({
        ...defaultMigrationOptions,
        dryRun: false,
      });

      if (migrations.length > 0) {
        return res.status(201).json(migrations);
      }

      return res.status(200).json(migrations);
    }
  } catch (error) {
    console.error(error);
  } finally {
    await dbClient.end();
  }
}
