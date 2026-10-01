from models import db, Comment, Post

class CommentService:
    @staticmethod
    def get_by_post(post_id):
        post = Post.query.get(post_id)

        if not post:
            return None

        return Comment.query.filter_by(post_id = post_id).all()

    @staticmethod
    def create(post_id, content):
        post = Post.query.get(post_id)

        if not post:
            raise ValueError('Post not found')

        comment = Comment(content = content, post_id = post_id)
        db.session.add(comment)
        db.session.commit()

        return comment

    @staticmethod
    def delete(comment_id):
        comment = Comment.query.get(comment_id)

        if not comment:
            return False

        db.session.delete(comment)
        db.session.commit()

        return True
