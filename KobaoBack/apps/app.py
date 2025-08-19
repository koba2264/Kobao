from flask import Flask
from apps.config import config
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager

db = SQLAlchemy()

def create_app(config_key):
    app = Flask(__name__)
    app.config.from_object(config[config_key])
    # 他サイトからのリクエストを受け取れるようにしている
    # あとで受け取れるサイトを絞る
    CORS(app)
    # jwt認証用
    JWTManager(app)
    
    db.init_app(app)

    from apps.chatbot import views as chatbot_views
    from apps.auth import views as auth_views

    app.register_blueprint(chatbot_views.chatbot, url_prefix="/chatbot")
    app.register_blueprint(auth_views.auth, url_prefix="/auth")

    from apps.student import views as student_views

    app.register_blueprint(student_views.student, url_prefix="/student")

    with app.app_context():
        db.create_all()
    
    return app