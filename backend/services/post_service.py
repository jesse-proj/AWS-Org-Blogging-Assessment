from models import db, Post, User


class PostService:
    @staticmethod
    def get_all():
        return Post.query.all()

    @staticmethod
    def get_by_id(post_id):
        return Post.query.get(post_id)

    @staticmethod
    def create(title, content, user_id):
        user = User.query.get(user_id)

        if not user:
            raise ValueError('User not found')

        post = Post(title = title, content = content, user_id = user_id)
        db.session.add(post)
        db.session.commit()

        return post

    @staticmethod
    def update(post_id, title = None, content = None):
        post = Post.query.get(post_id)

        if not post:
            return None

        if title is not None:
            post.title = title

        if content is not None:
            post.content = content

        db.session.commit()

        return post

    @staticmethod
    def delete(post_id):
        post = Post.query.get(post_id)

        if not post:
            return False

        db.session.delete(post)
        db.session.commit()

        return True
