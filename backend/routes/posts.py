from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, current_user
from services import PostService

posts_blueprint = Blueprint('posts', __name__)

@posts_blueprint.get('')
def list_posts():
    posts = PostService.get_all()

    return jsonify({
        'posts': [
            {
                'id': p.id,
                'title': p.title,
                'content': p.content,
                'image_url': p.image_url,
                'user_id': p.user_id
            }
            for p in posts
        ]
    }), 200


@posts_blueprint.post('/create')
@jwt_required()
def create_post():
    data = request.get_json(silent = True) or {}
    title = data.get('title')
    content = data.get('content')
    image_url = data.get('image_url')

    if not title or not content:
        return jsonify({
            'error': 'Title and content are required'
        }), 400

    try:
        post = PostService.create(title, content, current_user.id, image_url = image_url)

        return jsonify({
            'message': 'Post created successfully',
            'post': {
                'id': post.id,
                'title': post.title,
                'content': post.content,
                'image_url': post.image_url,
                'user_id': post.user_id
            }
        }), 201

    except ValueError as err:
        return jsonify({
            'error': str(err)
        }), 404


@posts_blueprint.get('/<int:post_id>')
def get_post(post_id):
    post = PostService.get_by_id(post_id)

    if not post:
        return jsonify({
            'error': 'Post not found'
        }), 404

    return jsonify({
        'post': {
            'id': post.id,
            'title': post.title,
            'content': post.content,
            'image_url': post.image_url,
            'user_id': post.user_id,
            'author': post.author.username if post.author else None
        }
    }), 200


@posts_blueprint.route('/<int:post_id>', methods = ['PUT', 'PATCH'])
@jwt_required()
def update_post(post_id):
    data = request.get_json(silent = True) or {}
    title = data.get('title')
    content = data.get('content')
    image_url = data.get('image_url')

    if not title and not content and image_url is None:
        return jsonify({
            'error': 'At least one field (title, content, or image_url) is required to update'
        }), 400

    post = PostService.get_by_id(post_id)

    if not post:
        return jsonify({
            'error': 'Post not found'
        }), 404

    if post.user_id != current_user.id:
        return jsonify({
            'error': 'Forbidden: You can only edit your own posts'
        }), 403

    post = PostService.update(post_id, title = title, content = content, image_url = image_url)

    return jsonify({
        'message': 'Post updated successfully',
        'post': {
            'id': post.id,
            'title': post.title,
            'content': post.content,
            'image_url': post.image_url,
            'user_id': post.user_id
        }
    }), 200


@posts_blueprint.delete('/<int:post_id>')
@jwt_required()
def delete_post(post_id):
    post = PostService.get_by_id(post_id)

    if not post:
        return jsonify({
            'error': 'Post not found'
        }), 404

    if post.user_id != current_user.id:
        return jsonify({
            'error': 'Forbidden: You can only delete your own posts'
        }), 403

    PostService.delete(post_id)

    return jsonify({
        'message': 'Post deleted successfully'
    }), 200

