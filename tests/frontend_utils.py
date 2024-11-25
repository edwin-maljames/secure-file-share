from playwright.sync_api import Page, expect
import os

class FrontendTest:
    def __init__(self, page: Page):
        self.page = page
        self.base_url = "http://frontend:3000"

    def goto_home(self):
        self.page.goto(self.base_url)

    def login(self, username: str, password: str):
        self.goto_home()
        # Fill login form
        self.page.fill('input[name="username"]', username)
        self.page.fill('input[name="password"]', password)
        self.page.click('button[type="submit"]')
        # Wait for navigation
        self.page.wait_for_url(f"{self.base_url}/files")

    def upload_file(self, file_path: str):
        # Navigate to files page
        self.page.goto(f"{self.base_url}/files")
        
        # Upload file using the file input
        with self.page.expect_file_chooser() as fc_info:
            self.page.click('button:has-text("Upload")')
        file_chooser = fc_info.value
        file_chooser.set_files(file_path)
        
        # Wait for upload to complete
        self.page.wait_for_selector(f'text={os.path.basename(file_path)}')

    def get_file_list(self):
        self.page.goto(f"{self.base_url}/files")
        # Wait for file list to load
        self.page.wait_for_selector('[data-testid="file-list"]')
        return self.page.query_selector_all('[data-testid="file-item"]')

    def share_file(self, file_name: str, username: str):
        self.page.goto(f"{self.base_url}/files")
        # Find the file and click share
        file_row = self.page.locator(f'[data-testid="file-item"]:has-text("{file_name}")')
        file_row.locator('button:has-text("Share")').click()
        
        # Fill share modal
        self.page.fill('input[name="username"]', username)
        self.page.click('button:has-text("Share")')
        
        # Wait for success message
        self.page.wait_for_selector('text=File shared successfully')

    def download_file(self, file_name: str):
        self.page.goto(f"{self.base_url}/files")
        # Find the file and click download
        with self.page.expect_download() as download_info:
            file_row = self.page.locator(f'[data-testid="file-item"]:has-text("{file_name}")')
            file_row.locator('button:has-text("Download")').click()
        download = download_info.value
        return download

    def logout(self):
        self.page.click('button:has-text("Logout")')
        # Wait for redirect to login page
        self.page.wait_for_url(f"{self.base_url}/login")
