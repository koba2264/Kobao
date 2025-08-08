from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class StudentMessage(db.Model):
    __tablename__ = 'student_messages'
    id = db.Column(db.Integer, primary_key=True)
    message = db.Column(db.String(255), nullable=False)

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)