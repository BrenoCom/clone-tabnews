import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database.js";
import { createRouter } from "next-connect";
import controllers from "infra/controllers";

const router = createRouter();

router.get(getHandler).post(postHandler);

export default router.handler(controllers.errorHandlers);

async function getHandler(req, res) {
  const migrations = await runMigrations({ dryRun: true });
  return res.status(200).json(migrations);
}

async function postHandler(req, res) {
  const migrations = await runMigrations({ dryRun: false });

  if (migrations.length > 0) {
    return res.status(201).json(migrations);
  }

  return res.status(200).json(migrations);
}

async function runMigrations({ dryRun = true }) {
  const dbClient = await database.getNewClient();
  try {
    return await migrationRunner({
      dbClient: dbClient,
      dryRun: dryRun,
      dir: resolve("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    });
  } finally {
    await dbClient?.end();
  }
}
