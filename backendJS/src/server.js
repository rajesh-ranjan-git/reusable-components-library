import http from "http";
import express from "express";
import * as dotenv from "dotenv";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";

import "../lib/logger/logger.js";

import { HOST_PORT, HOST_URL, CLIENT_URL } from "../config/constants.js";
import { httpStatusConfig } from "../config/config.js";
import connectDB from "../db/connectDB.js";
import router from "../routes/routes.js";
import { showBanner } from "../lib/banner/banner.js";
import { initializeSocket } from "../socket/socket.js";
import {
  successResponseHandler,
  errorResponseHandler,
} from "../lib/utils/utils.js";

const envFile =
  process.env.MODE_ENV === "production"
    ? "env/env-production"
    : "env/env-development";

dotenv.config({ path: path.resolve(process.cwd(), "env", envFile) });

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: [HOST_URL, CLIENT_URL],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  }),
);
app.use(cookieParser());

app.use("/api", router);

app.get("/", (req, res) => {
  successResponseHandler(res, {
    status: httpStatusConfig.success.message,
    statusCode: httpStatusConfig.success.statusCode,
    message: `Server is running at ${HOST_URL}`,
  });
});

app.use((err, req, res, next) => {
  errorResponseHandler(err, req, res, next);
});

const server = http.createServer(app);

initializeSocket(server);

server.listen(HOST_PORT, async () => {
  await connectDB();
  logger.info(`📢 Server is running at ${HOST_URL}`);
  await showBanner(HOST_PORT);
});
