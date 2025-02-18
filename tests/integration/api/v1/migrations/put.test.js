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
    test("Should return a MethodNotAllowedError", async () => {
      const res = await fetch(baseUrl + "/api/v1/status", {
        method: "PUT",
      });
      expect(res.status).toBe(405);

      const resBody = await res.json();

      expect(resBody).toEqual({
        name: "MethodNotAllowedError",
        message: "Método não permitido para este endpoint.",
        action:
          "Verifique se o metodo HTTP enviado é valido para este endpoint.",
        status_code: 405,
      });
    });
  });
});
