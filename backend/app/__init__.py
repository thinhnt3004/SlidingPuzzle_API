from flask import Flask
from flask_cors import CORS

def create_app():  # <--- Hàm này bắt buộc phải tên là create_app
    app = Flask(__name__)
    CORS(app)
    
    # Đăng ký Blueprint API
    from app.routes.game_api import api_bp
    app.register_blueprint(api_bp, url_prefix='/api')
    
    return app