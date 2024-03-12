import { Client } from "pg";

const sslActive = process.env.NODE_ENV === 'production' ? true : false

async function query(queryObj) {

  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: sslActive
  });

  let result = null;
  try {
    await client.connect();
    result = await client.query(queryObj);
  } catch (error) {
    console.error(error);
  } finally {
    await client.end();
  }

  return result;
}

export default {
  query: query,
};
