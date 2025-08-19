from flask import Flask
from apps.config import config
from flask_cors import CORS
from apps.models import db


def create_app(config_key):
    app = Flask(__name__)
    app.config.from_object(config[config_key])
    # 他サイトからのリクエストを受け取れるようにしている
    # あとで受け取れるサイトを絞る
    CORS(app)

    db.init_app(app)

    from apps.student import views as student_views

    app.register_blueprint(student_views.student, url_prefix="/student")

    with app.app_context():
        db.create_all()
    
    return app