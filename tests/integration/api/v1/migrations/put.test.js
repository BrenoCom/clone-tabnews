import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

const baseUrl = process.env.SITE_URL;

beforeAll(cleanDatabase);
async function cleanDatabase() {
  await orchestrator.cleanDatabase();
}

describe("PUT /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    test("Return only one connection after the unhandled method", async () => {
      const callMethod = "PUT";
      const testCall = await fetch(baseUrl + "/api/v1/migrations", {
        method: callMethod,
      });
      await fetch(baseUrl + "/api/v1/migrations", {
        method: callMethod,
      });

      const testCallBody = await testCall.json();
      expect(testCallBody.error).toBeDefined();
      expect(testCallBody.error).toBe(`Method "${callMethod}" not allowed`);

      const res = await fetch(baseUrl + "/api/v1/status");
      const resBody = await res.json();

      expect(resBody.dependencies.database.current_connections).toBe(1);
    });
  });
});
