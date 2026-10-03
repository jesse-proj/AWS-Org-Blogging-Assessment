from models import db, Post, User

class PostService:
    @staticmethod
    def get_all():
        return Post.query.all()

    @staticmethod
    def get_by_id(post_id):
        return db.session.get(Post, post_id)

    @staticmethod
    def create(title, content, user_id, image_url = None):
        user = db.session.get(User, user_id)

        if not user:
            raise ValueError('User not found')

        post = Post(title = title, content = content, user_id = user_id, image_url = image_url)
        db.session.add(post)
        db.session.commit()

        return post

    @staticmethod
    def update(post_id, title = None, content = None, image_url = None):
        post = db.session.get(Post, post_id)

        if not post:
            return None

        if title is not None:
            post.title = title

        if content is not None:
            post.content = content

        if image_url is not None:
            post.image_url = image_url

        db.session.commit()

        return post

    @staticmethod
    def delete(post_id):
        post = db.session.get(Post, post_id)

        if not post:
            return False

        db.session.delete(post)
        db.session.commit()

        return True
