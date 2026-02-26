import mongoose from "mongoose";

import { DB_URL } from "./dbConfig.js";
import { errorsConfig, successConfig } from "../config/config.js";

const connectDB = async () => {
  try {
    if (DB_URL.includes("srv")) {
      logger.info("⌛ Connecting DevMatch database...");
    } else {
      logger.info("⌛ Connecting Local DevMatch database...");
    }

    await mongoose.connect(DB_URL);

    logger.success(
      `✅ [${successConfig.dbConnectionSuccess.type}] ${successConfig.dbConnectionSuccess.title} - ${successConfig.dbConnectionSuccess.message}`,
    );
  } catch (error) {
    logger.error(
      `❌ [${errorsConfig.databaseConnectionFailedError.type}] ${errorsConfig.databaseConnectionFailedError.title} - ${errorsConfig.databaseConnectionFailedError.message}`,
    );

    process.exit(1);
  }
};

export default connectDB;
