# **Tax Service API**

This is a simple **Node.js & TypeScript** service built with **Express** that allows users to:

- **Ingest** sales and tax payment events
- **Query** the tax position at any given point in time
- **Amend** sales events before or after they are received

The tax position is calculated as:  
**Total tax from sales - Total tax payments**

---

## **Table of Contents**

- [Installation](#installation)
- [Running the Service](#running-the-service)
- [API Endpoints](#api-endpoints)
  - [Ingest Transactions](#1-ingest-transactions-post-transactions)
  - [Query Tax Position](#2-query-tax-position-get-tax-position)
  - [Amend a Sale](#3-amend-a-sale-patch-sale)
- [Testing](#testing)

---

## **Installation**

1. **Clone the repository**
   ```sh
   git clone https://github.com/nowshad99/tax-service.git
   ```

2. **Install dependencies**
    ```sh
    npm install
    ```

## **Running the Service**

1. **Start the service in development mode**
    ```sh
    npm run dev
    ```
This uses nodemon to automatically reload on changes.

2. **Start the service in production mode**
    ```sh
    npm run build
    npm start
    ```
The service runs by default on http://localhost:3000

---

## API Endpoints

### 1. **Ingest Transactions (POST /transactions)**
This endpoint allows you to send sales and tax payment events.

##### Sales Event Example
```http
POST http://localhost:3000/transactions
Content-Type: application/json

{
  "eventType": "SALES",
  "date": "2024-02-22T17:29:39Z",
  "invoiceId": "3419027d-960f-4e8f-b8b7-f7b2b4791824",
  "items": [
    {
      "itemId": "02db47b6-fe68-4005-a827-24c6e962f3df",
      "cost": 1099,
      "taxRate": 0.2
    }
  ]
}
```
✅ Response: 202 Accepted (No body)

##### Tax Payment Event Example
```http
POST http://localhost:3000/transactions
Content-Type: application/json

{
  "eventType": "TAX_PAYMENT",
  "date": "2024-02-22T17:29:39Z",
  "amount": 74901
}
```
✅ Response: 202 Accepted (No body)

### 2. Query Tax Position (GET /tax-position)
Allows users to check their tax position for any given date.

##### Example Request
```http
GET http://localhost:3000/tax-position?date=2024-02-22T17:29:39Z
```

✅ Response:
```json
{
  "date": "2024-02-22T17:29:39Z",
  "taxPosition": 49
}
```
Here, the tax position is 49 pennies (£0.49)

### 3. Amend a Sale (PATCH /sale)
Allows users to modify an item before or after the sale event is received.

##### Example Request
```http
PATCH http://localhost:3000/sale
Content-Type: application/json

{
  "date": "2024-02-22T17:29:39Z",
  "invoiceId": "3419027d-960f-4e8f-b8b7-f7b2b4791824",
  "itemId": "02db47b6-fe68-4005-a827-24c6e962f3df",
  "cost": 798,
  "taxRate": 0.15
}
```
✅ Response: 202 Accepted (No body)

If the sale already exists, it is updated immediately. If the sale has not been received yet, the amendment is stored and applied later.

---

## Testing
You can run tests using Jest & Supertest.

1. **Ensure test dependencies are installed (if not already)**
  ```sh
  npm install -D jest supertest ts-jest @types/jest @types/supertest
  ```

2. **Run tests**
  ```sh
  npm test
  ```
This will run the tests with code coverage.