import { Client } from "pg";

async function query(queryObj) {
  let result = null;
  let client;
  try {
    client = await getNewClient();
    result = await client.query(queryObj);
  } catch (error) {
    console.log("\n Erro dentro do catch do database.js:");
    console.error(error);
    throw error;
  } finally {
    await client?.end();
  }

  return result;
}

async function getNewClient() {
  const sslActive = process.env.NODE_ENV === "production" ? true : false;

  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: sslActive,
  });

  await client.connect();

  return client;
}
const database = {
  query,
  getNewClient,
};

export default database;
