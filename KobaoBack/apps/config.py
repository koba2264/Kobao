from pathlib import Path
import os
from dotenv import load_dotenv
from datetime import timedelta

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
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    
    # jwt認証用
    # .envファイルから秘密鍵を取得
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    # アクセストークンの有効期限
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=30)
    # リフレッシュトークンの有効期限
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    # トークンの取得場所
    JWT_TOKEN_LOCATION = ["headers"]

class TestingConfig(BaseConfig):
    SQLALCHEMY_DATABASE_URI = F"sqlite:///{basedir / 'testing.sqlite'}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # CSRF対策のON/OFF
    WTF_CSRF_ENABLED = False

# 辞書にマッピング
config = {
    "testing" : TestingConfig,
    "local" : LocalConfig,
}