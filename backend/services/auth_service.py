from werkzeug.security import generate_password_hash, check_password_hash

from models import db
from models import User

class AuthService:
    @staticmethod
    def register(username, password):
        if User.query.filter_by(username=username).first():
            raise ValueError("Username is already taken")

        hashed_password = generate_password_hash(password)

        user = User(username=username, password=hashed_password)
        db.session.add(user)
        db.session.commit()

        return user

    @staticmethod
    def login(username, password):
        user = User.query.filter_by(username=username).first()

        if not user or not check_password_hash(user.password, password):
            return None

        return user

    @staticmethod
    def get_by_id(user_id):
        return db.session.get(User, user_id)
