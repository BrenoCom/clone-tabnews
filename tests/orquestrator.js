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
const orquestrator = {
  waitFroAllServices,
};
export default orquestrator;
