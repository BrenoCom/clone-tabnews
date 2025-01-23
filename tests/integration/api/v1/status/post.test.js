import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

const baseUrl = process.env.SITE_URL;

describe("POST /api/v1/status", () => {
  describe("Anonymous user", () => {
    test("Should return 405", async () => {
      const res = await fetch(baseUrl + "/api/v1/status", {
        method: "POST",
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
