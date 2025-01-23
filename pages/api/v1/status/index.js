import database from "infra/database.js";
import { InternalServerError } from "infra/errors";

export default async function status(req, res) {
  try {
    const dbVersion = await database.query("SHOW server_version;");

    const dbMaxCons = await database.query("SHOW MAX_CONNECTIONS;");

    const databaseName = process.env.POSTGRES_DB;
    const dbCurrentCons = await database.query({
      text: "SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = $1;",
      values: [databaseName],
    });

    const updatedAt = new Date().toISOString();
    res.status(200).json({
      updated_at: updatedAt,
      dependencies: {
        database: {
          version: dbVersion.rows[0].server_version,
          max_connections: parseInt(dbMaxCons.rows[0].max_connections),
          current_connections: dbCurrentCons.rows[0].count,
        },
      },
    });
  } catch (error) {
    const publicErrorObj = new InternalServerError({
      cause: error,
    });
    console.log("\n Erro dentro do catch do controller:");
    console.error(publicErrorObj);
    res.status(500).json(publicErrorObj);
  }
}
