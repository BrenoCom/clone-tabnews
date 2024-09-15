import database from "infra/database.js";
import retry from "async-retry";
import dotenv from "dotenv";

dotenv.config();
const siteUrl = process.env.SITE_URL;

async function waitFroAllServices() {
  await waitFroWebServer();

  async function waitFroWebServer() {
    return retry(fetchStatusPage, {
      retries: 100,
      minTimeout: 1000,
    });

    async function fetchStatusPage() {
      const response = await fetch(siteUrl + "/api/v1/status");
      if (!response.ok) {
        throw Error();
      }
    }
  }
}

async function cleanDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

const orquestrator = {
  waitFroAllServices,
  cleanDatabase,
};
export default orquestrator;
