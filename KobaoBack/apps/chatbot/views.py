from flask import Blueprint, jsonify, request
from apps.models import db,StudentMessage

chatbot = Blueprint(
    "chatbot",
    __name__,
    static_folder="static"
)

@chatbot.route('/receive', methods=["POST"])
def receive():
    data = request.get_json()
    message = data.get('message')
    new_msg = StudentMessage(message=message)
    db.session.add(new_msg)
    db.session.commit()
    print(data.get('message'))
    return jsonify({'result': '保存しました'})

