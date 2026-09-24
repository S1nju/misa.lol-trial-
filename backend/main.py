from fastapi import FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from urllib.parse import urlparse
import copy

app = FastAPI(title="misa.lol Profile API")

# Enable CORS for local dev and Docker container communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initial profile state
INITIAL_PROFILE = {
    "displayName": "Nova",
    "bio": "Music, late nights, and things I make.",
    "link": {
        "label": "My website",
        "url": "https://example.com"
    }
}

# In-memory storage
current_profile = copy.deepcopy(INITIAL_PROFILE)


def validate_profile_payload(data: dict) -> tuple[dict, dict[str, str]]:
    """
    Validates profile update payload according to backend contract rules.
    Returns (cleaned_data, errors).
    """
    errors = {}

    if not isinstance(data, dict):
        return {}, {"_global": "Request payload must be a JSON object."}

    # Check required keys
    for key in ["displayName", "bio", "link"]:
        if key not in data:
            errors[key] = f"Field '{key}' is required."

    if "link" in errors:
        return {}, errors

    # Check types
    display_name_raw = data.get("displayName")
    bio_raw = data.get("bio")
    link_obj = data.get("link")

    if not isinstance(display_name_raw, str):
        errors["displayName"] = "Display name must be a string."
    if not isinstance(bio_raw, str):
        errors["bio"] = "Bio must be a string."
    if not isinstance(link_obj, dict):
        errors["link"] = "Link must be an object with label and url."
        return {}, errors

    label_raw = link_obj.get("label")
    url_raw = link_obj.get("url")

    if not isinstance(label_raw, str):
        errors["link.label"] = "Link label must be a string."
    if not isinstance(url_raw, str):
        errors["link.url"] = "Link URL must be a string."

    if errors:
        return {}, errors

    # Trim leading and trailing whitespace
    display_name = display_name_raw.strip()
    bio = bio_raw.strip()
    link_label = label_raw.strip()
    link_url = url_raw.strip()

    # Rule: Display name 1–40 characters after trimming
    if len(display_name) < 1 or len(display_name) > 40:
        errors["displayName"] = "Display name must be between 1 and 40 characters after trimming."

    # Rule: Bio 0–160 characters after trimming
    if len(bio) > 160:
        errors["bio"] = "Bio must be 160 characters or fewer."

    # Rule: Link label 1–30 characters after trimming
    if len(link_label) < 1 or len(link_label) > 30:
        errors["link.label"] = "Link label must be between 1 and 30 characters after trimming."

    # Rule: Link URL must be a valid absolute https:// URL with a hostname
    if not link_url:
        errors["link.url"] = "Link URL is required."
    elif not link_url.startswith("https://"):
        errors["link.url"] = "Link URL must start with 'https://'."
    else:
        try:
            parsed = urlparse(link_url)
            # Accessing parsed.port validates integer port format
            _ = parsed.port
            if parsed.scheme != "https":
                errors["link.url"] = "Link URL must start with 'https://'."
            elif not parsed.netloc or not parsed.hostname:
                errors["link.url"] = "Link URL must include a valid domain hostname (e.g. https://example.com)."
        except ValueError:
            errors["link.url"] = "Link URL contains an invalid port number."
        except Exception:
            errors["link.url"] = "Link URL is malformed."

    if errors:
        return {}, errors

    cleaned_profile = {
        "displayName": display_name,
        "bio": bio,
        "link": {
            "label": link_label,
            "url": link_url
        }
    }
    return cleaned_profile, {}


@app.get("/api/profile")
def get_profile():
    """Returns current profile."""
    return current_profile


@app.put("/api/profile")
async def update_profile(request: Request):
    """
    Accepts complete profile payload, validates it, updates memory store,
    and returns 200 with saved profile. Returns 400 on invalid input.
    """
    global current_profile

    try:
        data = await request.json()
    except Exception:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "error": "Invalid request body",
                "details": {"_global": "Request body must be valid JSON."}
            }
        )

    cleaned_profile, errors = validate_profile_payload(data)

    if errors:
        # Return 400 with details and leave stored profile unchanged
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "error": "Validation failed",
                "details": errors
            }
        )

    # Save to stored profile
    current_profile = cleaned_profile
    return current_profile
