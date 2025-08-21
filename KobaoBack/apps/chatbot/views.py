from flask import Blueprint, jsonify, request
from qdrant_client import QdrantClient, models
from sentence_transformers import SentenceTransformer
from apps.models import Question, Answer, QA

chatbot = Blueprint(
    "chatbot",
    __name__,
    static_folder="static"
)

@chatbot.route('/receive', methods=["POST"])
def receive():
    data = request.get_json()

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

# あとで消すやつ
@chatbot.route('/test')
def setup():
    stu_id = 'test'
    textlist = [
        "この課題の提出期限はいつですか？",
        "この課題の提出方法はどうすればいいですか？",
        "PythonとJavaはどちらが簡単ですか？",
        "PythonとJavaの主な違いは何ですか？",
        "授業で使うソフトのインストール方法を教えてください。",
        "ソフトがインストールできない場合はどうすればいいですか？",
        "レポートに図を入れてもいいですか？",
        "レポートは手書きでも提出できますか？",
        "プログラムがうまく動きません。見てもらえますか？",
        "このプログラムの間違いの原因を教えてもらえますか？",
        "就職活動の相談に乗ってもらえますか？",
        "インターンシップの応募方法を教えてください。",
        "パスワードを忘れた場合はどうすればいいですか？",
        "アカウントを新しく作ることはできますか？",
        "アルゴリズムの基本的な考え方を教えてください。",
        "データ構造とアルゴリズムの違いは何ですか？",
        "SQLの練習問題をもっとやりたいのですが…",
        "SQLの基本文法をまとめてもらえますか？",
        "先生に直接質問できる時間はありますか？",
        "メールで質問してもいいですか？"
    ]

