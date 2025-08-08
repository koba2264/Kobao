from flask import Blueprint, jsonify, request
from apps.models import db,StudentMessage

student = Blueprint(
    "student",
    __name__,
    static_folder="static"
)

@student.route('/receive', methods=["POST"])
def receive():
    data = request.get_json()
    message = data.get('message')
    new_msg = StudentMessage(message=message)
    db.session.add(new_msg)
    db.session.commit()
    print(data.get('message'))
    return jsonify({'result': '送信しました'})


@student.route('/messages', methods=["GET"])
def get_messages():
    messages = StudentMessage.query.all()
    result = [
        {"id": msg.id, "message": msg.message}
        for msg in messages
    ]
    return jsonify(result)