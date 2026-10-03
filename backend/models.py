from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id          = db.Column(db.Integer, primary_key = True)
    username    = db.Column(db.String(80), unique = True, nullable = False)
    password    = db.Column(db.String(80), nullable = False)
    posts       = db.relationship('Post', backref = 'author', lazy = True)

class Post(db.Model):
    id          = db.Column(db.Integer, primary_key = True)
    title       = db.Column(db.String(200), nullable = False)
    content     = db.Column(db.Text, nullable = False)
    image_url   = db.Column(db.String(500), nullable = True)
    user_id     = db.Column(db.Integer, db.ForeignKey('user.id'), nullable = False)
    comments    = db.relationship('Comment', backref = 'post', lazy = True)

class Comment(db.Model):
    id          = db.Column(db.Integer, primary_key = True)
    content     = db.Column(db.Text, nullable = False)
    post_id     = db.Column(db.Integer, db.ForeignKey('post.id'), nullable = False)
