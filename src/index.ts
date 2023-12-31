import cors from "cors";
import express from "express";
import config from "config";
import { logger } from "../utils/logger";
import { connectToDB } from "../utils/connectToDB";
import * as dotenv from "dotenv";
import router from "../router";
import { deserializedUser } from "../middleware/deserializeUser";
const port = config.get<number>("port");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(deserializedUser);
app.use(router());
app.listen(port, () => {
  logger.info(`Server is running on port: ${port}`);
  connectToDB();
});
