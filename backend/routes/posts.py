from flask import Blueprint, request, jsonify
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
def create_post():
    data = request.get_json(silent = True) or {}
    title = data.get('title')
    content = data.get('content')
    user_id = data.get('user_id')
    image_url = data.get('image_url')

    if not title or not content or not user_id:
        return jsonify({
            'error': 'Title, content, and user_id are required'
        }), 400

    try:
        post = PostService.create(title, content, user_id, image_url = image_url)

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
def update_post(post_id):
    data = request.get_json(silent = True) or {}
    title = data.get('title')
    content = data.get('content')
    image_url = data.get('image_url')

    if not title and not content and image_url is None:
        return jsonify({
            'error': 'At least one field (title, content, or image_url) is required to update'
        }), 400

    post = PostService.update(post_id, title = title, content = content, image_url = image_url)

    if not post:
        return jsonify({
            'error': 'Post not found'
        }), 404

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
def delete_post(post_id):
    deleted = PostService.delete(post_id)

    if not deleted:
        return jsonify({
            'error': 'Post not found'
        }), 404

    return jsonify({
        'message': 'Post deleted successfully'
    }), 200
