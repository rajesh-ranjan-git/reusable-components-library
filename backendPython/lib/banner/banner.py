import os
import random
import sys

from datetime import datetime
from functools import partial
from typing import List, Dict, Tuple, Callable
from pyfiglet import Figlet
from textwrap import dedent

from config import app_config, banner_themes_config, banner_fonts_config, errors_config
from utils import get_transformed_date

BOX_CHARS = {
    "round": {"tl": "╭", "tr": "╮", "bl": "╰", "br": "╯", "h": "─", "v": "│"},
    "single": {"tl": "┌", "tr": "┐", "bl": "└", "br": "┘", "h": "─", "v": "│"},
}

ANSI_COLORS = {"cyan": "\033[36m", "reset": "\033[0m"}


def get_random_item(arr: List) -> any:
    return arr[random.randint(0, len(arr) - 1)]


def hex_to_rgb(hex_color: str) -> Tuple[int, int, int]:
    return tuple(int(hex_color.lstrip("#")[i : i + 2], 16) for i in (0, 2, 4))


def create_rgb_ansi(rgb: Tuple[int, int, int]) -> str:
    return f"\033[38;2;{rgb[0]};{rgb[1]};{rgb[2]}m"


def apply_ansi_color(text: str, color_code: str) -> str:
    return f"{color_code}{text}\033[0m"


def calculate_color_index(line_num: int, total_lines: int, num_colors: int) -> int:
    return min(
        int((line_num / max(total_lines - 1, 1)) * (num_colors - 1)), num_colors - 1
    )


def colorize_line(
    gradient_colors: List[str], total_lines: int, line_index: int, line: str
) -> str:
    color_index = calculate_color_index(line_index, total_lines, len(gradient_colors))
    hex_color = gradient_colors[color_index]
    rgb = hex_to_rgb(hex_color)
    color_code = create_rgb_ansi(rgb)
    return apply_ansi_color(line, color_code)


def apply_gradient(text: str, gradient_colors: List[str]) -> str:
    lines = text.split("\n")
    total_lines = len(lines)

    colorize = partial(colorize_line, gradient_colors, total_lines)
    colored_lines = [colorize(i, line) for i, line in enumerate(lines)]

    return "\n".join(colored_lines)


def get_max_line_length(lines: List[str]) -> int:
    return max(map(lambda line: len(line.strip()), lines))


def create_box_line(
    content: str, width: int, chars: Dict, color: str, reset: str
) -> str:
    padding = " " * (width - len(content))
    return f"{color}{chars['v']}{reset}{content}{padding}{color}{chars['v']}{reset}"


def create_box_border(
    width: int, chars: Dict, color: str, reset: str, position: str
) -> str:
    left = chars["tl"] if position == "top" else chars["bl"]
    right = chars["tr"] if position == "top" else chars["br"]
    return f"{color}{left}{chars['h'] * width}{right}{reset}"


def create_padding_line(width: int, chars: Dict, color: str, reset: str) -> str:
    return f"{color}{chars['v']}{reset}{' ' * width}{color}{chars['v']}{reset}"


def create_box(
    text: str,
    padding_right: int = 5,
    padding_left: int = 0,
    border_color: str = "cyan",
    border_style: str = "round",
) -> str:
    lines = [line.rstrip() for line in dedent(text).strip().split("\n")]

    max_length = max(len(line) for line in lines)

    inner_width = max_length + (padding_left + 2) + padding_right

    chars = BOX_CHARS.get(border_style, BOX_CHARS["single"])
    color = ANSI_COLORS.get(border_color, "")
    reset = ANSI_COLORS["reset"]

    top_border = (
        f"{color}{chars['tl']}{chars['h'] * inner_width}{chars['tr']}{reset}"
        if os.getenv("PORT", "5000") == "5000"
        else f"{color}{chars['tl']}{chars['h'] * (inner_width + padding_left + padding_right + 1)}{chars['tr']}{reset}"
    )
    bottom_border = (
        f"{color}{chars['bl']}{chars['h'] * inner_width}{chars['br']}{reset}"
        if os.getenv("PORT", "5000") == "5000"
        else f"{color}{chars['bl']}{chars['h'] * (inner_width + padding_left + padding_right + 1)}{chars['br']}{reset}"
    )

    content_lines = []

    for line in lines:
        right_spaces = inner_width - padding_left - len(line)
        content_lines.append(
            f"{color}{chars['v']}{reset}"
            f"{' ' * padding_left}{line}{' ' * right_spaces}"
            f"{color}{chars['v']}{reset}"
        )

    return "\n".join([top_border] + content_lines + [bottom_border])


def get_env_or_default(key: str, default: str) -> str:
    return os.getenv(key, default)


def format_system_info(python_version: str, port: str, mode: str, time: str) -> str:
    return dedent(
        f"""
            Python: {python_version}
            Port: {port}
            Mode: {mode}
            Time: {time}
        """
    )


def get_system_info_data() -> Dict[str, str]:
    port = get_env_or_default("PORT", "5000")
    mode = "Development" if port == "5000" else "Production"

    return {
        "python_version": sys.version.split()[0],
        "port": port,
        "mode": mode,
        "time": get_transformed_date(datetime.now()),
    }


def system_info(port: str = None) -> str:
    port = port or get_env_or_default("PORT", "5000")
    data = get_system_info_data()
    info_text = format_system_info(
        data["python_version"], port, data["mode"], data["time"]
    )

    return create_box(
        info_text,
        padding_right=0,
        padding_left=2,
        border_color="cyan",
        border_style="round",
    )


def generate_figlet_text(text: str, font: str) -> str:
    f = Figlet(font=font)
    return f.renderText(text)


def compose_banner_output(figlet_text: str, desc: str, sys_info: str) -> str:
    return f"\n{figlet_text}\n{desc}\n{sys_info}\n"


def try_except_wrapper(func: Callable, error_message: str) -> Callable:
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as error:
            print(f"🚨 WARNING :: {error_message} : {str(error)}", file=sys.stderr)
            return None

    return wrapper


def banner(port: str = None) -> None:
    port = port or get_env_or_default("PORT", "5000")

    banner_theme = get_random_item(banner_themes_config)
    desc_theme = get_random_item(banner_themes_config)

    figlet_text = generate_figlet_text(
        app_config.name.upper(), banner_fonts_config.ansi_shadow
    )
    colored_figlet = apply_gradient(figlet_text, banner_theme["gradient"])
    colored_desc = apply_gradient(app_config.description, desc_theme["gradient"])
    sys_info = system_info(port)

    output = compose_banner_output(colored_figlet, colored_desc, sys_info)

    if os.getenv("PORT", "5000") == "5000":
        print(output)
    else:
        for line in reversed(output.splitlines()):
            print(line)


show_banner = try_except_wrapper(banner, errors_config.banner_error.message)
