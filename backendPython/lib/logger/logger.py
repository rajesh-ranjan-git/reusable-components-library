import logging
import io
import os
import sys
import json

from datetime import datetime
from zoneinfo import ZoneInfo

from logging.handlers import RotatingFileHandler

try:
    from colorlog import ColoredFormatter

    COLORLOG_AVAILABLE = True
except ImportError:
    COLORLOG_AVAILABLE = False

if sys.platform == "win32":
    try:
        sys.stdout = io.TextIOWrapper(
            sys.stdout.buffer, encoding="utf-8", errors="replace", line_buffering=True
        )
        sys.stderr = io.TextIOWrapper(
            sys.stderr.buffer, encoding="utf-8", errors="replace", line_buffering=True
        )
        os.system("chcp 65001 >nul 2>&1")
    except Exception:
        pass

LOG_DIR = "logs"
os.makedirs(LOG_DIR, exist_ok=True)


class AlignedFormatter(logging.Formatter):
    LEVEL_PADDING = {
        "INFO": "    ",
        "ERROR": "   ",
        "WARNING": " ",
    }

    def format(self, record):
        padding = self.LEVEL_PADDING.get(record.levelname, " ")
        original_levelname = record.levelname

        padded_levelname = f"{original_levelname}:{padding}"
        record.levelname = padded_levelname

        if hasattr(self, "log_colors") and original_levelname in self.log_colors:
            self.log_colors[padded_levelname] = self.log_colors[original_levelname]

        result = super().format(record)

        if hasattr(self, "log_colors"):
            self.log_colors.pop(padded_levelname, None)

        record.levelname = original_levelname
        return result


def get_aligned_formatter(base_class, *args, **kwargs):
    aligned_class = type("AlignedFormatter", (AlignedFormatter, base_class), {})
    return aligned_class(*args, **kwargs)


def apply_timezone(formatter, tz="Asia/Kolkata"):
    def format_time(record, datefmt=None):
        dt = datetime.fromtimestamp(record.created, ZoneInfo(tz))
        return dt.strftime(datefmt) if datefmt else dt.isoformat()

    formatter.formatTime = format_time
    return formatter


CLEAN_FORMAT = (
    "%(levelname)s ⏰ [%(asctime)s] – %(message)s"
    if os.getenv("PORT", "5000") == "5000"
    else "%(levelname)s ⏰ [%(asctime)s] – %(message)s"
)
DATE_FORMAT = "%d/%m/%Y, %I:%M:%S %p"

clean_formatter = apply_timezone(
    get_aligned_formatter(
        logging.Formatter,
        CLEAN_FORMAT,
        datefmt=DATE_FORMAT,
    )
)

colored_formatter = None
if COLORLOG_AVAILABLE:
    colored_formatter = apply_timezone(
        get_aligned_formatter(
            ColoredFormatter,
            (
                "%(log_color)s%(levelname)s%(reset)s ⏰ [%(asctime)s] – %(log_color)s%(message)s%(reset)s"
                if os.getenv("PORT", "5000") == "5000"
                else "%(log_color)s%(levelname)s%(reset)s ⏰ [%(asctime)s] – %(log_color)s%(message)s%(reset)s"
            ),
            datefmt=DATE_FORMAT,
            log_colors={
                "INFO": "green",
                "WARNING": "yellow",
                "ERROR": "red",
                "DEBUG": "cyan",
                "CRITICAL": "bold_red",
            },
        )
    )


def create_json_formatter(datefmt):
    def format_log(record):
        dt = datetime.now(ZoneInfo("Asia/Kolkata"))

        log_record = {
            "timestamp": dt.strftime(datefmt),
            "level": record.levelname,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
        }

        if record.exc_info:
            log_record["exception"] = logging.Formatter().formatException(
                record.exc_info
            )

        return json.dumps(log_record)

    formatter = logging.Formatter(datefmt=datefmt)
    formatter.format = format_log
    return formatter


json_formatter = create_json_formatter(DATE_FORMAT)

_logger_initialized = False


def create_console_handler():
    handler = logging.StreamHandler()
    handler.setLevel(logging.INFO)
    handler.setFormatter(colored_formatter or clean_formatter)

    try:
        if sys.platform == "win32":
            handler.stream = open(1, "w", encoding="utf-8", closefd=False)
    except Exception:
        pass

    return handler


def create_file_handler(filepath, formatter):
    handler = RotatingFileHandler(
        filepath, maxBytes=5 * 1024 * 1024, backupCount=3, encoding="utf-8"
    )
    handler.setLevel(logging.INFO)
    handler.setFormatter(formatter)
    return handler


def setup_logger(name=None):
    global _logger_initialized

    logger = logging.getLogger(name)

    if name is None and not _logger_initialized:
        logger.setLevel(logging.INFO)
        logger.handlers = []

        console_handler = create_console_handler()
        file_handler = create_file_handler(
            os.path.join(LOG_DIR, "app.log"), clean_formatter
        )
        json_handler = create_file_handler(
            os.path.join(LOG_DIR, "app.json.log"), json_formatter
        )

        logger.addHandler(console_handler)
        logger.addHandler(file_handler)
        logger.addHandler(json_handler)

        _logger_initialized = True
        logger.info("✅ Logger initialized successfully")

    return logger


def get_logger(name):
    return logging.getLogger(name)


## NOTE: Usage

# from logger_config import setup_logger
# logger = setup_logger()
