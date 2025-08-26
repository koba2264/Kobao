from flask import Blueprint, jsonify, request
from sqlalchemy import text as sql_text
from apps.app import db
from apps.models import Student, Teacher,Answer,AnsTag,Tag
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
  sql = sql_text("SELECT * FROM questions where ansed_flag = false")
  # SQL実行
  result = db.session.execute(sql)
  # 結果を取得
  rows = result.mappings().all()
  return {"question":[dict(row) for row in rows]}

@teacher.route('/select_question_tag', methods=["GET"])
def select_question_tag():
    results = (
        db.session.query(Answer.id.label("answer_id"), Tag.id.label("tag_id"), Tag.tag_name)
        .join(AnsTag, Answer.id == AnsTag.ans_id)
        .join(Tag, AnsTag.tag_id == Tag.id)
        .all()
    )

    answer_dict = {}
    for ans_id, tag_id, tag_name in results:
        if ans_id not in answer_dict:
            answer_dict[ans_id] = []
        answer_dict[ans_id].append({"id": tag_id, "tag": tag_name})

    return {"ans_tag": [{"answer_id": k, "tags": v} for k, v in answer_dict.items()]}



@teacher.route('/insert_teacher',methods=["POST"])
def insert_teacher():
  data = request.get_json()
  teacher_id = data.get('teacher_id')
  teacher_name = data.get('name')
  password = data.get('password')

  if not teacher_id or not password:
    return jsonify({'result': 'false', 'message': 'IDとパスワードは必須です'}), 400

  # ID重複チェック
  if Student.query.get(teacher_id) or Teacher.query.get(teacher_id):
    return jsonify({'result': 'false', 'message': '既に存在するIDです'}), 400

  new_teacher = Teacher(
    id=teacher_id,
    name=teacher_name,
  )
  new_teacher.set_password(password)
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

    # 学生テーブルと教師テーブルで重複チェック
    sql = sql_text("""
        SELECT COUNT(*) AS cnt
        FROM (
            SELECT id FROM student WHERE id = :student_id
            UNION ALL
            SELECT id FROM teacher WHERE id = :student_id
        ) AS sub
    """)
    result = db.session.execute(sql, {"student_id": student_id})
    row = result.fetchone()

    if row[0] > 0:
        return jsonify({'message': '既に存在するIDです', 'result': 'false'})

    # 存在しなければ登録
    sql_insert = sql_text("""
        INSERT INTO student(id, name)
        VALUES(:student_id, :student_name)
    """)
    db.session.execute(sql_insert, {"student_id": student_id, "student_name": student_name})
    db.session.commit()

    return jsonify({'message': '登録完了','result': 'success'})

  

@teacher.route('/answer',methods=["POST"])
def answer():
  data = request.get_json()
  question_id = data.get('question_id')
  answerText = data.get('answerText')
  tagsItems = data.get('tagsItems')
  teacher_id = data.get('teacher_id')
  ans_id = uuid.uuid4();
  print(teacher_id)
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

    sql4 = sql_text("UPDATE qa SET ans_id = :ans_id WHERE que_id = :question_id")
    db.session.execute(sql4,{
      "ans_id":ans_id,
      "question_id":question_id
    })
    
  db.session.commit()
  # 辞書型で返す
  return jsonify({'result': 'いいね！'})

@teacher.route('/change_pass',methods=["POST"])
def change_pass():
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