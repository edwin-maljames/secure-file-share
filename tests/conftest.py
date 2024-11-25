import pytest
import requests
from utils import TestClient

@pytest.fixture
def client():
    return TestClient()

@pytest.fixture(scope="session", autouse=True)
def create_test_user():
    # Create test user using Django admin
    admin_url = "http://backend:8000/admin/"
    create_user_url = "http://backend:8000/api/auth/register/"
    
    try:
        # Try to create user via API first
        response = requests.post(
            create_user_url,
            json={
                "username": "testuser",
                "password": "testpass123",
                "email": "test@example.com"
            }
        )
        
        if response.status_code not in [201, 200, 400]:  # 400 means user might already exist
            pytest.fail(f"Failed to create test user: {response.text}")
            
    except requests.RequestException as e:
        pytest.fail(f"Failed to create test user: {str(e)}")

@pytest.fixture(autouse=True)
def run_before_and_after_tests():
    # Setup
    yield
    # Teardown (if needed)
