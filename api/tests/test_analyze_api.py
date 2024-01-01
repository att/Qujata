import unittest
from datetime import datetime
import json

import requests
from flask import Flask
from unittest.mock import Mock, MagicMock, patch

from src.api.analyze_api import api
from src.enums.status import Status
import src.api.analyze_api as analyze_api
import src.services.metrics_service as metrics_service
from config.settings import load_config
from src.utils.database_manager import DatabaseManager
import logging

PATH = '/api/analyze'
CONTENT_TYPE = 'application/json'


@patch('src.services.metrics_service.start_collecting', return_value=None)
@patch('src.services.metrics_service.stop_collecting', return_value=None)
class TestAnalyzeAPI(unittest.TestCase):
    def setUp(self):
        self.app = Flask(__name__)
        self.app.register_blueprint(api, url_prefix='/api')
        self.client = self.app.test_client()
        load_config(self.app)
        self.app.database_manager = Mock(spec=DatabaseManager)


    def test_analyze(self, mock_start_collecting, mock_stop_collecting):
        input_data = {
            "algorithms":["kyber512"],
            "iterationsCount": [1000, 2000],
            "experimentName": "name",
            "description": "name"
        }
        # Mock the requests.post call
        with patch('requests.post') as mock_post:
            with patch('requests.get') as mock_get:
                mock_get.return_value.status_code = 200
                mock_get.return_value.json.return_value = {}
                mock_post.return_value = MagicMock(status_code=200, json=lambda: {'result': 'success'})

                response = self.client.post(PATH,
                                        data=json.dumps(input_data),
                                        content_type=CONTENT_TYPE)

            
                self.assertEqual(self.app.database_manager.create.call_count, 11)# 1 for the test suite, and 2 for test runs and 4*2(8) for test run results
            
                self.assertEqual(response.status_code, 200)
                # Check the response content
                response_data = json.loads(response.data)
                self.assertIn('test_suite_id', response_data)
                self.assertEqual(mock_start_collecting.call_count, 2)
                self.assertEqual(mock_stop_collecting.call_count, 2)



    def test_analyze_return_general_error(self, mock_start_collecting, mock_stop_collecting):
        input_data = {
            "algorithms":["kyber512"],
            "iterationsCount": [1000],
            "experimentName": "name",
            "description": "name"

        }
        # Mock the requests.post call to raise an exception
        with patch('requests.get') as mock_get:
            mock_get.return_value.status_code = 200
            with patch('requests.post', side_effect=requests.exceptions.RequestException("Test exception")) as mock_post:
                response = self.client.post(PATH,
                                        data=json.dumps(input_data),
                                        content_type=CONTENT_TYPE)
                self.assertEqual(response.status_code, 500)
                response_json = json.loads(response.data)
                self.assertEqual(response_json["error"], "An error occurred while processing the request")
                self.assertEqual(response_json["message"], "")

    def test_analyze_with_invalid_iterations_count(self, mock_start_collecting, mock_stop_collecting):
        input_data = {
            "algorithms":["kyber512"],
            "iterationsCount": [-1],
            "experimentName": "name",
            "description": "name"
        }
        response = self.client.post(PATH,
                                    data=json.dumps(input_data),
                                    content_type=CONTENT_TYPE)
        self.assertEqual(response.status_code, 400)
        response_json = json.loads(response.data)
        self.assertEqual(response_json["error"], "Invalid data provided")
        self.assertEqual(response_json["message"], "The number of iterations should be greater than 0")


    def test_analyze_with_invalid_algorithm(self, mock_start_collecting, mock_stop_collecting):
        input_data = {
            "algorithms":["invalid_algorithm"],
            "iterationsCount": [1000],
            "experimentName": "name",
            "description": "name"
        }        
        response = self.client.post(PATH,
                                    data=json.dumps(input_data),
                                    content_type=CONTENT_TYPE)
        self.assertEqual(response.status_code, 400)
        response_json = json.loads(response.data)
        self.assertEqual(response_json["error"], "Invalid data provided")
        self.assertEqual(response_json["message"], "Algorithm \"invalid_algorithm\" is not supported")

   
    def test_analyze_with_invalid_body(self, mock_start_collecting, mock_stop_collecting):  
        input_data = {
            "iterationsCount": 1000,
            "experimentName": "name",
            "description": "name"
        }
        response = self.client.post(PATH,
                                data=json.dumps(input_data),
                                content_type=CONTENT_TYPE)
        self.assertEqual(response.status_code, 400)
        response_json = json.loads(response.data)
        self.assertEqual(response_json["error"], "Invalid data provided")
        self.assertEqual(response_json["message"], "Missing properties, required properties: algorithms, iterationsCount, experimentName, description")

    def test_analyze_with_curl_failure(self, mock_start_collecting, mock_stop_collecting):
        input_data = {
            "algorithms":["kyber512"],
            "iterationsCount": [1000],
            "experimentName": "name",
            "description": "name"
        }
        # Mock the requests.post call
        with patch('requests.post') as mock_post:
            with patch('requests.get') as mock_get:
                mock_get.return_value.status_code = 200
                mock_post.return_value = MagicMock(status_code=423, json=lambda: {'result': 'failed'})
                response = self.client.post(PATH,
                                        data=json.dumps(input_data),
                                        content_type=CONTENT_TYPE)
                self.assertEqual(response.status_code, 200)
                actual_test_run = self.app.database_manager.create.call_args_list[1].args
                self.assertEqual(actual_test_run[0].status, Status.FAILED)
                self.assertEqual(actual_test_run[0].status_message, '{"result": "failed"}')



    def test_analyze_with_missing_env_info(self, mock_start_collecting, mock_stop_collecting):
        input_data = {
            "algorithms":["kyber512"],
            "iterationsCount": [1000],
            "experimentName": "name",
            "description": "name"
        }
        self.app.database_manager.get_latest.return_value = None
        response = self.client.post(PATH,
                                data=json.dumps(input_data),
                                content_type=CONTENT_TYPE)
        self.assertEqual(response.status_code, 422)
        response_json = json.loads(response.data)
        self.assertEqual(response_json["error"], "Analyze test failed to complete")
        self.assertEqual(response_json["message"], "Missing env info in database")


    def test_analyze_with_423(self, mock_start_collecting, mock_stop_collecting):
        with patch('requests.get') as mock_get:
            mock_get.return_value.status_code = 200
            # global process_is_running
            input_data = {
                "algorithms":["kyber512"],
                "iterationsCount": [1000],
                "experimentName": "name",
                "description": "name"
            }
            analyze_api.process_is_running = True
            # Mock the requests.post call
            response = self.client.post(PATH,
                                        data=json.dumps(input_data),
                                        content_type=CONTENT_TYPE)

            self.assertEqual(response.status_code, 423)
            response_json = json.loads(response.data)
            self.assertEqual(response_json["error"], "Current test is still running")
            analyze_api.process_is_running = False

    def test_analyze_sleep_between_tests(self, mock_start_collecting, mock_stop_collecting):
        input_data = {
            "algorithms":["kyber512","frodo640aes"],
            "iterationsCount": [1000],
            "experimentName": "name",
            "description": "name"
        }
        with patch('requests.get') as mock_get:
            mock_get.return_value.status_code = 200
            with patch('requests.post') as mock_post:
                mock_post.return_value = MagicMock(status_code=200, json=lambda: {'result': 'success'})
                timestamp1 = datetime.now()
                response = self.client.post(PATH,
                                        data=json.dumps(input_data),
                                        content_type=CONTENT_TYPE)


                timestamp2 = datetime.now()
                time_difference = timestamp2 - timestamp1

                self.assertEqual(response.status_code, 200)
                self.assertGreaterEqual(time_difference.seconds, 15)


if __name__ == '__main__':
    unittest.main()
