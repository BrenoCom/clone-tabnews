import { createRouter } from "next-connect";
import controllers from "infra/controllers";
import migrator from "models/migrator";

const router = createRouter();

router.get(getHandler).post(postHandler);

export default router.handler(controllers.errorHandlers);

async function getHandler(req, res) {
  const pendingMigrations = await migrator.listPendingMigrations();
  return res.status(200).json(pendingMigrations);
}

async function postHandler(req, res) {
  const migrations = await migrator.runPendingMigrations();

  if (migrations.length > 0) {
    return res.status(201).json(migrations);
  }

  return res.status(200).json(migrations);
}


