import { Client } from "pg";
async function query(queryObj) {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD
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
