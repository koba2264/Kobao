from flask import Blueprint, jsonify, request
from sqlalchemy import text as sql_text
from apps.app import db
teacher = Blueprint(
  "teacher",
  __name__,
  static_folder="static"
)

# データベースからタグを取ってくる
@teacher.route('/select_tag',methods=["GET"])
def select_tag():
  # SQL文
  sql = sql_text("SELECT * FROM Tag")
  # SQL実行
  result = db.session.execute(sql)
  # 結果を取得
  rows = result.mappings().all()
  for row in rows:
    print(row)
  return {"tag":[dict(row) for row in rows]}

@teacher.route('/insert_tag',methods=["POST"])
def insert_tag():
  data = request.get_json()
  tab_name = data.get('tag_name')
  # SQL文
  sql = sql_text("INSERT INTO tag(tab_name) VALUES(:tab_name)")
  # SQL実行
  db.session.execute(sql,{"tab_name":tab_name})
  db.session.commit()
  # 辞書型で返す
  return jsonify({'result': 'いいね！'})

@teacher.route('/select_question',methods=["GET"])
def select_question():
  # SQL文
  sql = sql_text("SELECT * FROM questions")
  # SQL実行
  result = db.session.execute(sql)
  # 結果を取得
  rows = result.mappings().all()
  for row in rows:
    print(row)
  return {"question":[dict(row) for row in rows]}

@teacher.route('/select_question_tag',methods=["GET"])
def select_question_tag():
  # SQL文
  sql = sql_text("SELECT ROW_NUMBER() OVER (ORDER BY questions.content) AS id,questions.content,tag.tab_name FROM questions INNER JOIN student on questions.stu_id = student.id INNER JOIN stutag on student.id = stutag.stu_id INNER JOIN tag on stutag.tag_id = tag.id")
  # SQL実行
  result = db.session.execute(sql)
  # 結果を取得
  rows = result.mappings().all()
  for row in rows:
    print(row)
  return {"question_tag":[dict(row) for row in rows]}