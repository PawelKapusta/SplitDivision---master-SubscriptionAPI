import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import * as dotenv from "dotenv";
import { sequelize } from "./database/config";
import subscriptionRouter from "./routers/subscriptionRouter";
import { consoleLogger } from "./utils/logger";

dotenv.config();

const app = express();
const port = 5004;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());

sequelize
  .authenticate()
  .then(() => consoleLogger.info("Database connected successfully"))
  .catch(error => {
    consoleLogger.info("Error when connecting to database...: " + error);
    consoleLogger.error(error.stack);
  });

app.get("/", (req, res) => {
  res.send("Hello World! from Subscription API");
});

//groups
app.get("/api/v1/subscription", subscriptionRouter);
app.get("/api/v1/subscription/:id", subscriptionRouter);
app.post("/api/v1/subscription", subscriptionRouter);
app.put("/api/v1/subscription/:id", subscriptionRouter);
app.delete("/api/v1/subscription/:id", subscriptionRouter);

app.listen(port, () => {
  consoleLogger.info("Starting running SubscriptionAPI app...");
  consoleLogger.info(`App listening on port ${port}!`);
});
