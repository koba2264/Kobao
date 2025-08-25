from flask import Blueprint, jsonify, request
from apps.app import db,jwt
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

# token_in_blocklist_loader:
# 受信した JWT の jti（一意ID）が失効リストにあれば拒否
@jwt.token_in_blocklist_loader
def check_if_revoked(jwt_header, jwt_payload):
    return jwt_payload.get("jti") in REVOKED

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
    access  = create_access_token(identity=id, additional_claims=claims)
    # リフレッシュトークンの作成
    refresh = create_refresh_token(identity=id, additional_claims=claims)

    return jsonify({'result': 'success', "access": access, "refresh": refresh, "role": role}), 200

# --- リフレッシュ（ローテーション採用）---
# ・@jwt_required(refresh=True) なので「refreshトークン」でのみ呼べる
# ・古い refresh の jti を失効させてから、新しい refresh を発行（盗難対策）
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

# --- ログアウト ---
# ・@jwt_required(refresh=True) のため、必ず「refreshトークン」を送る
# ・現在の refresh を失効リストに登録 → 以後は使えない
@auth.route('/logout', methods=['POST', 'OPTIONS'])
@jwt_required(refresh=True)
def logout():
    if request.method == 'OPTIONS':
        return '', 200
    REVOKED.add(get_jwt()["jti"])
    return '', 200

# --- 認証が必要なAPI（例）---
# ・@jwt_required() は「accessトークン」で呼ぶ（refreshではNG）
@auth.get("/me")
@jwt_required()
def me():
    # 誰のトークンか（identity）と、追加クレーム（role）にアクセス
    return jsonify({"user_id": get_jwt_identity(), "role": get_jwt().get("role")})