from flask import Blueprint, jsonify, request
from apps.models import db,Question

student = Blueprint(
    "student",
    __name__,
    static_folder="static"
)

@student.route('/receive', methods=["POST"])
def receive():
    data = request.get_json()
    message = data.get('message')
    new_msg = Question(message=message)
    db.session.add(new_msg)
    db.session.commit()
    print(data.get('message'))
    return jsonify({'result': '送信しました'})



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
