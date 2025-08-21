from flask import Blueprint, jsonify, request
from sqlalchemy import text as sql_text
from apps.app import db
import uuid
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
  tag_name = data.get('tag_name')
  # SQL文
  sql = sql_text("INSERT INTO tag(tag_name) VALUES(:tag_name)")
  # SQL実行
  db.session.execute(sql,{"tag_name":tag_name})
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
  sql = sql_text("SELECT ROW_NUMBER() OVER (ORDER BY questions.content) AS id,questions.content,tag.tag_name FROM questions INNER JOIN student on questions.stu_id = student.id INNER JOIN stutag on student.id = stutag.stu_id INNER JOIN tag on stutag.tag_id = tag.id")
  # SQL実行
  result = db.session.execute(sql)
  # 結果を取得
  rows = result.mappings().all()
  for row in rows:
    print(row)
  return {"question_tag":[dict(row) for row in rows]}

@teacher.route('/insert_teacher',methods=["POST"])
def insert_teacher():
  data = request.get_json()
  id = data.get('teacherId')
  teacher_name = data.get('name')
  hash_pass = data.get('password')
  # SQL文
  sql = sql_text("INSERT INTO teacher(id,name,hash_pass) VALUES(:id,:name,:hash_pass)")
  # SQL実行
  db.session.execute(sql,{"id":id,"name":teacher_name,"hash_pass":hash_pass})
  db.session.commit()
  # 辞書型で返す
  return jsonify({'result': 'いいね！'})

@teacher.route('/select_all_teacher',methods=["GET"])
def select_all_teacher():
  # SQL文
  sql = sql_text("SELECT * FROM teacher")
  # SQL実行
  result = db.session.execute(sql)
  db.session.commit()
  rows = result.mappings().all()
  # 辞書型で返す
  return {"teacher":[dict(row) for row in rows]}

@teacher.route('/delete_teacher',methods=["POST"])
def delete_teacher():
  data = request.get_json()
  teacher_id = data.get('teacher_id')
  print("届いてるよ")
  # SQL文
  sql = sql_text("DELETE FROM teacher WHERE ID = :teacher_id")
  # SQL実行
  db.session.execute(sql,{"teacher_id":teacher_id})
  db.session.commit()
  # 辞書型で返す
  return jsonify({'result': 'いいね！'})

@teacher.route('/edit_teacher',methods=["POST"])
def edit_teacher():
  data = request.get_json()
  teacher_id = data.get('teacher_id')
  teacher_name = data.get('teacher_name')
  password = data.get('password')
  print("届いてるよ")
  # SQL文
  sql = sql_text("UPDATE teacher set name = :teacher_name,hash_pass = :password WHERE ID = :teacher_id")
  # SQL実行
  db.session.execute(sql,{
    "teacher_name":teacher_name,
    "password":password,
    "teacher_id":teacher_id,
    })
  db.session.commit()
  # 辞書型で返す
  return jsonify({'result': 'いいね！'})

@teacher.route('/select_all_student',methods=["GET"])
def select_all_student():
  # SQL文
  sql = sql_text("SELECT * FROM student")
  # SQL実行
  result = db.session.execute(sql)
  db.session.commit()
  rows = result.mappings().all()
  # 辞書型で返す
  return {"student":[dict(row) for row in rows]}

@teacher.route('/delete_student',methods=["POST"])
def delete_student():
  data = request.get_json()
  student_id = data.get('student_id')
  print("届いてるよ")
  # SQL文
  sql = sql_text("DELETE FROM student WHERE ID = :student_id")
  # SQL実行
  db.session.execute(sql,{"student_id":student_id})
  db.session.commit()
  # 辞書型で返す
  return jsonify({'result': 'いいね！'})

@teacher.route('/edit_student',methods=["POST"])
def edit_student():
  data = request.get_json()
  student_id = data.get('student_id')
  student_name = data.get('student_name')
  password = data.get('password')
  print("届いてるよ")
  # SQL文
  sql = sql_text("UPDATE student set name = :student_name,hash_pass = :password WHERE ID = :student_id")
  # SQL実行
  db.session.execute(sql,{
    "student_name":student_name,
    "password":password,
    "student_id":student_id,
    })
  db.session.commit()
  # 辞書型で返す
  return jsonify({'result': 'いいね！'})

@teacher.route('/insert_student',methods=["POST"])
def insert_student():
  data = request.get_json()
  student_id = data.get('student_id')
  student_name = data.get('student_name')
  hash_pass = data.get('password')
  # SQL文
  sql = sql_text("INSERT INTO student(id,name,hash_pass) VALUES(:student_id,:student_name,:hash_pass)")
  # SQL実行
  db.session.execute(sql,{"student_id":student_id,"student_name":student_name,"hash_pass":hash_pass})
  db.session.commit()
  # 辞書型で返す
  return jsonify({'result': 'いいね！'})

@teacher.route('/answer',methods=["POST"])
def answer():
  data = request.get_json()
  answerText = data.get('answerText')
  tagsItems = data.get('tagsItems')
  ans_id = uuid.uuid4();
  print(tagsItems)
  print(type(tagsItems))
  # SQL文
  sql1 = sql_text("INSERT INTO answer(id,content,tea_id) VALUES(:id,:content,:tea_id)")
  # SQL実行
  db.session.execute(sql1,{
    "id":ans_id,
    "content":answerText,
    "tea_id":'test2'
  })
  
  sql2 = sql_text("INSERT INTO anstag VALUES(:tag_id,:ans_id)")
  for tag in tagsItems:
    print(tag)
    print(type(tag))
    db.session.execute(sql2,{
      "tag_id":tag["id"],
      "ans_id":ans_id
    })
    
  db.session.commit()
  # 辞書型で返す
  return jsonify({'result': 'いいね！'})