import React from "react";
import { Link } from "react-router-dom";

import "./index.scss";

interface User {
  id: number;
  name: string;
  email: string;
}

interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
  liked: boolean;
  favorite: boolean;
}

interface UserWithPostsProps {
  user: User;
  posts: Post[];
  comments: Record<number, { id: number; body: string }[]>;
  onToggleLike: (postId: number) => void;
  onToggleFavorite: (postId: number) => void;
}

const UserWithPosts: React.FC<UserWithPostsProps> = ({
  user,
  posts,
  comments,
  onToggleLike,
  onToggleFavorite,
}) => (
  <div className="user">
    <h2>{user.name}</h2>
    <p>Email: {user.email}</p>
    <div className="posts">
      {posts.map((post) => (
        <div key={post.id} className="post">
          <Link to={`/post/${post.id}`}>
            <h3>{post.title}</h3>
          </Link>
          <p>{post.body}</p>

          {/* Лайк и избранное */}
          <div className="post-actions">
            <button onClick={() => onToggleLike(post.id)}>
              {post.liked ? "Unlike" : "Like"}
            </button>
            <button onClick={() => onToggleFavorite(post.id)}>
              {post.favorite ? "Remove from Favorites" : "Add to Favorites"}
            </button>
          </div>

          {/* Комментарии */}
          <div className="comments-section">
            <h4>Comments</h4>
            <ul>
              {(comments[post.id] || []).map((comment) => (
                <li key={comment.id}>
                  <p>{comment.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default UserWithPosts;