import mongoose from "mongoose";
import config from "config";
import { logger } from "./logger";
const db_url = config.get<string>("db_url");

export async function connectToDB() {
  try {
    await mongoose.connect(db_url);
    logger.info("Database connection was successful");
  } catch (e) {
    logger.error("Cannot connect to database");
    process.exit(1);
  }
}
