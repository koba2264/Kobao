from flask import Flask
from apps.config import config
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    config_key = 'testing'

    app.config.from_object(config[config_key])
    # 他サイトからのリクエストを受け取れるようにしている
    # あとで受け取れるサイトを絞る
    CORS(app, supports_credentials=True, origins=["http://localhost:8081"])
    # jwt認証用
    jwt.init_app(app)
    
    db.init_app(app)

    db.init_app(app)

    from apps.chatbot import views as chatbot_views

    from apps.teacher import views as teacher_views
    from apps.administrator import views as administrator_views

    app.register_blueprint(chatbot_views.chatbot, url_prefix="/chatbot")

    app.register_blueprint(teacher_views.teacher, url_prefix="/teacher")

    app.register_blueprint(administrator_views.administrator, url_prefix="/administrator")

    from apps.auth import views as auth_views

    app.register_blueprint(chatbot_views.chatbot, url_prefix="/chatbot")
    app.register_blueprint(auth_views.auth, url_prefix="/auth")

    from apps.student import views as student_views

    app.register_blueprint(student_views.student, url_prefix="/student")

    with app.app_context():
        db.create_all()

    
    return app

