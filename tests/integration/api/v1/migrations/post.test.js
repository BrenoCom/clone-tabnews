import database from 'infra/database.js';
import * as fs from 'fs'
import { join } from 'node:path'
import orquestrator from "tests/orquestrator";

beforeAll(async () => {
  await orquestrator.waitFroAllServices();
  await database.query('drop schema public cascade; create schema public;');
})

const baseUrl = process.env.SITE_URL;;

function replaceLast(str, pattern, replacement) {
  const match =
    typeof pattern === 'string'
      ? pattern
      : (str.match(new RegExp(pattern.source, 'g')) || []).slice(-1)[0];
  if (!match) return str;
  const last = str.lastIndexOf(match);
  return last !== -1
    ? `${str.slice(0, last)}${replacement}${str.slice(last + match.length)}`
    : str;
};

test("POST to /api/v1/migrations to apply all migrations", async () => {
  // Get information about migrations before applying
  const migrationsResponse = await fetch(
    baseUrl+"/api/v1/migrations"
  );
  const migrationsData = await migrationsResponse.json();
  const totalMigrationsToApply = migrationsData.length;

  // Perform the migration
  const applyMigrationResponse = await fetch(
    baseUrl+"/api/v1/migrations",
    {
      method: "POST",
    }
  );

  // Testing the endpoint response status code
  const actualStatusCode = applyMigrationResponse.status;
  expect(actualStatusCode).toBe(200);

  // Testing if the response is an array
  const responseBody = await applyMigrationResponse.json();
  expect(Array.isArray(responseBody)).toBe(true);

  // The number of migrations applied should be the same as the number of migrations returned
  const migrationCountQuery = await database.query(
    "SELECT count(*) FROM pgmigrations;"
  );
  const numerOfMigrationsInDb = +migrationCountQuery.rows[0].count;
  expect(numerOfMigrationsInDb).toBe(responseBody.length);

  // The number of migrations should also be equal to total migrations to apply
  expect(numerOfMigrationsInDb).toBe(totalMigrationsToApply);
});

test("POST to /api/v1/migrations to return OK status", async () => {
  const res = await fetch(baseUrl + "/api/v1/migrations", {
    method: 'POST'
  });
  expect(res.status).toBe(200);

  const resBody = await res.json();

  expect(Array.isArray(resBody)).toBe(true);

});


test("POST to /api/v1/migrations to apply all migrations", async () => {
  // busca no bd quais migrations foram aplicadas
  const result = await database.query('SELECT * FROM pgmigrations;');
  // busca na pasta de migrations quais arquivos estão lá
  const files = await fs.readdirSync(join('infra', 'migrations'));
  // cria duas listas apenas com o nome dos arquivos
  const filenames = files.map(x => replaceLast(x, '.js', ''));
  const migrationNames = result.rows.map(x => x.name);
  // caso verifica se o nome dos arquivos esta
  // na tabela de migrations
  const isIncludedMigrations = [];

  for (const name of filenames) {
    isIncludedMigrations.push(migrationNames.includes(name));
  }

  // verifica se todos os valores retornados na verificação
  // de nomes são verdadeiros
  expect(isIncludedMigrations.includes(false)).toBe(false);
  // verifica se a quantidade de migrations aplicadas no bd
  // é a mesma que de arquivos de migration
  expect(files.length === result.rows.length).toBe(true);
})


