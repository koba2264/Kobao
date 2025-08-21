from flask import Blueprint, jsonify, request
from apps.models import db,Question,Answer,QA

student = Blueprint(
    "student",
    __name__,
    static_folder="static"
)

@student.route('/receive', methods=["POST"])
def receive():
    data = request.get_json()
    message = data.get('message')
    stu_id = 'S000001'  # 仮の学生ID、実際には認証情報から取得するべき
    new_msg = Question(content=message,stu_id=stu_id, ansed_flag=False, is_read=False)
    db.session.add(new_msg)
    db.session.commit()
    print(data.get('message'))
    return jsonify({'result': '送信しました'})


@student.route('/messages/<string:question_id>', methods=["GET"])
def get_message_detail(question_id):
    question = Question.query.get(question_id)
    if not question:
        return jsonify({"message": "質問が見つかりません"}), 404

    return jsonify({
        "id": str(question.id),
        "content": question.content,
        "asked_at": question.asked_at.strftime("%Y-%m-%dT%H:%M:%S") if question.asked_at else None,
        "answer": None,  # 未回答なので常に None
        "ansed_flag": question.ansed_flag,
        "stu_id": question.stu_id,
        "is_read": question.is_read
    })




@student.route('/messages', methods=["GET"])
def get_messages():
    messages = Question.query.all()
    result = [
        {
            "id": str(msg.id),
            "content": msg.content,
            "asked_at": msg.asked_at.strftime("%Y-%m-%dT%H:%M:%S") if msg.asked_at else None,
            "ansed_flag": msg.ansed_flag,
            "is_read": msg.is_read,
            "stu_id": msg.stu_id
        }
        for msg in messages
    ]
    return jsonify(result)


@student.route('/answer/<string:question_id>', methods=["GET"])
def get_answer(question_id):
    qa = QA.query.filter_by(que_id=question_id).first()
    if not qa:
        return jsonify({"message": "まだ回答が登録されていません"}), 404

    question = Question.query.get(question_id)
    if not question:
        return jsonify({"message": "質問が見つかりません"}), 404

    answer = Answer.query.get(qa.ans_id)
    if not answer:
        return jsonify({"message": "回答が見つかりません"}), 404

    return jsonify({
        "id": str(question.id),
        "content": question.content,
        "asked_at": question.asked_at.strftime("%Y-%m-%dT%H:%M:%S") if question.asked_at else None,
        "answer": answer.content,
        "ansed_flag": True,
        "stu_id": question.stu_id,
        "is_read": question.is_read
    })



@student.route("/is_read/<uuid:question_id>", methods=["PATCH"])
def update_question_is_read(question_id):
    # 該当質問を取得
    question = Question.query.get_or_404(question_id)

    # JSONデータを取得
    data = request.get_json()
    if "is_read" not in data:
        return jsonify({"error": "is_read field is required"}), 400

    # 更新
    question.is_read = bool(data["is_read"])
    db.session.commit()

    return jsonify({
        "message": "is_read updated",
        "id": str(question.id),
        "is_read": question.is_read
    })
