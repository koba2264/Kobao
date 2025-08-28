from flask import Blueprint, jsonify, request
from sqlalchemy import text as sql_text
from apps.app import db
from apps.models import Student, Teacher, Answer, AnsTag, Tag,QA, Question
import uuid
from flask_cors import cross_origin

teacher = Blueprint(
    "teacher",
    __name__,
    static_folder="static"
)

# -------------------------
# タグ関連
# -------------------------
@teacher.route('/select_tag', methods=["GET"])
def select_tag():
    sql = sql_text("SELECT * FROM Tag")
    result = db.session.execute(sql)
    rows = result.mappings().all()
    return {"tag": [dict(row) for row in rows]}

@teacher.route('/insert_tag', methods=["POST"])
def insert_tag():
    data = request.get_json()
    tag_name = data.get('tag_name')
    sql = sql_text("INSERT INTO tag(tag_name) VALUES(:tag_name)")
    db.session.execute(sql, {"tag_name": tag_name})
    db.session.commit()
    return jsonify({'result': 'いいね！'})


# -------------------------
# 質問関連
# -------------------------
@teacher.route('/select_question', methods=["GET"])
def select_question():
    sql = sql_text("SELECT * FROM questions WHERE ansed_flag = false")
    result = db.session.execute(sql)
    rows = result.mappings().all()
    return {"question": [dict(row) for row in rows]}

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
    .all()
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

# -------------------------
# 教師関連
# -------------------------
@teacher.route('/insert_teacher', methods=["POST"])
def insert_teacher():
    data = request.get_json()
    teacher_id = data.get('teacher_id')
    teacher_name = data.get('name')
    password = data.get('password')

    if not teacher_id or not password:
        return jsonify({'result': 'false', 'message': 'IDとパスワードは必須です'}), 400

    if Student.query.get(teacher_id) or Teacher.query.get(teacher_id):
        return jsonify({'result': 'false', 'message': '既に存在するIDです'}), 400

    new_teacher = Teacher(id=teacher_id, name=teacher_name)
    new_teacher.set_password(password)
    db.session.add(new_teacher)
    db.session.commit()

    return jsonify({'result': 'success', 'message': f'{teacher_name}を登録しました'})

@teacher.route('/select_all_teacher', methods=["GET"])
def select_all_teacher():
    sql = sql_text("SELECT * FROM teacher")
    result = db.session.execute(sql)
    rows = result.mappings().all()
    return {"teacher": [dict(row) for row in rows]}

@teacher.route('/delete_teacher', methods=["POST"])
def delete_teacher():
    data = request.get_json()
    teacher_id = data.get('teacher_id')
    sql = sql_text("DELETE FROM teacher WHERE ID = :teacher_id")
    db.session.execute(sql, {"teacher_id": teacher_id})
    db.session.commit()
    return jsonify({'result': 'いいね！'})

@teacher.route('/edit_teacher', methods=["POST"])
def edit_teacher():
    data = request.get_json()
    teacher_id = data.get('teacher_id')
    teacher_name = data.get('teacher_name')
    sql = sql_text("UPDATE teacher SET name = :teacher_name WHERE ID = :teacher_id")
    db.session.execute(sql, {"teacher_name": teacher_name, "teacher_id": teacher_id})
    db.session.commit()
    return jsonify({'result': 'いいね！'})

@teacher.route('/change_pass', methods=["POST"])
def change_pass():
    data = request.get_json()
    teacher_id = data.get('teacher_id')
    sql = sql_text("UPDATE teacher SET change_pass = true WHERE ID = :teacher_id")
    db.session.execute(sql, {"teacher_id": teacher_id})
    db.session.commit()
    return jsonify({'result': '成功'})

# -------------------------
# 学生関連
# -------------------------
@teacher.route('/select_all_student', methods=["GET"])
def select_all_student():
    sql = sql_text("SELECT * FROM student")
    result = db.session.execute(sql)
    rows = result.mappings().all()
    return {"student": [dict(row) for row in rows]}

@teacher.route('/delete_student', methods=["POST"])
def delete_student():
    data = request.get_json()
    student_id = data.get('student_id')
    sql = sql_text("DELETE FROM student WHERE ID = :student_id")
    db.session.execute(sql, {"student_id": student_id})
    db.session.commit()
    return jsonify({'result': 'いいね！'})

@teacher.route('/edit_student', methods=["POST"])
def edit_student():
    data = request.get_json()
    student_id = data.get('student_id')
    student_name = data.get('student_name')
    sql = sql_text("UPDATE student SET name = :student_name WHERE ID = :student_id")
    db.session.execute(sql, {"student_name": student_name, "student_id": student_id})
    db.session.commit()
    return jsonify({'result': 'いいね！'})

@teacher.route('/insert_student', methods=["POST"])
def insert_student():
    data = request.get_json()
    student_id = data.get('student_id')
    student_pass = data.get('student_id')
    student_name = data.get('student_name')

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

    student = Student(id=student_id, name=student_name)
    student.set_password(student_pass)
    db.session.add(student)
    db.session.commit()
    return jsonify({'message': '登録完了', 'result': 'success'})

# -------------------------
# 回答関連
# -------------------------
@teacher.route('/answer', methods=["POST"])
def answer():
    data = request.get_json()
    question_id = data.get('question_id')
    answerText = data.get('answerText')
    tagsItems = data.get('tagsItems')  # [{id, tag}]
    teacher_id = data.get('teacher_id')
    ans_id = str(uuid.uuid4())

    # Answer登録
    sql1 = sql_text("INSERT INTO answer(id, content, tea_id) VALUES(:id, :content, :tea_id)")
    db.session.execute(sql1, {"id": ans_id, "content": answerText, "tea_id": teacher_id})

    # AnsTag登録
    sql2 = sql_text("INSERT INTO anstag(tag_id, ans_id) VALUES(:tag_id, :ans_id)")
    for tag in tagsItems:
        db.session.execute(sql2, {"tag_id": tag["id"], "ans_id": ans_id})

    # questionsテーブル更新
    sql3 = sql_text("UPDATE questions SET ansed_flag = true WHERE id = :question_id")
    db.session.execute(sql3, {"question_id": question_id})

    # qaテーブル更新（存在しなければINSERT）
    sql4 = sql_text("""
        INSERT INTO qa(que_id, ans_id)
        VALUES(:question_id, :ans_id)
    """)
    db.session.execute(sql4, {"question_id": question_id, "ans_id": ans_id})

    db.session.commit()
    return jsonify({'result': 'いいね！'})