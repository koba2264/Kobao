from flask import Blueprint, jsonify, request
from qdrant_client import QdrantClient, models
from sentence_transformers import SentenceTransformer
chatbot = Blueprint(
    "chatbot",
    __name__,
    static_folder="static"
)

@chatbot.route('/receive', methods=["POST"])
def receive():
    data = request.get_json()
    # message = data.get('message')
    # new_msg = StudentMessage(message=message)
    # db.session.add(new_msg)
    # db.session.commit()
    # print(data.get('message'))

    model = SentenceTransformer('intfloat/multilingual-e5-large')  # ここを好きな日本語対応モデルに

    client = QdrantClient(url="http://localhost:6333")

    text = data.get('message')
    query_vec = model.encode(text)

    res = client.search(collection_name="que", query_vector=query_vec, limit=3)
    result = [
        {
            "id": i + 1,
            "text": res[i].payload["title"]
        }
        for i in range(len(res)) if res[i].score >= 0.9
    ]
    return jsonify(result)
