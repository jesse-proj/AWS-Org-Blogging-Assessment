import unittest
import json
import os
import sys

# Ensure backend root is in Python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import create_app
from models import db, User, Post, Comment
from werkzeug.security import generate_password_hash
from flask_jwt_extended import create_access_token

class AuthTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app({
            'TESTING': True,
            'SQLALCHEMY_DATABASE_URI': 'sqlite:///:memory:'
        })
        self.client = self.app.test_client()

        with self.app.app_context():
            db.create_all()
            # Seed test users
            u1 = User(id=1, username='alice', password=generate_password_hash('password123'))
            u2 = User(id=2, username='bob', password=generate_password_hash('password123'))
            db.session.add(u1)
            db.session.add(u2)
            db.session.commit()

    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()

    def test_login_success_returns_jwt(self):
        res = self.client.post('/api/auth/login', json={
            'username': 'alice',
            'password': 'password123'
        })
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn('access_token', data)
        self.assertEqual(data['user']['username'], 'alice')
        self.assertEqual(data['user']['id'], 1)

    def test_login_invalid_credentials_returns_401(self):
        res = self.client.post('/api/auth/login', json={
            'username': 'alice',
            'password': 'wrongpassword'
        })
        self.assertEqual(res.status_code, 401)
        data = res.get_json()
        self.assertIn('error', data)

    def test_get_me_with_valid_jwt(self):
        # 1. Login
        login_res = self.client.post('/api/auth/login', json={
            'username': 'alice',
            'password': 'password123'
        })
        token = login_res.get_json()['access_token']

        # 2. Call /api/auth/me with Bearer token
        res = self.client.get('/api/auth/me', headers={
            'Authorization': f'Bearer {token}'
        })
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data['user']['username'], 'alice')
        self.assertEqual(data['user']['id'], 1)

    def test_get_me_without_token_returns_401(self):
        res = self.client.get('/api/auth/me')
        self.assertEqual(res.status_code, 401)

    def test_create_post_requires_jwt_and_sets_user_id(self):
        # Without token
        res_unauth = self.client.post('/api/posts/create', json={
            'title': 'Test Post',
            'content': 'Test Content'
        })
        self.assertEqual(res_unauth.status_code, 401)

        # Login as alice
        login_res = self.client.post('/api/auth/login', json={
            'username': 'alice',
            'password': 'password123'
        })
        token = login_res.get_json()['access_token']

        # Create post as alice
        res_auth = self.client.post('/api/posts/create', json={
            'title': 'Test Post',
            'content': 'Test Content',
            'image_url': 'https://example.com/img.png'
        }, headers={'Authorization': f'Bearer {token}'})
        self.assertEqual(res_auth.status_code, 201)
        post_data = res_auth.get_json()['post']
        self.assertEqual(post_data['user_id'], 1)
        self.assertEqual(post_data['title'], 'Test Post')

    def test_post_edit_and_delete_permissions(self):
        # 1. Login Alice & Bob
        alice_token = self.client.post('/api/auth/login', json={
            'username': 'alice', 'password': 'password123'
        }).get_json()['access_token']

        bob_token = self.client.post('/api/auth/login', json={
            'username': 'bob', 'password': 'password123'
        }).get_json()['access_token']

        # 2. Alice creates post
        create_res = self.client.post('/api/posts/create', json={
            'title': "Alice's Post",
            'content': 'Original Content'
        }, headers={'Authorization': f'Bearer {alice_token}'})
        post_id = create_res.get_json()['post']['id']

        # 3. Bob attempts to edit Alice's post -> should return 403 Forbidden
        bob_edit_res = self.client.put(f'/api/posts/{post_id}', json={
            'title': "Bob's Hacked Title"
        }, headers={'Authorization': f'Bearer {bob_token}'})
        self.assertEqual(bob_edit_res.status_code, 403)

        # 4. Bob attempts to delete Alice's post -> should return 403 Forbidden
        bob_del_res = self.client.delete(f'/api/posts/{post_id}', headers={
            'Authorization': f'Bearer {bob_token}'
        })
        self.assertEqual(bob_del_res.status_code, 403)

        # 5. Alice edits her post -> should succeed 200
        alice_edit_res = self.client.put(f'/api/posts/{post_id}', json={
            'title': "Alice's Updated Title"
        }, headers={'Authorization': f'Bearer {alice_token}'})
        self.assertEqual(alice_edit_res.status_code, 200)
        self.assertEqual(alice_edit_res.get_json()['post']['title'], "Alice's Updated Title")

        # 6. Alice deletes her post -> should succeed 200
        alice_del_res = self.client.delete(f'/api/posts/{post_id}', headers={
            'Authorization': f'Bearer {alice_token}'
        })
        self.assertEqual(alice_del_res.status_code, 200)

    def test_delete_comment_requires_jwt(self):
        # Create a post and a comment directly
        with self.app.app_context():
            post = Post(title="Post for Comment", content="Content", user_id=1)
            db.session.add(post)
            db.session.commit()
            comment = Comment(content="Great read!", post_id=post.id)
            db.session.add(comment)
            db.session.commit()
            comment_id = comment.id

        # 1. Unauthenticated DELETE -> should return 401
        res_unauth = self.client.delete(f'/api/comments/comments/{comment_id}')
        self.assertEqual(res_unauth.status_code, 401)
        self.assertIn('error', res_unauth.get_json())

        # 2. Authenticated DELETE -> should return 200
        login_res = self.client.post('/api/auth/login', json={
            'username': 'alice', 'password': 'password123'
        })
        token = login_res.get_json()['access_token']

        res_auth = self.client.delete(f'/api/comments/comments/{comment_id}', headers={
            'Authorization': f'Bearer {token}'
        })
        self.assertEqual(res_auth.status_code, 200)
        self.assertEqual(res_auth.get_json()['message'], 'Comment deleted successfully')

    def test_user_lookup_error_format(self):
        # Generate token for non-existent user ID
        with self.app.app_context():
            token = create_access_token(identity='9999')

        res = self.client.get('/api/auth/me', headers={
            'Authorization': f'Bearer {token}'
        })
        self.assertEqual(res.status_code, 401)
        data = res.get_json()
        self.assertIn('error', data)
        self.assertEqual(data['error'], 'User not found or session invalid.')


if __name__ == '__main__':
    unittest.main()

