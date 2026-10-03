from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, current_user
from services import AuthService

auth_blueprint = Blueprint('auth', __name__)

@auth_blueprint.post('/register')
def register():
    data = request.get_json(silent = True) or {}
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({
            'error': 'Username and password are required'
        }), 400

    try:
        user = AuthService.register(username, password)
        access_token = create_access_token(identity=str(user.id), additional_claims={'username': user.username})

        return jsonify({
            'message': 'User registered successfully',
            'access_token': access_token,
            'user': {
                'id': user.id,
                'username': user.username
            }
        }), 201

    except ValueError as err:
        return jsonify({
            'error': str(err)
        }), 409


@auth_blueprint.post('/login')
def login():
    data = request.get_json(silent = True) or {}
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({
            'error': 'Username and password are required'
        }), 400

    user = AuthService.login(username, password)

    if not user:
        return jsonify({
            'error': 'Invalid username or password'
        }), 401

    access_token = create_access_token(identity=str(user.id), additional_claims={'username': user.username})

    return jsonify({
        'message': 'Login successful',
        'access_token': access_token,
        'user': {
            'id': user.id,
            'username': user.username
        }
    }), 200


@auth_blueprint.get('/me')
@jwt_required()
def get_current_user():
    return jsonify({
        'user': {
            'id': current_user.id,
            'username': current_user.username
        }
    }), 200
