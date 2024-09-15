import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

const baseUrl = process.env.SITE_URL;

describe("GET /api/v1/status", () => {
  describe("Anonymous user", () => {
    test("Should return 200", async () => {
      const res = await fetch(baseUrl + "/api/v1/status");
      expect(res.status).toBe(200);
    });

    test("Have all properties", async () => {
      const res = await fetch(baseUrl + "/api/v1/status");
      const resBody = await res.json();

      expect(resBody.updated_at).toBeDefined();

      expect(resBody.dependencies.database.version).toBeDefined();

      expect(resBody.dependencies.database.max_connections).toBeDefined();

      expect(resBody.dependencies.database.current_connections).toBeDefined();
    });

    test("Return valid properties", async () => {
      const res = await fetch(baseUrl + "/api/v1/status");
      const resBody = await res.json();
      const parsedUpdatedAt = new Date(resBody.updated_at).toISOString();

      expect(resBody.updated_at).toEqual(parsedUpdatedAt);

      expect(typeof resBody.dependencies.database.version).toBe("string");

      expect(typeof resBody.dependencies.database.max_connections).toBe(
        "number",
      );
      expect(resBody.dependencies.database.max_connections > -1).toBe(true);

      expect(typeof resBody.dependencies.database.current_connections).toBe(
        "number",
      );
      expect(resBody.dependencies.database.current_connections === 1).toBe(
        true,
      );
    });
  });
});
