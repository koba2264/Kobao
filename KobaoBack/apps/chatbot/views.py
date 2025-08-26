from flask import Blueprint, jsonify, request
from qdrant_client import QdrantClient
from sentence_transformers import SentenceTransformer
from apps.models import Question, Answer, QA, Teacher, Student
from apps.app import db
import re
from qdrant_client.models import Distance, VectorParams,PointStruct

chatbot = Blueprint(
    "chatbot",
    __name__,
    static_folder="static"
)

# qdrantのクライアント作成
client = QdrantClient(url="http://localhost:6333")
# ベクトル化用の日本語対応のモデル
model = SentenceTransformer('intfloat/multilingual-e5-large')

# テキストを受け取り候補を3つ返す
@chatbot.route('/receive', methods=["POST"])
def receive():
    data = request.get_json()

    text = data.get('message')
    query_vec = model.encode(text)

    res = client.search(collection_name="que", query_vector=query_vec, limit=3)
    result = []
    for i in range(len(res)):
        if res[i].score >= 0.9:
            ans = Answer.query.filter_by(id=res[i].payload["ans_id"]).first()
            que = Question.query.filter_by(id=res[i].payload["que_id"]).first()
            result.append(
                {
                    "ans_id": res[i].payload["ans_id"],
                    "que_text": que.content,
                    "ans_text": ans.content
                }
            )
    return jsonify(result)

# テキストの前処理
def preprocess(text: str) -> str:
    # 小文字化
    text = text.lower()
    # 半角変換
    text = re.sub(r'[！-～]', lambda x: chr(ord(x.group(0)) - 0xFEE0), text)
    # 記号除去（日本語・英数字のみ残す）
    text = re.sub(r'[^\w\sぁ-んァ-ン一-龥]', '', text)
    # 空白正規化
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

@chatbot.route('/setup')
def setup():
    student = Student(id='test3', name='学生')
    student.set_password('pass')
    teacher = Teacher(id='test4', name='教員')
    teacher.set_password('pass')
    db.session.add(student)
    db.session.add(teacher)
    db.session.commit()
    client.recreate_collection(
        collection_name="Questions",
        vectors_config=VectorParams(size=1024, distance=Distance.COSINE),
        on_disk_payload=True,
    )

    rows = (
        db.session.query(Question, QA)
        .join(QA, QA.que_id == Question.id)
        .all()
    )
    for q, qa in rows:
        vec = model.encode(q.content)
        points = [
            PointStruct(
                id=str(qa.que_id),
                vector=vec,
                payload={
                    "que_id": str(qa.que_id),
                    "ans_id": str(qa.ans_id),
                },
            ),
        ]
        client.upsert(collection_name="Questions", points=points)
    print('success')
    return '', 200

# chatbotでの推測の候補を追加
@chatbot.route('/add', methods=["POST"])
def add():
    data = request.get_json()
    que_id = data.get('que_id')
    ans_id = data.get('ans_id')

    q = Question.query.filter_by(id=que_id).first()
    vec = model.encode(q.content)
    points = [
        PointStruct(
            id=que_id,
            vector=vec,
            payload={
                "que_id": que_id,
                "ans_id": ans_id,
            },
        ),
    ]
    client.upsert(collection_name="Questions", points=points)
    return '', 200

