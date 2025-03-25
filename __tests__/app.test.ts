import request from "supertest";
const app = require("../app");

describe("app.ts", () => {
  it("should respond with a message on GET /", async () => {
    // Act
    const response = await request(app).get("/");

    // Assert
    expect(response.status).toBe(200);
    expect(response.text).toBe("Tax Service API is running!");
  });

    it("should respond with a 404 on an invalid route", async () => {
        // Act
        const response = await request(app).get("/invalid-route");
    
        // Assert
        expect(response.status).toBe(404);
    });
});
