import logging
import os
from dotenv import load_dotenv


def load_config(app):
    load_dotenv()
    app.configurations = Configuration({
        'environment': os.environ.get('ENVIRONMENT'),
        'log_level': os.environ.get('LOG_LEVEL', 'INFO'),
        'allowedAlgorithms': os.environ.get('DEFAULT_GROUPS', "kyber512:frodo640aes").split(":"),
        'curl_url': os.environ.get('CURL_URL', "http://localhost:3010"),
        'cadvisor_url': os.environ.get('CADVISOR_URL', "http://localhost:8080"),
        'request_timeout': os.environ.get('REQUEST_TIMEOUT', 3600),
        'code_release': os.environ.get('CODE_RELEASE'),
        'protocol': os.environ.get('PROTOCOL'),
        'iterations_options': list(map(int, os.environ.get('ITERATIONS_OPTIONS', "100:500:1000:2000:5000:10000:50000").split(':')))
    })


class Configuration:
    def __init__(self, config_dict):
        self.__validate_environment(config_dict.get('environment'))
        self.__configure_logging(config_dict.get('log_level', 'INFO'))
        self.environment = config_dict.get('environment')
        self.allowedAlgorithms = config_dict.get('allowedAlgorithms')
        self.curl_url = config_dict.get('curl_url')
        self.cadvisor_url = config_dict.get('cadvisor_url')
        self.request_timeout = config_dict.get('request_timeout')
        self.code_release = config_dict.get('code_release')
        self.protocol = config_dict.get('protocol')
        self.iterations_options = config_dict.get('iterations_options')

    def __validate_environment(self, environment):
        valid_environments = ['docker', 'kubernetes']
        if environment not in valid_environments:
            raise ValueError(f"Invalid environment: {environment}. Must be one of {valid_environments}")

    def __configure_logging(self, log_level):
        logging.basicConfig(level=getattr(logging, log_level.upper(), None))

