from flask import Blueprint, jsonify, request
from apps.app import db,jwt
from apps.models import Student, Teacher
from flask_jwt_extended import (
    create_access_token, create_refresh_token,
    jwt_required, get_jwt, get_jwt_identity
)
from flask_bcrypt import Bcrypt

auth = Blueprint(
    "auth",
    __name__
)
bcrypt = Bcrypt()

# 一時的にブラックリストを作成、後で変更する
REVOKED = set()

# 受信した JWT の jti（一意ID）が失効リストにあれば拒否
@jwt.token_in_blocklist_loader
def check_if_revoked(jwt_header, jwt_payload):
    return jwt_payload.get("jti") in REVOKED

# ログイン
@auth.route('/login', methods=["POST"])
def login():
    data = request.get_json()
    id = data.get('id')
    password = data.get('password')

    role = "student"
    user = Student.query.filter_by(id=id).first()
    # 学生に一致するIDが存在するかとパスワード確認
    if user and bcrypt.check_password_hash(user.hash_pass, password):
        # 認証OK
        pass
    else:
        user = Teacher.query.filter_by(id=id).first()
        # 教員に一致するIDが存在するかとパスワード確認
        if user and bcrypt.check_password_hash(user.hash_pass, password):
            # 認証OK
            role = "teacher"
        else:
            # 認証失敗
            return jsonify({'result': 'false'}), 401

    claims = {"role": role}
    # アクセストークン作成
    access  = create_access_token(identity=id, additional_claims=claims)
    # リフレッシュトークン作成
    refresh = create_refresh_token(identity=id, additional_claims=claims)
    return jsonify({'result': 'success', "access": access, "refresh": refresh, "role": role}), 200

# トークンの再発行
@auth.route('/refresh', methods=['POST', 'OPTIONS'])
@jwt_required(refresh=True)
def refresh():
    if request.method == 'OPTIONS':
        return '', 200
    # いま使った refresh の jti を取得
    old_jti = get_jwt()["jti"]
    print(old_jti)
    # 以降この refresh は無効扱い
    REVOKED.add(old_jti)

    identity = get_jwt_identity()  # 例: "U0001"
    # 追加クレーム（role）を引き継ぐ。get_jwt() は現在のトークン（refresh）のペイロード。
    claims = {"role": get_jwt().get("role")}

    # 新しい access（短命）と refresh（長命）を同時に発行
    new_access  = create_access_token(identity=identity, additional_claims=claims)
    new_refresh = create_refresh_token(identity=identity, additional_claims=claims)

    return jsonify({"access": new_access, "refresh": new_refresh}), 200

# ログアウト
@auth.route('/logout', methods=['POST', 'OPTIONS'])
@jwt_required(refresh=True)
def logout():
    if request.method == 'OPTIONS':
        return '', 200
    REVOKED.add(get_jwt()["jti"])
    return '', 200

# idとroleの取得
@auth.get("/me")
@jwt_required()
def me():
    # 誰のトークンか（identity）と、追加クレーム（role）にアクセス
    return jsonify({"user_id": get_jwt_identity(), "role": get_jwt().get("role")})

@auth.route('/create_dummy_student')
def create_dummy_student():
    # 仮アカウント情報
    id = "test3"
    password = "pass"
    name = "テスト生徒"
    # パスワードをハッシュ化
    hash_pass = bcrypt.generate_password_hash(password).decode('utf-8')
    # Studentモデルのインスタンス作成
    student = Student(id=id, name=name, hash_pass=hash_pass)
    db.session.add(student)
    db.session.commit()
    return '', 200