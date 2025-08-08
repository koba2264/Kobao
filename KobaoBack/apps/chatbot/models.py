from apps.app import db

class Test(db.Model):
  __tablename__ = "test"
  id = db.Column(db.Integer,primary_key=True,autoincrement=True)
  text = db.Column(db.String)