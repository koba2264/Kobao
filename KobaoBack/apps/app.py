from flask import Flask
from apps.config import config
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    config_key = 'testing'

    app.config.from_object(config[config_key])
    # 他サイトからのリクエストを受け取れるようにしている
    # あとで受け取れるサイトを絞る
    CORS(app)

    db.init_app(app)

    Migrate(app,db)

    from apps.chatbot import views as chatbot_views
    from apps.chatbot import models

    app.register_blueprint(chatbot_views.chatbot, url_prefix="/chatbot")
    
    return app

