from flask import Blueprint, jsonify, request
from apps.app import db
from apps.models import Student, Teacher
from flask_jwt_extended import (
    create_access_token, create_refresh_token,
    jwt_required, get_jwt, get_jwt_identity
)

auth = Blueprint(
    "auth",
    __name__
)

# 一時的にブラックリストを作成、後で変更する
REVOKED = set()

# ログイン
@auth.route('/login', methods=["POST"])
def login():
    # idとpasswordを取得
    data = request.get_json()
    id = data.get('id')
    password = data.get('password')

    # 生徒と教師の判別用
    role = "student"
    # 生徒の認証
    user = Student.query.filter_by(id=id, hash_pass=password).first()
    # 生徒が存在しない場合は教師を確認
    if not user:
        user = Teacher.query.filter_by(id=id, hash_pass=password).first()
        # 教師が存在する場合はroleをteacherに変更
        if user:
            role  = "teacher"
        # ユーザーが存在しない場合はエラーを返す
        else:
            return jsonify({'result': 'false'}), 401
    
    # ユーザーが存在する場合はトークンを作成
    claims = {"role": role}
    # アクセストークンの作成
    access  = create_access_token(identity=user["id"], additional_claims=claims)
    # リフレッシュトークンの作成
    refresh = create_refresh_token(identity=user["id"], additional_claims=claims)

    return jsonify({'result': 'success', "access": access, "refresh": refresh, "role": role}), 200

