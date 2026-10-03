import os
import sys
from datetime import timedelta
from pathlib import Path
from dotenv import load_dotenv

backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from models import db, User
from routes import auth_blueprint, posts_blueprint, comments_blueprint

def create_app(test_config=None):
    base_dir = Path(__file__).resolve().parent
    load_dotenv(base_dir / '.env')

    instance_dir = base_dir / 'instance'
    instance_dir.mkdir(exist_ok = True)

    app = Flask(
        __name__,
        instance_path = str(instance_dir),
        instance_relative_config = True
    )

    CORS(app)

    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY') or app.config['SECRET_KEY']
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=int(os.getenv('JWT_EXPIRATION_HOURS', '24')))
    app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{(instance_dir / 'MockDB.db').as_posix()}"

    if test_config:
        app.config.update(test_config)

    db.init_app(app)

    jwt = JWTManager(app)

    @jwt.user_lookup_loader
    def user_lookup_callback(_jwt_header, jwt_data):
        identity = jwt_data.get('sub')
        if identity is None:
            return None
        try:
            return db.session.get(User, int(identity))
        except (ValueError, TypeError):
            return None

    @jwt.user_lookup_error_loader
    def user_lookup_error_callback(_jwt_header, jwt_data):
        return {'error': 'User not found or session invalid.'}, 401

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return {'error': 'Token has expired. Please log in again.'}, 401

    @jwt.invalid_token_loader
    def invalid_token_callback(error_string):
        return {'error': f'Invalid token: {error_string}'}, 401

    @jwt.unauthorized_loader
    def missing_token_callback(error_string):
        return {'error': 'Authorization token is missing.'}, 401

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
