from flask import Blueprint, jsonify, request

chatbot = Blueprint(
    "chatbot",
    __name__,
    static_folder="static"
)

@chatbot.route('/receive', methods=["POST"])
def receive():
    data = request.get_json()
    print(data.get('message'))
    return jsonify({'result': 'いいね！'})