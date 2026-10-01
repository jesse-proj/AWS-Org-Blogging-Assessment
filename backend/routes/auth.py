from flask import Blueprint, request, jsonify
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

        return jsonify({
            'message': 'User registered successfully',
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

    return jsonify({
        'message': 'Login successful',
        'user': {
            'id': user.id,
            'username': user.username
        }
    }), 200


@auth_blueprint.get('/me')
def get_current_user():
    user_id = request.args.get('user_id', type = int)

    if not user_id:
        return jsonify({
            'error': 'user_id query parameter is required'
        }), 400

    user = AuthService.get_by_id(user_id)

    if not user:
        return jsonify({
            'error': 'User not found'
        }), 404

    return jsonify({
        'user': {
            'id': user.id,
            'username': user.username
        }
    }), 200
