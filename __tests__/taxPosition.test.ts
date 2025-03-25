import request from "supertest";
const app = require("../app");

describe("GET /tax-position", () => {
  it("should return a tax position for a given date", async () => {
    // Arrange
    const date = "2024-02-22T17:29:39Z";

    // Act
    const response = await request(app).get(`/tax-position?date=${date}`);

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("date");
    expect(response.body).toHaveProperty("taxPosition");
    expect(typeof response.body.date).toBe("string");
    expect(typeof response.body.taxPosition).toBe("number");
  });

  it("should return a 400 error if no date is provided", async () => {
    // Act
    const response = await request(app).get("/tax-position");

    // Assert
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Date query parameter is required");
  });

  it("should return 400 if date format is invalid", async () => {
    const response = await request(app).get("/tax-position?date=invalid-date");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Invalid date format");
  });

  describe("when there are existing events before the query date", () => {
    beforeAll(async () => {
      // Add a SALES event
      await request(app)
        .post("/transactions")
        .send({
          eventType: "SALES",
          date: "2025-03-20T12:00:00Z",
          invoiceId: "test-sale-001",
          items: [{ itemId: "item-001", cost: 1000, taxRate: 0.2 }],
        });

      // Add a TAX_PAYMENT event
      await request(app).post("/transactions").send({
        eventType: "TAX_PAYMENT",
        date: "2025-03-25T12:00:00Z",
        amount: 150
      });
    });

    it("should return the correct tax position before any events", async () => {
        // Arrange
        const date = "2025-03-19T12:00:00Z";

        // Act
        const response = await request(app).get(`/tax-position?date=${date}`);
    
        // Assert
        expect(response.status).toBe(200);
        expect(response.body.taxPosition).toBe(0);
      });

      it("should return the correct tax position after a sales event", async () => {
        // Arrange
        const date = "2025-03-21T12:00:00Z";

        // Act
        const response = await request(app).get(`/tax-position?date=${date}`);
    
        // Assert
        expect(response.status).toBe(200);
        expect(response.body.taxPosition).toBe(200); 
      });

      it("should return the correct tax position after a tax payment", async () => {
        // Arrange
        const date = "2025-03-26T12:00:00Z";

        // Act
        const response = await request(app).get(`/tax-position?date=${date}`);
    
        // Assert
        expect(response.status).toBe(200);
        expect(response.body.taxPosition).toBe(50); // £2.00 (sales tax) - £1.50 (tax payment) = £0.50
      });
  });
});
