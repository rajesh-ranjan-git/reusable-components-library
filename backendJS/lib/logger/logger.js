import { ansiConfig } from "../../config/config.js";
import { getTransformedDate } from "../../utils/utils.js";

const print = (method = "log", color, label, args) => {
  console[method](`${color}${label}`, ...args);
};

export const logger = {
  info: (...args) => {
    print(
      "info",
      ansiConfig.blue,
      `📢 INFO\t:: ⏰ [${getTransformedDate(Date.now())}] `,
      args,
    );
  },

  success: (...args) => {
    print(
      "log",
      ansiConfig.green,
      `✅ SUCCESS\t:: ⏰ [${getTransformedDate(Date.now())}] `,
      args,
    );
  },

  log: (...args) => {
    print(
      "log",
      ansiConfig.green,
      `📝 LOG\t:: ⏰ [${getTransformedDate(Date.now())}] `,
      args,
    );
  },

  debug: (...args) => {
    print(
      "debug",
      ansiConfig.magenta,
      `🐞 DEBUG\t:: ⏰ [${getTransformedDate(Date.now())}] `,
      args,
    );
  },

  warn: (...args) => {
    print(
      "warn",
      ansiConfig.yellow,
      `🚨 WARNING\t:: ⏰ [${getTransformedDate(Date.now())}] `,
      args,
    );
  },

  error: (...args) => {
    print(
      "error",
      ansiConfig.red,
      `❌ ERROR\t:: ⏰ [${getTransformedDate(Date.now())}] `,
      args,
    );
  },
};

if (!globalThis.logger) {
  globalThis.logger = logger;
}

// NOTE: Use logger directly as it is available with global variable
