import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from werkzeug.security import generate_password_hash

from main import create_app
from models import db, User, Post, Comment


USERS = [
    ('alice', 'password123'),
    ('bob', 'password123'),
    ('charlie', 'password123'),
    ('diana', 'password123'),
]

POSTS = [
    (
        'Getting Started with Amazon S3',
        'Amazon Simple Storage Service (S3) is an object storage service that offers industry-leading scalability, data availability, security, and performance. In this post we walk through creating your first bucket, uploading objects, and configuring bucket policies.',
        'alice',
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    ),
    (
        'Understanding AWS Lambda Cold Starts',
        'A cold start happens when Lambda has to initialize a new execution environment before invoking your function. We look at what causes cold starts, how to measure them, and practical techniques such as provisioned concurrency to keep latency low.',
        'bob',
        'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    ),
    (
        'A Beginner Guide to DynamoDB',
        'DynamoDB is a fully managed NoSQL key-value and document database. This guide covers tables, partition keys, sort keys, and how to choose an access pattern that scales without hot partitions.',
        'alice',
        'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80',
    ),
    (
        'Securing Your VPC with Security Groups',
        'Security groups act as a virtual firewall for your EC2 instances. Learn how inbound and outbound rules are evaluated, why they are stateful, and common patterns for layering security across subnets.',
        'charlie',
        'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    ),
    (
        'Cost Optimization Tips for EC2',
        'Compute is often the largest line item on an AWS bill. From right-sizing instances and using Savings Plans to scheduling non-production workloads, here are the changes that delivered the biggest savings for us.',
        'diana',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    ),
    (
        'Introduction to Amazon CloudFront',
        'CloudFront is a global content delivery network that caches your content at edge locations. We explain distributions, origins, cache behaviors, and how to invalidate content when you ship a new release.',
        'bob',
        'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    ),
    (
        'Deploying Containers with ECS Fargate',
        'Fargate lets you run containers without managing servers. This post compares Fargate with EC2 launch types and shows a task definition for a simple web service behind an Application Load Balancer.',
        'charlie',
        'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    ),
    (
        'Monitoring Your Stack with CloudWatch',
        'CloudWatch collects metrics, logs, and events from across your AWS resources. Learn how to build dashboards, set alarms on meaningful thresholds, and query logs with CloudWatch Logs Insights.',
        'diana',
        'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=800&q=80',
    ),
]

COMMENTS = [
    ('Great introduction, the bucket policy example finally made it click for me.', 0),
    ('Do you recommend versioning from day one?', 0),
    ('Provisioned concurrency saved us a lot of latency on our API.', 1),
    ('Any tips for keeping the cold start down on Node.js functions?', 1),
    ('The hot partition explanation was really helpful, thanks!', 2),
    ('Would love a follow-up on single-table design.', 2),
    ('Stateful rules are such an easy thing to forget. Good reminder.', 3),
    ('Savings Plans were a game changer for our steady-state traffic.', 4),
    ('How aggressive do you get with instance scheduling?', 4),
    ('Invalidations are the part that always trips people up.', 5),
    ('This is the clearest Fargate walkthrough I have read.', 6),
    ('Do you set up alarms with composite conditions?', 7),
]


def seed(reset=True):
    app = create_app()

    with app.app_context():
        if reset:
            Comment.query.delete()
            Post.query.delete()
            User.query.delete()
            db.session.commit()

        users = {}
        for username, password in USERS:
            user = User(username=username, password=generate_password_hash(password))
            db.session.add(user)
            users[username] = user

        db.session.flush()

        posts = []
        for title, content, author, image_url in POSTS:
            post = Post(title=title, content=content, user_id=users[author].id, image_url=image_url)
            db.session.add(post)
            posts.append(post)

        db.session.flush()

        for content, post_index in COMMENTS:
            db.session.add(Comment(content=content, post_id=posts[post_index].id))

        db.session.commit()

        print('Seeded {} users, {} posts, {} comments'.format(
            User.query.count(),
            Post.query.count(),
            Comment.query.count()
        ))


if __name__ == '__main__':
    seed(reset='--keep' not in sys.argv)
