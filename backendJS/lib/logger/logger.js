import { ansiConfig } from "../../config/config.js";
import { getTransformedDate } from "../utils/utils.js";

const print = (method = "log", color, label, args) => {
  console[method](`${color}${label}`, ...args);
};

export const logger = {
  info: (...args) => {
    print(
      "info",
      ansiConfig.blue,
      `⏰ [${getTransformedDate(Date.now())}] 📢 [ INFO ]`,
      args,
    );
  },

  success: (...args) => {
    print(
      "log",
      ansiConfig.green,
      `⏰ [${getTransformedDate(Date.now())}] ✅ [ SUCCESS ]`,
      args,
    );
  },

  log: (...args) => {
    print(
      "log",
      ansiConfig.green,
      `⏰ [${getTransformedDate(Date.now())}] 📝 [ LOG ]`,
      args,
    );
  },

  debug: (...args) => {
    print(
      "debug",
      ansiConfig.magenta,
      `⏰ [${getTransformedDate(Date.now())}] 🐞 [ DEBUG ]`,
      args,
    );
  },

  warn: (...args) => {
    print(
      "warn",
      ansiConfig.yellow,
      `⏰ [${getTransformedDate(Date.now())}] 🚨 [ WARNING ]`,
      args,
    );
  },

  error: (...args) => {
    print(
      "error",
      ansiConfig.red,
      `⏰ [${getTransformedDate(Date.now())}] ❌ [ ERROR ]`,
      args,
    );
  },
};

if (!globalThis.logger) {
  globalThis.logger = logger;
}

// NOTE: Use logger directly as it is available with global variable
