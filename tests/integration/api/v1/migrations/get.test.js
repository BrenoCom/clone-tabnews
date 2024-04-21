import database from 'infra/database.js';

const baseUrl = "http://localhost:3000";

beforeAll(cleanDatabase)

async function cleanDatabase() {
  await database.query('drop schema public cascade; create schema public;');
}

test("GET to /api/v1/migrations to return valid properties", async () => {
  const res = await fetch(baseUrl+"/api/v1/migrations");
  expect(res.status).toBe(200);

  const resBody = await res.json();
  expect(Array.isArray(resBody)).toBe(true);
  expect(resBody.length).toBeGreaterThan(0);
});
