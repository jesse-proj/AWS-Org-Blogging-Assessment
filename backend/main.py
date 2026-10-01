import os
import sys
from flask import Flask
from dotenv import load_dotenv

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from models import db
from routes import auth_blueprint, posts_blueprint, comments_blueprint


def create_app():
    load_dotenv()

    app = Flask(__name__)
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///MockDB.db'

    db.init_app(app)

    app.register_blueprint(auth_blueprint, url_prefix='/api/auth')
    app.register_blueprint(posts_blueprint, url_prefix='/api/posts')
    app.register_blueprint(comments_blueprint, url_prefix='/api/comments')

    with app.app_context():
        db.create_all()

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(
        debug = True,
        port  = 5000
    )
