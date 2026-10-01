from flask import Blueprint, request, jsonify
from services import CommentService

comments_blueprint = Blueprint('comments', __name__)

@comments_blueprint.get('/posts/<int:post_id>/comments')
def get_comments(post_id):
    comments = CommentService.get_by_post(post_id)

    if comments is None:
        return jsonify({
            'error': 'Post not found'
        }), 404

    return jsonify({
        'comments': [
            {
                'id': c.id,
                'content': c.content,
                'post_id': c.post_id
            }
            for c in comments
        ]
    }), 200


@comments_blueprint.post('/posts/<int:post_id>/comments')
def add_comment(post_id):
    data = request.get_json(silent = True) or {}
    content = data.get('content')

    if not content:
        return jsonify({
            'error': 'Comment content is required'
        }), 400

    try:
        comment = CommentService.create(post_id, content)

        return jsonify({
            'message': 'Comment added successfully',
            'comment': {
                'id': comment.id,
                'content': comment.content,
                'post_id': comment.post_id
            }
        }), 201

    except ValueError as err:
        return jsonify({
            'error': str(err)
        }), 404


@comments_blueprint.delete('/comments/<int:comment_id>')
def delete_comment(comment_id):
    deleted = CommentService.delete(comment_id)

    if not deleted:
        return jsonify({
            'error': 'Comment not found'
        }), 404

    return jsonify({
        'message': 'Comment deleted successfully'
    }), 200
