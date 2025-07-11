import os
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, '.env'))

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
    
    # Database configuration
    MONGO_URI = os.environ.get('MONGO_URI') or 'mongodb://localhost:27017/your_app_name'
    
    # AWS configuration
    AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')
    AWS_REGION = os.environ.get('AWS_REGION') or 'us-east-1'
    
    # Add other configuration variables as needed
    DEBUG = os.environ.get('DEBUG') is not None
    
    # Logging
    LOG_TO_STDOUT = os.environ.get('LOG_TO_STDOUT')