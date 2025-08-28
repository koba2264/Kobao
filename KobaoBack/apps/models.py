from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid
from apps.app import db, bcrypt

# タグ情報
class Tag(db.Model):
    __tablename__ = 'tag'
    id = db.Column(db.Integer, primary_key=True)
    tag_name = db.Column(db.String(10), nullable=False)

# 生徒情報
class Student(db.Model):
    __tablename__ = 'student'
    id = db.Column(db.String(7), primary_key=True)
    hash_pass = db.Column(db.String(60), nullable=False)
    name = db.Column(db.String(20), nullable=False)
    rej_count = db.Column(db.Integer, nullable=False, default=0)
    create_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    update_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    change_pass = db.Column(db.Boolean, default=False)
    questions = db.relationship('Question', backref='student', cascade='all, delete-orphan')
    tags = db.relationship('Tag', secondary='stutag', backref='students')

    # パスワードのハッシュ化
    def set_password(self, password):
        self.hash_pass = bcrypt.generate_password_hash(password).decode("utf-8")

    # パスワードの確認
    def check_password(self, password):
        return bcrypt.check_password_hash(self.hash_pass, password)


# 教師情報
class Teacher(db.Model):
    __tablename__ = 'teacher'
    id = db.Column(db.String(7), primary_key=True)
    name = db.Column(db.String(20), nullable=False)
    hash_pass = db.Column(db.String(60), nullable=False)
    admin = db.Column(db.Boolean, nullable=False, default=False)
    create_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    update_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    change_pass = db.Column(db.Boolean, nullable=False, default=True)

    answers = db.relationship('Answer', backref='teacher', cascade='all, delete-orphan')

    # パスワードのハッシュ化
    def set_password(self, password):
        self.hash_pass = bcrypt.generate_password_hash(password).decode("utf-8")

    # パスワードの確認
    def check_password(self, password):
        return bcrypt.check_password_hash(self.hash_pass, password)

# 質問情報
class Question(db.Model):
    __tablename__ = 'questions'

    id = db.Column(UUID(as_uuid=True), primary_key=True)
    content = db.Column(db.Text, nullable=False)
    asked_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    ansed_flag = db.Column(db.Boolean, default=False, nullable=False)
    is_read = db.Column(db.Boolean, default=False, nullable=False)
    stu_id = db.Column(db.String(7), db.ForeignKey('student.id', ondelete='CASCADE'), nullable=False)

    qa = db.relationship('QA', backref='question', cascade='all, delete-orphan')

# 回答情報
class Answer(db.Model):
    __tablename__ = 'answer'
    id = db.Column(UUID(as_uuid=True), primary_key=True)
    content = db.Column(db.Text, nullable=False)
    answerd_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    tea_id = db.Column(db.String(7), db.ForeignKey('teacher.id', ondelete='CASCADE'), nullable=False)

    qa = db.relationship('QA', backref='answer', cascade='all, delete-orphan')
    tags = db.relationship('Tag', secondary='anstag', backref='answers')

# 質問と回答の対応表
class QA(db.Model):
    __tablename__ = 'qa'
    que_id = db.Column(UUID(as_uuid=True), db.ForeignKey('questions.id', ondelete='CASCADE'), primary_key=True)
    ans_id = db.Column(UUID(as_uuid=True), db.ForeignKey('answer.id', ondelete='CASCADE'), primary_key=True)

# 学生とタグの対応表
class StuTag(db.Model):
    __tablename__ = 'stutag'
    tag_id = db.Column(db.Integer, db.ForeignKey('tag.id', ondelete='CASCADE'), primary_key=True)
    stu_id = db.Column(db.String(7), db.ForeignKey('student.id', ondelete='CASCADE'), primary_key=True)

# 回答とタグの対応表
class AnsTag(db.Model):
    __tablename__ = 'anstag'
    tag_id = db.Column(db.Integer, db.ForeignKey('tag.id', ondelete='CASCADE'), primary_key=True)
    ans_id = db.Column(UUID(as_uuid=True), db.ForeignKey('answer.id', ondelete='CASCADE'), primary_key=True)