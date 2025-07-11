import os
from flask import Flask
from app.api.routes import api_bp
from config import Config
from database.db import db
from flask_migrate import Migrate
from werkzeug.exceptions import HTTPException
from app.exceptions.custom_exceptions import CustomException
import logging
from logging.handlers import RotatingFileHandler
from flask import jsonify  # Moved to the top for consistency

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize Flask extensions here
    db.init_app(app)
    migrate = Migrate(app, db)  # Corrected placement

    # Register blueprints here
    app.register_blueprint(api_bp, url_prefix='/api')

    # Configure logging
    if not app.debug and not app.testing:
        if not os.path.exists('logs'):
            os.makedirs('logs')
        file_handler = RotatingFileHandler('logs/app.log',
                                           maxBytes=10240, backupCount=10,
                                           encoding='utf-8')
        file_handler.setFormatter(logging.Formatter(
            '%(asctime)s %(levelname)s: %(message)s '
            '[in %(pathname)s:%(lineno)d]'
        ))
        file_handler.setLevel(logging.INFO)
        app.logger.addHandler(file_handler)

        app.logger.setLevel(logging.INFO)
        app.logger.info('Application startup')

    @app.errorhandler(Exception)
    def handle_exception(e):
        # Pass through HTTP errors
        if isinstance(e, HTTPException):
            return e

        # Handle custom errors
        if isinstance(e, CustomException):
            return jsonify(error=str(e), status_code=e.status_code), e.status_code

        # Handle all other errors
        app.logger.error(f"Unhandled Exception: {str(e)}", exc_info=True)
        return jsonify(error="Internal Server Error", status_code=500), 500
    
    return app


app = create_app()

if __name__ == '__main__':
    app.run(debug=True)