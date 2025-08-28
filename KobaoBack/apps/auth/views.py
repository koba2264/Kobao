from flask import Blueprint, jsonify, request
from apps.app import db,jwt,bcrypt
from apps.models import Student, Teacher
from flask_jwt_extended import (
    create_access_token, create_refresh_token,
    jwt_required, get_jwt, get_jwt_identity
)
from datetime import datetime, timedelta,timezone
from flask_bcrypt import Bcrypt

auth = Blueprint(
    "auth",
    __name__
)

# 一時的にブラックリストを作成、後で変更する
REVOKED = set()

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
    
    change_pass_jugde = "no_change"
    # 生徒と教師の判別用
    role = "student"
    # 生徒の認証
    user = Student.query.filter_by(id=id).first()

    # 生徒が存在しない場合は教師を確認
    if not user:
        user = Teacher.query.filter_by(id=id).first()
        # 教師が存在する場合はroleをteacherに変更
        if user:
            role  = "teacher"
        # ユーザーが存在しない場合はエラーを返す
        else:
            # 認証失敗
            return jsonify({'result': 'false'}), 401
        
    
    if not user.check_password(password):
        return jsonify({'result': 'false'}), 401
    
    change_pass = bool(user.change_pass)
    now = datetime.now(timezone.utc)
    last_update = user.update_at
    if change_pass or now - last_update > timedelta(days=30):
        change_pass_jugde = "change"
        
    # ユーザーが存在する場合はトークンを作成
    claims = {"role": role}
    # アクセストークン作成
    access  = create_access_token(identity=id, additional_claims=claims)
    # リフレッシュトークン作成
    refresh = create_refresh_token(identity=id, additional_claims=claims)

    return jsonify({'result': 'success', "access": access, "refresh": refresh, "role": role,"change_pass_judge":change_pass_jugde}), 200

# トークンの再発行
@auth.route('/refresh', methods=['POST', 'OPTIONS'])
@jwt_required(refresh=True)
def refresh():
    if request.method == 'OPTIONS':
        return '', 200
    # いま使った refresh の jti を取得
    print('options')
    old_jti = get_jwt()["jti"]
    # print(old_jti)
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
    if request.method == 'OPTIONS':
        return '', 200
    # 誰のトークンか（identity）と、追加クレーム（role）にアクセス
    return jsonify({"user_id": get_jwt_identity(), "role": get_jwt().get("role")})

@auth.route('/admin', methods=['POST'])
@jwt_required(refresh=True)  # refreshトークンで認証
def admin():
    teacher = Teacher.query.filter_by(id=get_jwt_identity()).first()
    is_admin = bool(teacher.admin)
    if not teacher:
        return jsonify({"admin": False}), 404
    return jsonify({"admin": is_admin})

@auth.route('/change_pass_teacher',methods=["POST"])
def change_pass_teacher():
  data = request.get_json()
  teacher_id = data.get('teacher_id')
  password = data.get('password')
  teacher = Teacher.query.filter_by(id=teacher_id).first()
  teacher.set_password(password)
  teacher.change_pass = False
  teacher.update_at = datetime.now(timezone.utc)
  db.session.commit()
  # 辞書型で返す
  return jsonify({'result': 'いいね！'})

@auth.route('/change_pass_student',methods=["POST"])
def change_pass_student():
  data = request.get_json()
  student_id = data.get('student_id')
  password = data.get('password')
  student = Student.query.filter_by(id=student_id).first()
  student.set_password(password)
  student.change_pass = False
  student.update_at = datetime.now(timezone.utc)
  db.session.commit()
  # 辞書型で返す
  return jsonify({'result': 'いいね！'})

