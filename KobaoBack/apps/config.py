from pathlib import Path
import os
from dotenv import load_dotenv

# config.pyの親フォルダ(apps)の親フォルダ(flaskbook)をベースフォルダに設定
basedir = Path(__file__).parent.parent

# 共通の設定
class BaseConfig:
    # セッションを使用するのに必要
    SECRET_KEY = "2AZSMss3p5QPbcY2hBs"
    # .envファイルの読み込み
    load_dotenv()

# 個別の設定
class LocalConfig(BaseConfig):
    SQLALCHEMY_DATABASE_URI = F"sqlite:///{basedir / 'local.sqlite'}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True


class TestingConfig(BaseConfig):
    SQLALCHEMY_DATABASE_URI = F"sqlite:///{basedir / 'testing.sqlite'}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # CSRF対策のON/OFF
    WTF_CSRF_ENABLED = False

class PostgresConfig(BaseConfig):
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

# 辞書にマッピング
config = {
    "testing" : TestingConfig,
    "local" : LocalConfig,
    "postgres":PostgresConfig,
}