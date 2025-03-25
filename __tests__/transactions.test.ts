import request from "supertest";
const app = require("../app");

describe("POST /transactions", () => {
  it("should accept a valid sales event", async () => {
    // Arrange
    const salesEvent = {
      eventType: "SALES",
      date: "2024-02-22T17:29:39Z",
      invoiceId: "3419027d-960f-4e8f-b8b7-f7b2b4791824",
      items: [
        {
          itemId: "02db47b6-fe68-4005-a827-24c6e962f3df",
          cost: 1099,
          taxRate: 0.2,
        },
      ],
    };

    // Act
    const response = await request(app)
      .post("/transactions")
      .send(salesEvent)
      .set("Accept", "application/json");

    // Assert
    expect(response.status).toBe(202);
  });

  it("should accept a valid tax payment event", async () => {
    // Arrange
    const taxPaymentEvent = {
      eventType: "TAX_PAYMENT",
      date: "2024-02-22T17:29:39Z",
      amount: 1200,
    };

    // Act
    const response = await request(app)
      .post("/transactions")
      .send(taxPaymentEvent)
      .set("Accept", "application/json");

    // Assert
    expect(response.status).toBe(202);
  });

  it("should reject an invalid event", async () => {
    // Arrange
    const invalidEvent = {
      eventType: "INVALID_TYPE",
      date: "2024-02-22T17:29:39Z",
    };

    // Act
    const response = await request(app)
      .post("/transactions")
      .send(invalidEvent)
      .set("Accept", "application/json");

    // Assert
    expect(response.status).toBe(400);
  });

  it("should return 400 if event type or date are not provided", async () => {
    // Arrange
    const salesEvent = {
      invoiceId: "3419027d-960f-4e8f-b8b7-f7b2b4791824",
      items: [
        {
          itemId: "02db47b6-fe68-4005-a827-24c6e962f3df",
          cost: 1099,
          taxRate: 0.2,
        },
      ],
    };

    // Act
    const response = await request(app)
      .post("/transactions")
      .send(salesEvent)
      .set("Accept", "application/json");

    // Assert
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Invalid event format");
  });
});
