from flask import Blueprint, jsonify, request
from sqlalchemy import text as sql_text
from apps.app import db
administrator = Blueprint(
  "administrator",
  __name__,
  static_folder="static"
)

@administrator.route('/insert_teacher',methods=["POST"])
def insert_teacher():
  data = request.get_json()
  id = data.get('id')
  teacher_name = data.get('teacher_name')
  hash_pass = data.get('hash_pass')
  # SQL文
  sql = sql_text("INSERT INTO teacher(id,name,hash_pass) VALUES(:id,:name,:hash_pass)")
  # SQL実行
  db.session.execute(sql,{"id":id,"name":teacher_name,"hash_pass":hash_pass})
  db.session.commit()
  # 辞書型で返す
  return jsonify({'result': 'いいね！'})