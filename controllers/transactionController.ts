import { Request, Response } from "express";
import {
  SalesEvent,
  TaxPaymentEvent,
  transactions,
  amendments,
} from "../types";

export const ingestTransaction = (req: Request, res: Response) => {
  const event = req.body;

  // Validate the event (is this needed?)
  if (!event.eventType || !event.date) {
    return res.status(400).json({ message: "Invalid event format" });
  }

  if (event.eventType === "SALES") {
    const salesEvent: SalesEvent = event;

    // Apply amendments to the sales event
    applyAmendments(salesEvent);

    transactions.push(salesEvent);
    return res.status(202).send();
  } else if (event.eventType === "TAX_PAYMENT") {
    const taxPaymentEvent: TaxPaymentEvent = event;
    transactions.push(taxPaymentEvent);
    return res.status(202).send();
  }

  return res.status(400).json({ message: "Invalid event type" });
};

export const queryTaxPosition = (req: Request, res: Response) => {
  const { date } = req.query;

  if (!date) {
    return res
      .status(400)
      .json({ message: "Date query parameter is required" });
  }

  const queryDate = new Date(date as string);

  if (isNaN(queryDate.getTime())) {
    return res.status(400).json({ message: "Invalid date format" });
  }

  let totalTaxFromSales = 0;
  let totalTaxPayments = 0;

  // Loop through all transactions and calculate the tax position
  transactions.forEach((event) => {
    const eventDate = new Date(event.date);

    if (eventDate <= queryDate) {
      if (event.eventType === "SALES") {
        // Calculate tax for each item in the sales event
        const salesEvent: SalesEvent = event;
        salesEvent.items.forEach((item) => {
          totalTaxFromSales += item.cost * item.taxRate; // Add tax from item to total sales tax
        });
      } else if (event.eventType === "TAX_PAYMENT") {
        // Add tax payments up to the given date
        const taxPaymentEvent: TaxPaymentEvent = event;
        totalTaxPayments += taxPaymentEvent.amount;
      }
    }
  });

  const taxPosition = totalTaxFromSales - totalTaxPayments;

  return res.status(200).json({
    date: queryDate.toISOString(),
    taxPosition,
  });
};

export const amendSale = (req: Request, res: Response) => {
  const { date, invoiceId, itemId, cost, taxRate } = req.body;

  if (!date || !invoiceId || !itemId || cost == null || taxRate == null) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const amendmentDate = new Date(date);
  if (isNaN(amendmentDate.getTime())) {
    return res.status(400).json({ message: "Invalid date format" });
  }

  // Store the amendment (indexed by invoiceId)
  if (!amendments[invoiceId]) {
    amendments[invoiceId] = [];
  }

  // Find if an amendment for the same item already exists
  const existingAmendmentIndex = amendments[invoiceId].findIndex(
    (item) => item.itemId === itemId
  );

  if (existingAmendmentIndex !== -1) {
    // Update the existing amendment
    amendments[invoiceId][existingAmendmentIndex] = { itemId, cost, taxRate };
  } else {
    // Store the new amendment
    amendments[invoiceId].push({ itemId, cost, taxRate });
  }

  return res.status(202).send();
};

const applyAmendments = (salesEvent: SalesEvent) => {
  const { invoiceId, items } = salesEvent;

  if (amendments[invoiceId]) {
    // Apply amendments to the corresponding items in the sale event
    amendments[invoiceId].forEach((amendedItem) => {
      const itemIndex = items.findIndex(
        (item) => item.itemId === amendedItem.itemId
      );

      if (itemIndex !== -1) {
        items[itemIndex] = amendedItem;
      } else {
        // If the item wasn't originally in the sale event, add it
        items.push(amendedItem);
      }
    });

    // Once amendments are applied, we can remove them from the pending amendments list
    delete amendments[invoiceId];
  }
};

module.exports = { ingestTransaction, queryTaxPosition, amendSale };
