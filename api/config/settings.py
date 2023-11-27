import os
from dotenv import load_dotenv
def load_config(app):
    load_dotenv()
    app.allowedAlgorithms = os.environ.get('DEFAULT_GROUPS',"kyber512:frodo640aes").split(":")
    app.qujata_platform_exporter_target = os.environ.get('PLATFORM_EXPORTER_URL', "http://localhost:5000")
    app.qujata_curl_target = os.environ.get('CURL_URL', "http://localhost:3010")
    app.request_timeout = os.environ.get('REQUEST_TIMEOUT', 900)
    app.iterations_options = os.environ.get('ITERATIONS_OPTIONS', "100:500:1000:2000:5000:10000:50000")