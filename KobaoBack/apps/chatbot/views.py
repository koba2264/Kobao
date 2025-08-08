from flask import Blueprint, jsonify, request
from apps.chatbot.models import Test
from apps.app import db
chatbot = Blueprint(
    "chatbot",
    __name__,
    static_folder="static"
)

@chatbot.route('/receive', methods=["POST"])
def receive():
    data = request.get_json()
    new_test=Test(
        text = data.get('message')
    )
    db.session.add(new_test)
    db.session.commit()
    print(data.get('message'))
    return jsonify({'result': 'いいね！'})