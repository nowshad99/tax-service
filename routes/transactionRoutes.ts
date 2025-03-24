import { Router } from 'express';

const router = Router();

const transactionController = require("../controllers/transactionController");

// Route to ingest transactions (both sales and tax payment events)
router.post("/transactions", transactionController.ingestTransaction);

// Route to query tax position at a specific date
router.get("/tax-position", transactionController.queryTaxPosition);

// Route to amend a sale
router.patch("/sale", transactionController.amendSale);

export default router;