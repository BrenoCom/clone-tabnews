import migrationRunner from 'node-pg-migrate';
import { join } from 'node:path'
import database from 'infra/database.js';

export default async function migrations(req, res) {
  const dbClient = await database.getNewClient();
  const defaultMigrationOptions = {
    dbClient: dbClient,
    dryRun: true,
    dir: join('infra', 'migrations'),
    direction: 'up',
    verbose: true,
    migrationsTable: 'pgmigrations'
  }

  try {

    if (req.method === 'GET') {
      const migrations = await migrationRunner(defaultMigrationOptions);
  
      return res.status(200).json(migrations);
  
    }
  
    if(req.method === 'POST'){
      const migrations = await migrationRunner({
        ...defaultMigrationOptions,
        dryRun: false
      });
      
      return res.status(200).json(migrations);
    }

    return res.status(405).end();

  } catch (error) {
    console.error(error);
  } finally {
    await dbClient.end();
  }
}
