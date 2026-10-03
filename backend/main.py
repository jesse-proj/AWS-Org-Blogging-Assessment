import os
from dotenv import load_dotenv

from flask import Flask

from models import db
from routes import auth_blueprint, posts_blueprint, comments_blueprint

from pathlib import Path

def create_app():
    load_dotenv()

    base_dir = Path(__file__).resolve().parent
    instance_dir = base_dir / 'instance'
    instance_dir.mkdir(exist_ok = True)

    app = Flask(
        __name__,
        instance_path = str(instance_dir),
        instance_relative_config = True
    )

    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
    app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{(instance_dir / 'MockDB.db').as_posix()}"

    db.init_app(app)

    app.register_blueprint(auth_blueprint,      url_prefix  = '/api/auth')
    app.register_blueprint(posts_blueprint,     url_prefix  = '/api/posts')
    app.register_blueprint(comments_blueprint,  url_prefix  = '/api/comments')

    with app.app_context():
        db.create_all()

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(
        debug = True,
        port  = 5000
    )
