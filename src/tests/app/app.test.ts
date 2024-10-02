import request from "supertest";
import { app } from "@app/app";

describe("GET /", () => {
  it("should return 200 OK", async () => {
    const response = await request(app).get("/api/v1");
    expect(response.status).toBe(200);
  });
});
