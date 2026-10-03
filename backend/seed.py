import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from werkzeug.security import generate_password_hash

from main import create_app
from models import db, User, Post, Comment


USERS = [
    ('Jesse', 'password'),
]

POSTS = [
    (
        'Exploring the Frontiers of Modern Architecture',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\n\nCurabitur pretium tincidunt lacus. Nulla gravida orci a odio, et feugiat felis adipiscing at. Mauris sollicitudin fermentum libero, nec bibendum dui pulvinar in. Maecenas a dolor ut dolor tempus feugiat in sit amet purus. Cras efficitur, dolor nec lacinia hendrerit, neque felis dignissim purus, vitae finibus sapien purus vel justo.\n\nPellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Proin pharetra nonummy pede. Mauris et orci. Aenean nec lorem. In porttitor. Donec laoreet nonummy augue. Suspendisse dui purus, scelerisque at, vulputate vitae, pretium mattis, nunc. Mauris eget neque at sem venenatis eleifend.',
        'Jesse',
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
    ),
    (
        'The Future of Cloud Native Systems',
        'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.\n\nNemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.\n\nUt enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.',
        'Jesse',
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    ),
    (
        'Designing for Next-Generation Interfaces',
        'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.\n\nEt harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.\n\nTemporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.',
        'Jesse',
        'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    ),
    (
        'Deep Dive into Distributed Data Stores',
        'Phasellus tristique dapibus velit sit amet facilisis. Cras vel feugiat tellus, non pulvinar libero. Aenean sed velit lacinia, finibus neque sed, sagittis dui. Etiam imperdiet libero vel ante scelerisque, vel condimentum justo finibus. Duis vitae lectus mollis, pretium est at, laoreet lacus.\n\nInteger ut posuere magna. Sed tincidunt purus ut nibh placerat, a cursus neque rhoncus. Vivamus vitae felis vitae quam elementum dignissim. Mauris cursus lorem at tortor auctor, a tincidunt justo semper. Etiam gravida lorem nec quam congue elementum. Morbi lacinia dictum erat a fermentum.\n\nCras auctor ipsum a risus varius efficitur. Fusce auctor, ligula vel viverra interdum, ante erat consequat velit, ac viverra ligula lacus id arcu. Donec vehicula lorem sit amet dictum tincidunt. Cras a magna vel sapien finibus interdum non eu dolor.',
        'Jesse',
        'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    ),
    (
        'Engineering High-Performance Web Applications',
        'Vivamus euismod magna id ante convallis tempor. Nulla aliquet risus sit amet quam varius feugiat. Ut tincidunt risus ut sapien sodales, at imperdiet ligula cursus. Mauris sit amet fermentum enim, non sollicitudin elit. Morbi eu sem nec orci vestibulum luctus eget quis est.\n\nSuspendisse potenti. Nam pretium tellus eget ligula volutpat, at dapibus metus malesuada. Donec bibendum nunc vel arcu convallis, et placerat nisi viverra. Vivamus quis magna at mauris sodales pretium. Sed sed arcu tincidunt, venenatis lectus eget, dictum est.\n\nProin facilisis tortor ut quam faucibus sagittis. Phasellus hendrerit ipsum sit amet nisi pretium posuere. Vestibulum tristique sapien et leo malesuada luctus. Maecenas tristique lorem eu mauris semper, non efficitur erat molestie. Cras euismod nisl id lorem laoreet commodo.',
        'Jesse',
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
    ),
    (
        'Scalable Microservices and Serverless Computing',
        'Fusce aliquet cursus ante, sed fermentum sem porta id. Cras facilisis sem quis ex tincidunt, non pellentesque nunc gravida. Aliquam ac sapien id arcu dapibus tempus vel vel diam. Morbi finibus sem at est tristique, sit amet tristique leo commodo.\n\nNulla facilisi. Aenean a ligula vitae diam luctus hendrerit sed id diam. Maecenas imperdiet turpis quis dui rhoncus, nec varius libero commodo. Cras interdum justo nec orci condimentum cursus. Morbi bibendum quam quis lorem scelerisque, nec tincidunt neque convallis.\n\nSed accumsan semper metus vel gravida. Nam viverra convallis nisl, ac molestie purus fermentum a. Nulla facilisi. Suspendisse non orci eu ante vulputate dictum at quis velit. Nulla facilisi. Quisque facilisis odio sed ipsum placerat, id laoreet tellus fermentum.',
        'Jesse',
        'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    ),
]

COMMENTS = [
    ('Great introduction, the architectural breakdown really made it click for me.', 0),
    ('Do you recommend adopting this approach from day one?', 0),
    ('The latency reduction techniques mentioned here are very practical.', 1),
    ('Any tips for keeping cold starts minimal in production?', 1),
    ('The explanation regarding user flow was super helpful, thanks!', 2),
    ('Would love a follow-up article exploring this further.', 2),
    ('Clean architecture and state management are such vital topics. Good reminder.', 3),
    ('Fascinating insights into data scaling and throughput tradeoffs.', 4),
    ('This is one of the clearest walkthroughs I have read on this topic.', 5),
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
