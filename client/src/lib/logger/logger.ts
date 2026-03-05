import { ansiConfig } from "@/config/config";
import { getTransformedDate } from "@/lib/utils/utils";

const isServer = typeof window === "undefined";

const css = {
  info: "color:#38bdf8;font-weight:bold;", // sky blue (lighter)
  log: "color:#22c55e;font-weight:bold;",
  debug: "color:#d8b4fe;font-weight:bold;", // light purple (distinct from error)
  warn: "color:#f59e0b;font-weight:bold;",
  error: "color:#ef4444;font-weight:bold;",
};

const serverPrint = (
  method: "info" | "log" | "warn" | "error" | "debug",
  color: string,
  label: string,
  args: unknown[],
) => {
  console[method](`${color}${label}`, ...args);
};

const browserPrint = (
  method: "info" | "log" | "warn" | "error" | "debug",
  style: string,
  label: string,
  args: unknown[],
) => {
  console[method](`%c${label}`, style, ...args);
};

export const logger = {
  info: (...args: unknown[]) => {
    if (isServer)
      serverPrint(
        "info",
        ansiConfig.blue,
        `⏰ [${getTransformedDate(new Date())}] 📢 [ INFO ]`,
        args,
      );
    else
      browserPrint(
        "info",
        css.info,
        `⏰ [${getTransformedDate(new Date())}] 📢 [ INFO ]`,
        args,
      );
  },

  success: (...args: unknown[]) => {
    if (isServer)
      serverPrint(
        "log",
        ansiConfig.green,
        `⏰ [${getTransformedDate(new Date())}] ✅ [ SUCCESS ]`,
        args,
      );
    else
      browserPrint(
        "log",
        css.log,
        `⏰ [${getTransformedDate(new Date())}] ✅ [ SUCCESS ]`,
        args,
      );
  },

  log: (...args: unknown[]) => {
    if (isServer)
      serverPrint(
        "log",
        ansiConfig.green,
        `⏰ [${getTransformedDate(new Date())}] 📝 [ LOG ]`,
        args,
      );
    else
      browserPrint(
        "log",
        css.log,
        `⏰ [${getTransformedDate(new Date())}] 📝 [ LOG ]`,
        args,
      );
  },

  debug: (...args: unknown[]) => {
    if (isServer)
      serverPrint(
        "debug",
        ansiConfig.magenta,
        `⏰ [${getTransformedDate(new Date())}] 🐞 [ DEBUG ]`,
        args,
      );
    else
      browserPrint(
        "log",
        css.debug,
        `⏰ [${getTransformedDate(new Date())}] 🐞 [ DEBUG ]`,
        args,
      );
  },

  warn: (...args: unknown[]) => {
    if (isServer)
      serverPrint(
        "warn",
        ansiConfig.yellow,
        `⏰ [${getTransformedDate(new Date())}] 🚨 [ WARNING ]`,
        args,
      );
    else
      browserPrint(
        "warn",
        css.warn,
        `⏰ [${getTransformedDate(new Date())}] 🚨 [ WARNING ]`,
        args,
      );
  },

  error: (...args: unknown[]) => {
    if (isServer)
      serverPrint(
        "error",
        ansiConfig.red,
        `⏰ [${getTransformedDate(new Date())}] ❌ [ ERROR ]`,
        args,
      );
    else
      browserPrint(
        "error",
        css.error,
        `⏰ [${getTransformedDate(new Date())}] ❌ [ ERROR ]`,
        args,
      );
  },
};

if (!globalThis.logger) {
  globalThis.logger = logger;
}

// NOTE: Use logger directly as it is available with global variable
