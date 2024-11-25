import json
import requests
import pytest
import time
from typing import Dict, List
import logging
from utils import TestClient, create_test_file

logger = logging.getLogger(__name__)

class APITestGenerator:
    def __init__(self):
        self.schema_url = "http://backend:8000/api/schema/"
        self.client = TestClient()
        self.schema = self._fetch_schema_with_retry()
        self.test_file = create_test_file()

    def _fetch_schema_with_retry(self, max_retries=5, delay=2) -> Dict:
        """Fetch the OpenAPI schema from the backend with retries"""
        for attempt in range(max_retries):
            try:
                response = requests.get(self.schema_url)
                response.raise_for_status()  # Raise an error for bad status codes
                return response.json()
            except (requests.RequestException, json.JSONDecodeError) as e:
                if attempt == max_retries - 1:  # Last attempt
                    logger.error(f"Failed to fetch schema after {max_retries} attempts: {e}")
                    return {"paths": {}}  # Return empty schema as fallback
                logger.warning(f"Attempt {attempt + 1} failed, retrying in {delay} seconds...")
                time.sleep(delay)

    def _get_endpoints(self) -> List[Dict]:
        """Extract endpoints from the schema"""
        endpoints = []
        paths = self.schema.get('paths', {})
        for path, methods in paths.items():
            for method, details in methods.items():
                endpoints.append({
                    'path': path,
                    'method': method.upper(),
                    'operation_id': details.get('operationId', f"{method}_{path}".replace('/', '_')),
                    'summary': details.get('summary', ''),
                    'parameters': details.get('parameters', []),
                    'request_body': details.get('requestBody', {}),
                    'responses': details.get('responses', {'200': {}}),  # Default to 200 if no responses defined
                    'security': details.get('security', [])
                })
        return endpoints

    def _generate_test_data(self, endpoint: Dict) -> Dict:
        """Generate test data based on endpoint specification"""
        data = {}
        if endpoint.get('request_body'):
            schema = endpoint['request_body'].get('content', {}).get('application/json', {}).get('schema', {})
            properties = schema.get('properties', {})
            for prop, details in properties.items():
                if details.get('type') == 'string':
                    data[prop] = f"test_{prop}"
                elif details.get('type') == 'integer':
                    data[prop] = 1
                elif details.get('type') == 'boolean':
                    data[prop] = True
                elif details.get('type') == 'file':
                    data[prop] = self.test_file
        return data

    def generate_tests(self):
        """Generate test cases for each endpoint"""
        endpoints = self._get_endpoints()
        test_cases = []

        if not endpoints:
            # Add default test cases if no schema is available
            test_cases.extend([
                {
                    'name': 'test_token_obtain',
                    'path': '/api/token/',
                    'method': 'POST',
                    'requires_auth': False,
                    'test_data': {'username': 'testuser', 'password': 'testpass123'},
                    'expected_status': '200'
                },
                {
                    'name': 'test_token_refresh',
                    'path': '/api/token/refresh/',
                    'method': 'POST',
                    'requires_auth': True,
                    'test_data': {},
                    'expected_status': '200'
                }
            ])
            return test_cases

        for endpoint in endpoints:
            requires_auth = any('Bearer' in sec.get('bearerAuth', '') 
                              for sec in endpoint['security'])
            
            test_case = {
                'name': f"test_{endpoint['operation_id']}",
                'path': endpoint['path'],
                'method': endpoint['method'],
                'requires_auth': requires_auth,
                'test_data': self._generate_test_data(endpoint),
                'expected_status': list(endpoint['responses'].keys())[0]
            }
            test_cases.append(test_case)

        return test_cases

def create_test_function(test_case: Dict):
    """Create a test function for a test case"""
    def test_func(client):
        if test_case['requires_auth']:
            client.login("testuser", "testpass123")

        method = getattr(client.session, test_case['method'].lower())
        url = f"{client.base_url}{test_case['path']}"
        
        response = method(url, json=test_case['test_data'])
        assert str(response.status_code) == test_case['expected_status']

    return test_func

def pytest_generate_tests(metafunc):
    """Generate test functions dynamically"""
    if 'client' in metafunc.fixturenames:
        generator = APITestGenerator()
        test_cases = generator.generate_tests()
        
        # Create test functions dynamically
        for test_case in test_cases:
            test_func = create_test_function(test_case)
            # Add the test function to the module
            globals()[test_case['name']] = pytest.mark.generated(test_func)

# Example of how to use the generated tests
def test_generated_example(client):
    """This is a placeholder to ensure pytest collects the generated tests"""
    pass
