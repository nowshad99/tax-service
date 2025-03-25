import request from "supertest";
const app = require("../app");

describe("POST /amend-sale", () => {
  // Arrange
  it("should accept a valid sale amendment", async () => {
    const amendment = {
      date: "2024-02-22T17:29:39Z",
      invoiceId: "3419027d-960f-4e8f-b8b7-f7b2b4791824",
      itemId: "02db47b6-fe68-4005-a827-24c6e962f3df",
      cost: 540,
      taxRate: 0.2,
    };

    // Act
    const response = await request(app)
      .patch("/sale")
      .send(amendment)
      .set("Accept", "application/json");

    // Assert
    expect(response.status).toBe(202);
  });

  it("should reject an amendment with missing fields", async () => {
    // Arrange
    const amendmentWithMissingFields = {
      date: "2024-02-22T17:29:39Z",
      invoiceId: "3419027d-960f-4e8f-b8b7-f7b2b4791824",
      itemId: "02db47b6-fe68-4005-a827-24c6e962f3df",
      // Missing 'cost' and 'taxRate'
    };

    // Act
    const response = await request(app)
      .patch("/sale")
      .send(amendmentWithMissingFields)
      .set("Accept", "application/json");

    // Assert
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("All fields are required");
  });

  it("should reject an amendment with an invalid date format", async () => {
    // Arrange
    const invalidDateAmendment = {
      date: "invalid-date",
      invoiceId: "3419027d-960f-4e8f-b8b7-f7b2b4791824",
      itemId: "02db47b6-fe68-4005-a827-24c6e962f3df",
      cost: 798,
      taxRate: 0.15,
    };

    // Act
    const response = await request(app)
      .patch("/sale")
      .send(invalidDateAmendment)
      .set("Accept", "application/json");

    // Assert
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Invalid date format");
  });
});
