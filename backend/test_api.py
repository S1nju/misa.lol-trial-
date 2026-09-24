import pytest
import main
from fastapi.testclient import TestClient

client = TestClient(main.app)

@pytest.fixture(autouse=True)
def reset_profile_state():
    """Reset current_profile state to default initial profile before and after each test."""
    main.current_profile = main.copy.deepcopy(main.INITIAL_PROFILE)
    yield
    main.current_profile = main.copy.deepcopy(main.INITIAL_PROFILE)


def test_get_profile():
    response = client.get("/api/profile")
    assert response.status_code == 200
    assert response.json()["displayName"] == "Nova"


def test_put_profile_valid():
    valid_payload = {
        "displayName": "  Nova Star  ",
        "bio": "  Coding late into the night.  ",
        "link": {
            "label": "  Portfolio  ",
            "url": "  https://nova.dev  "
        }
    }
    response = client.put("/api/profile", json=valid_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["displayName"] == "Nova Star"
    assert data["bio"] == "Coding late into the night."
    assert data["link"]["label"] == "Portfolio"
    assert data["link"]["url"] == "https://nova.dev"

    # Confirm GET returns updated state
    get_res = client.get("/api/profile")
    assert get_res.json() == data


def test_put_profile_invalid_http_url():
    prev_state = client.get("/api/profile").json()
    invalid_payload = {
        "displayName": "Valid Name",
        "bio": "Valid bio",
        "link": {
            "label": "Insecure Link",
            "url": "http://example.com"
        }
    }
    response = client.put("/api/profile", json=invalid_payload)
    assert response.status_code == 400
    assert "link.url" in response.json()["details"]
    assert client.get("/api/profile").json() == prev_state


def test_put_profile_regression_missing_double_slash():
    """Regression test: https:example.com must be rejected."""
    prev_state = client.get("/api/profile").json()
    invalid_payload = {
        "displayName": "Valid Name",
        "bio": "Valid bio",
        "link": {
            "label": "Missing Slashes",
            "url": "https:example.com"
        }
    }
    response = client.put("/api/profile", json=invalid_payload)
    assert response.status_code == 400
    assert "link.url" in response.json()["details"]
    assert client.get("/api/profile").json() == prev_state


def test_put_profile_regression_malformed_port():
    """Regression test: https://example.com:abc must be rejected."""
    prev_state = client.get("/api/profile").json()
    invalid_payload = {
        "displayName": "Valid Name",
        "bio": "Valid bio",
        "link": {
            "label": "Invalid Port",
            "url": "https://example.com:abc"
        }
    }
    response = client.put("/api/profile", json=invalid_payload)
    assert response.status_code == 400
    assert "link.url" in response.json()["details"]
    assert client.get("/api/profile").json() == prev_state


def test_put_profile_invalid_display_name_length():
    prev_state = client.get("/api/profile").json()
    invalid_payload = {
        "displayName": "a" * 41, # Exceeds 40 chars
        "bio": "Valid bio",
        "link": {
            "label": "Website",
            "url": "https://example.com"
        }
    }
    response = client.put("/api/profile", json=invalid_payload)
    assert response.status_code == 400
    assert "displayName" in response.json()["details"]
    assert client.get("/api/profile").json() == prev_state


def test_put_profile_invalid_empty_display_name():
    prev_state = client.get("/api/profile").json()
    invalid_payload = {
        "displayName": "    ", # Trims to empty string
        "bio": "Valid bio",
        "link": {
            "label": "Website",
            "url": "https://example.com"
        }
    }
    response = client.put("/api/profile", json=invalid_payload)
    assert response.status_code == 400
    assert "displayName" in response.json()["details"]
    assert client.get("/api/profile").json() == prev_state


def test_put_profile_invalid_javascript_scheme():
    invalid_payload = {
        "displayName": "Hacker",
        "bio": "Bio",
        "link": {
            "label": "XSS",
            "url": "javascript:alert(1)"
        }
    }
    response = client.put("/api/profile", json=invalid_payload)
    assert response.status_code == 400
    assert "link.url" in response.json()["details"]
