import pytest
import os
from utils import TestClient, create_test_file

@pytest.fixture
def client():
    return TestClient()

@pytest.fixture
def test_file():
    file_path = create_test_file()
    yield file_path
    if os.path.exists(file_path):
        os.remove(file_path)

@pytest.mark.auth
class TestAuthentication:
    def test_login_success(self, client):
        response = client.login("testuser", "testpass123")
        assert "access" in response
        assert "refresh" in response

    def test_login_failure(self, client):
        response = client.login("wronguser", "wrongpass")
        assert "access" not in response

@pytest.mark.files
class TestFileOperations:
    def test_upload_file(self, client, test_file):
        client.login("testuser", "testpass123")
        response = client.upload_file(test_file)
        assert "id" in response
        assert "name" in response

    def test_list_files(self, client):
        client.login("testuser", "testpass123")
        response = client.list_files()
        assert isinstance(response, list)

    def test_download_file(self, client, test_file):
        client.login("testuser", "testpass123")
        upload_response = client.upload_file(test_file)
        file_id = upload_response["id"]
        content = client.download_file(file_id)
        assert content == b"test content"

@pytest.mark.sharing
class TestFileSharing:
    def test_share_file(self, client, test_file):
        client.login("testuser", "testpass123")
        upload_response = client.upload_file(test_file)
        file_id = upload_response["id"]
        share_response = client.share_file(file_id, "otheruser")
        assert "success" in share_response

    def test_list_shared_files(self, client):
        client.login("otheruser", "testpass123")
        response = client.get_shared_files()
        assert isinstance(response, list)
