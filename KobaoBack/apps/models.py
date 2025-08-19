from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid
from apps.app import db

class Tag(db.Model):
    __tablename__ = 'tag'
    id = db.Column(db.Integer, primary_key=True)
    tab_name = db.Column(db.String(10), nullable=False)


class Student(db.Model):
    __tablename__ = 'student'
    id = db.Column(db.String(7), primary_key=True)
    hash_pass = db.Column(db.String(60), nullable=False)
    name = db.Column(db.String(20), nullable=False)
    rej_count = db.Column(db.Integer, nullable=False, default=0)
    create_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    update_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    questions = db.relationship('Question', backref='student', cascade='all, delete-orphan')
    tags = db.relationship('Tag', secondary='stutag', backref='students')


class Teacher(db.Model):
    __tablename__ = 'teacher'
    id = db.Column(db.String(7), primary_key=True)
    name = db.Column(db.String(20), nullable=False)
    hash_pass = db.Column(db.String(60), nullable=False)
    admin = db.Column(db.Boolean, nullable=False, default=False)


class Question(db.Model):
    __tablename__ = 'questions'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    content = db.Column(db.Text, nullable=False)
    asked_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    ansed_flag = db.Column(db.Boolean, default=False, nullable=False)
    is_read = db.Column(db.Boolean, default=False, nullable=False)
    stu_id = db.Column(db.String(7), db.ForeignKey('student.id', ondelete='CASCADE'), nullable=False)

    qa = db.relationship('QA', backref='question', cascade='all, delete-orphan')


class Answer(db.Model):
    __tablename__ = 'answer'
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    content = db.Column(db.Text, nullable=False)
    answerd_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    qa = db.relationship('QA', backref='answer', cascade='all, delete-orphan')
    tags = db.relationship('Tag', secondary='anstag', backref='answers')


class QA(db.Model):
    __tablename__ = 'qa'
    que_id = db.Column(UUID(as_uuid=True), db.ForeignKey('questions.id', ondelete='CASCADE'), primary_key=True)
    ans_id = db.Column(UUID(as_uuid=True), db.ForeignKey('answer.id', ondelete='CASCADE'), primary_key=True)


class StuTag(db.Model):
    __tablename__ = 'stutag'
    tag_id = db.Column(db.Integer, db.ForeignKey('tag.id', ondelete='CASCADE'), primary_key=True)
    stu_id = db.Column(db.String(7), db.ForeignKey('student.id', ondelete='CASCADE'), primary_key=True)


class AnsTag(db.Model):
    __tablename__ = 'anstag'
    tag_id = db.Column(db.Integer, db.ForeignKey('tag.id', ondelete='CASCADE'), primary_key=True)
    ans_id = db.Column(UUID(as_uuid=True), db.ForeignKey('answer.id', ondelete='CASCADE'), primary_key=True)