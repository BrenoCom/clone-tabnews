import orquestrator from "tests/orquestrator";

beforeAll(async () => {
  await orquestrator.waitFroAllServices();
  await orquestrator.cleanDatabase();
});

const baseUrl = process.env.SITE_URL;

describe("GET /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    test("Return valid properties", async () => {
      const res = await fetch(baseUrl + "/api/v1/migrations");
      expect(res.status).toBe(200);

      const resBody = await res.json();
      expect(Array.isArray(resBody)).toBe(true);
      expect(resBody.length).toBeGreaterThan(0);
    });
  });
});
