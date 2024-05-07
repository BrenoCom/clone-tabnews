
import database from 'infra/database.js';

const baseUrl = "http://localhost:3000";

beforeAll(cleanDatabase)
async function cleanDatabase() {
  await database.query('drop schema public cascade; create schema public;');
}

test("PUT to /api/v1/migrations to return only one connection after the unhandled method", async () => {
  await fetch(baseUrl+"/api/v1/migrations", {
    method: 'PUT'
  });
  await fetch(baseUrl+"/api/v1/migrations", {
    method: 'PUT'
  });
  
  const res = await fetch(baseUrl+"/api/v1/status");
  const resBody = await res.json();

  expect(resBody.dependencies.database.current_connections).toBe(1); 
});
