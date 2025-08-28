from flask import Blueprint, jsonify, request
from sqlalchemy import text as sql_text
from apps.app import db
from apps.models import Student, Teacher,Answer,AnsTag,Tag,Question,QA
import uuid
from flask_cors import cross_origin
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
  return {"tag":[dict(row) for row in rows]}

@teacher.route('/insert_tag',methods=["POST"])
def insert_tag():
  data = request.get_json()
  tag_name = data.get('tag_name').strip()
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
  sql = sql_text("SELECT * FROM questions where ansed_flag = false")
  # SQL実行
  result = db.session.execute(sql)
  # 結果を取得
  rows = result.mappings().all()
  return {"question":[dict(row) for row in rows]}

@teacher.route('/select_question_tag', methods=["POST"])
def select_question_tag():
  results = (
    db.session.query(
      Question.id.label("que_id"),
      Question.content.label("question_content"),
      Answer.content.label("answer_content"),
      Tag.tag_name
    )
    .join(QA, QA.que_id == Question.id)
    .join(Answer, QA.ans_id == Answer.id)
    .join(AnsTag, Answer.id == AnsTag.ans_id)
    .join(Tag, AnsTag.tag_id == Tag.id)
  )

  answer_dict = {}
  for que_id,question_content, answer_content, tag_name in results:
    if que_id not in answer_dict:
      answer_dict[que_id] = {
        "question_content": question_content,"answer_content":answer_content, 
        "tags": []
      }
    answer_dict[que_id]["tags"].append(tag_name.strip())
  print(answer_dict)

    # 辞書をリストに変換して返す
  return {
    "ans_tag": [
      {"que_id": k, 
       "question_content": v["question_content"],
       "answer_content": v["answer_content"],
       "tags": v["tags"]}
      for k, v in answer_dict.items()
    ]
  }



@teacher.route('/insert_teacher',methods=["POST"])
def insert_teacher():
  data = request.get_json()
  teacher_id = data.get('teacher_id')
  teacher_name = data.get('name')

  if not teacher_id:
    return jsonify({'result': 'false', 'message': 'IDは必須です'}), 400

  # ID重複チェック
  if Student.query.get(teacher_id) or Teacher.query.get(teacher_id):
    return jsonify({'result': 'false', 'message': '既に存在するIDです'}), 400

  new_teacher = Teacher(
    id=teacher_id,
    name=teacher_name,
  )
  new_teacher.set_password(teacher_id)
  db.session.add(new_teacher)
  db.session.commit()

  return jsonify({'result': 'success', 'message': f'{teacher_name}を登録しました'})

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
  # SQL文
  sql = sql_text("UPDATE teacher set name = :teacher_name WHERE ID = :teacher_id")
  # SQL実行
  db.session.execute(sql,{
    "teacher_name":teacher_name,
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
  print("届いてるよ")
  # SQL文
  sql = sql_text("UPDATE student set name = :student_name WHERE ID = :student_id")
  # SQL実行
  db.session.execute(sql,{
    "student_name":student_name,
    "student_id":student_id,
    })
  db.session.commit()
  # 辞書型で返す
  return jsonify({'result': 'いいね！'})

@teacher.route('/insert_student', methods=["POST"])
def insert_student():
  data = request.get_json()
  student_id = data.get('student_id')
  student_name = data.get('student_name')

  if not student_id:
    return jsonify({'result': 'false', 'message': 'IDは必須です'}), 400

  # ID重複チェック
  if Student.query.get(student_id) or Teacher.query.get(student_id):
    return jsonify({'result': 'false', 'message': '既に存在するIDです'}), 400

  new_student = Student(
    id=student_id,
    name=student_name,
  )
  new_student.set_password(student_id)
  db.session.add(new_student)
  db.session.commit()

  return jsonify({'result': 'success', 'message': f'{student_name}を登録しました'})

  

@teacher.route('/answer',methods=["POST"])
def answer():
  data = request.get_json()
  question_id = data.get('question_id')
  answerText = data.get('answerText')
  tagsItems = data.get('tagsItems')
  teacher_id = data.get('teacher_id')
  ans_id = uuid.uuid4();
  # SQL文
  sql1 = sql_text("INSERT INTO answer(id,content,tea_id) VALUES(:id,:content,:tea_id)")
  # SQL実行
  db.session.execute(sql1,{
    "id":ans_id,
    "content":answerText,
    "tea_id":teacher_id
  })
  
  sql2 = sql_text("INSERT INTO anstag VALUES(:tag_id,:ans_id)")
  for tag in tagsItems:
    print(tag)
    print(type(tag))
    db.session.execute(sql2,{
      "tag_id":tag["id"],
      "ans_id":ans_id
    })

    sql3 = sql_text("UPDATE questions SET ansed_flag = true WHERE id = :question_id")
    db.session.execute(sql3,{
      "question_id":question_id
    })

    sql4 = sql_text("UPDATE qa SET que_id = :question_id ans_id = :ans_id")
    db.session.execute(sql4,{
      "que_id":question_id,
      "ans_id":ans_id
    })
    
  db.session.commit()
  # 辞書型で返す
  return jsonify({'result': 'いいね！'})

@teacher.route('/change_pass_request_teacher',methods=["POST"])
def change_pass_request_teacher():
  data = request.get_json()
  teacher_id = data.get('teacher_id')
  print("届いてるよ")
  # SQL文
  sql = sql_text("UPDATE teacher set change_pass = true WHERE ID = :teacher_id")
  # SQL実行
  db.session.execute(sql,{
    "teacher_id":teacher_id
  })
  db.session.commit()
  # 辞書型で返す
  return jsonify({'result': '成功'})

@teacher.route('/change_pass_request_student',methods=["POST"])
def change_pass_request_student():
  data = request.get_json()
  student_id = data.get('student_id')
  print("届いてるよ")
  # SQL文
  sql = sql_text("UPDATE student set change_pass = true WHERE ID = :student_id")
  # SQL実行
  db.session.execute(sql,{
    "student_id":student_id
  })
  db.session.commit()
  # 辞書型で返す
  return jsonify({'result': '成功'})