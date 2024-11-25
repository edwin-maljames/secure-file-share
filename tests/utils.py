import os
import requests
from typing import Dict, Optional

class TestClient:
    def __init__(self):
        self.base_url = "http://backend:8000/api"
        self.token = None
        self.session = requests.Session()

    def login(self, username: str, password: str) -> Dict:
        response = self.session.post(
            f"{self.base_url}/token/",
            json={"username": username, "password": password}
        )
        if response.status_code == 200:
            self.token = response.json()["access"]
            self.session.headers.update({"Authorization": f"Bearer {self.token}"})
        return response.json()

    def refresh_token(self, refresh_token: str) -> Dict:
        response = self.session.post(
            f"{self.base_url}/token/refresh/",
            json={"refresh": refresh_token}
        )
        if response.status_code == 200:
            self.token = response.json()["access"]
            self.session.headers.update({"Authorization": f"Bearer {self.token}"})
        return response.json()

    def upload_file(self, file_path: str) -> Dict:
        with open(file_path, "rb") as f:
            files = {"file": f}
            response = self.session.post(f"{self.base_url}/files/upload/", files=files)
        return response.json()

    def list_files(self) -> Dict:
        response = self.session.get(f"{self.base_url}/files/")
        return response.json()

    def download_file(self, file_id: int) -> bytes:
        response = self.session.get(f"{self.base_url}/files/{file_id}/download/")
        return response.content

    def share_file(self, file_id: int, username: str) -> Dict:
        response = self.session.post(
            f"{self.base_url}/files/{file_id}/share/",
            json={"username": username}
        )
        return response.json()

    def get_shared_files(self) -> Dict:
        response = self.session.get(f"{self.base_url}/files/shared/")
        return response.json()

def create_test_file(content: str = "test content") -> str:
    file_path = "test_file.txt"
    with open(file_path, "w") as f:
        f.write(content)
    return file_path
