from flask import Flask
from apps.config import config
from flask_cors import CORS


def create_app(config_key):
    app = Flask(__name__)
    app.config.from_object(config[config_key])
    # 他サイトからのリクエストを受け取れるようにしている
    # あとで受け取れるサイトを絞る
    CORS(app)

    from apps.chatbot import views as chatbot_views

    app.register_blueprint(chatbot_views.chatbot, url_prefix="/chatbot")
    
    return app