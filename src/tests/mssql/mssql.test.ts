import request from "supertest";
import { app } from "@app/app";

describe("GET /", () => {
  it("should return 401 OK", async () => {
    const response = await request(app).get("/api/v1/mssql");
    expect(response.status).toBe(401);
  });
});
