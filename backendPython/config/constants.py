import os
import re


HOST_PORT = int(os.getenv("HOST_PORT", 5000))
HOST_URL = os.getenv("HOST_URL", "http://localhost:5000")
CLIENT_PORT = int(os.getenv("CLIENT_PORT", 5000))
CLIENT_URL = os.getenv("CLIENT_URL", "http://localhost:3000")


NAME_REGEX = re.compile(r"^[A-Za-z]+$")
USER_NAME_REGEX = re.compile(r"^[A-Za-z0-9!@#$%&_]{4,}$")
EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
PASSWORD_REGEX = re.compile(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%&]).{6,}$")

UPPER_CASE_REGEX = re.compile(r"[A-Z]")
LOWER_CASE_REGEX = re.compile(r"[a-z]")
NUMBER_REGEX = re.compile(r"\d")
ALLOWED_SPECIAL_CHARACTERS_REGEX = re.compile(r"[@#$%&]")

PHONE_REGEX = re.compile(r"^\d{10}$")
COUNTRY_CODE_REGEX = re.compile(r"^\d{1,3}$")
PIN_CODE_REGEX = re.compile(r"^\d{6}$")

PHOTO_URL_REGEX = re.compile(
    r"^(https?:\/\/)([a-zA-Z0-9\-._~%]+@)?"
    r"([a-zA-Z0-9\-._~%]+\.)+[a-zA-Z]{2,}"
    r"(\/[^\s?#]*)*(\.(jpg|jpeg|png|gif|webp|svg))?"
    r"(\?[^\s]*)?$",
    re.IGNORECASE,
)

FACEBOOK_REGEX = re.compile(
    r"(?:https?:\/\/)?(?:www\.)?(?:facebook|fb|m\.facebook)\.(?:com|me)\/"
    r"(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-\.]*\/)*([\w\-\.]+)(?:\/)?",
    re.IGNORECASE,
)

INSTAGRAM_REGEX = re.compile(
    r"(?:https?:\/\/)?(?:www\.)?instagram\.com\/"
    r"([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}"
    r"(?:[A-Za-z0-9_]))?)",
    re.IGNORECASE,
)

TWITTER_REGEX = re.compile(
    r"https?:\/\/(?:www\.|m\.)?(?:twitter|x)\.com\/@?"
    r"([a-zA-Z0-9_]{1,15})(?:\/?|\?[^\s\/]*|\/[^\s\/]*)$",
    re.IGNORECASE,
)

GITHUB_REGEX = re.compile(r"^(https?:\/\/)?(www\.)?github\.com\/([a-zA-Z0-9_-]+)\/?$")

LINKEDIN_REGEX = re.compile(
    r"^(https?:\/\/)?([\w]+\.)?linkedin\.com\/"
    r"(mwlite\/|m\/)?in\/([a-zA-Z0-9À-ž_.-]+)\/?$"
)

YOUTUBE_REGEX = re.compile(
    r"(?:https?:\/\/)?(?:www\.)?youtube\.com\/" r"(?:channel\/|user\/|c\/|@)?([\w-]+)"
)

WEBSITE_REGEX = re.compile(
    r"^https?:\/\/(www\.)?[a-zA-Z0-9-]+" r"(\.[a-zA-Z0-9-]+)+(:\d+)?(\/[^\s]*)?$"
)
