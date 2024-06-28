import retry from "async-retry";
import dotenv from "dotenv";

dotenv.config()
const siteUrl = process.env.SITE_URL;

async function waitFroAllServices() {
  await waitFroWebServer();

  async function waitFroWebServer() {
    
    return retry(fetchStatusPage, {
      retries: 100
    });
    
    async function fetchStatusPage(parms) {
      const response = await fetch(siteUrl + "/api/v1/status");
      const responseBody = await response.json();
    }
  }
}

export default {
  waitFroAllServices,
};
