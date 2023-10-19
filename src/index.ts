import cors from "cors";
import express from "express";
import config from "config";
import { logger } from "../utils/logger";
import { connectToDB } from "../utils/connectToDB";
import router from "../router";

const port = config.get<number>("port");

const app = express();
app.use(cors());
app.use(express.json());
app.use(router());
app.listen(port, () => {
  logger.info(`Server is running on port: ${port}`);
  connectToDB();
});
