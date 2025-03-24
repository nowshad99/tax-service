import express, { Express, Request, Response } from "express";
import transactionRoutes from "./routes/transactionRoutes";

const app: Express = express();

app.use(express.json());

app.use(transactionRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Tax Service API is running!");
});

module.exports = app;
