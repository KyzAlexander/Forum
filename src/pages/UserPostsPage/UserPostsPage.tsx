import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { fetchUsers } from "../../redux/slices/usersSlice";
import {
  fetchPosts,
  toggleFavorite,
  toggleLike,
} from "../../redux/slices/postsSlice";
import { Link } from "react-router-dom";
import { fetchCommentsByPostId } from "../../redux/slices/commentsSlice";

import "./index.scss";

const UserPostsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Получение пользователей и постов из состояния

  //БЫЛО ДО ИЗМЕНЕНИЯ
  // const {users} = useSelector((state: RootState) => state.users.users);
  // const posts = useSelector((state: RootState) => state.posts.posts);
  // const comments = useSelector((state: RootState) => state.comments.comments);
  // const [filteredUserId, setFilteredUserId] = useState<number | null>(null);

  const { users, loading: usersLoading } = useSelector(
    (state: RootState) => state.users
  );
  const { posts, loading: postsLoading } = useSelector(
    (state: RootState) => state.posts
  );
  const { comments, loading: commentsLoading } = useSelector(
    (state: RootState) => state.comments
  );
  const [filteredUserId, setFilteredUserId] = useState<number | null>(null);

  const isLoading = postsLoading || usersLoading || commentsLoading;

  console.log(users);


  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchPosts());
  }, [dispatch]);

  // Загрузка комментариев для всех постов
  useEffect(() => {
    posts.forEach((post) => {
      if (!comments[post.id]) {
        dispatch(fetchCommentsByPostId(post.id));
      }
    });
  }, [dispatch, posts, comments]);

  // Фильтрация постов по ID пользователя
  const filteredPosts = filteredUserId
    ? posts.filter((post) => post.userId === filteredUserId)
    : posts;

  return (
    <>
      {isLoading ? (
        <div className="loading-spinner">
          <p>LOADING ....</p>
        </div>
      ) : (
        <div className="user-posts-page">
          <h1>User Posts</h1>

          {/* Компонент фильтрации по пользователям */}
          <div className="filter">
            <label>Filter by user:</label>
            <select
              value={filteredUserId || ""}
              onChange={(e) =>
                setFilteredUserId(Number(e.target.value) || null)
              }
            >
              <option value="">All Users</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          {/* Отображение пользователей и их постов */}
          <div className="user-list">
            {users.map((user) => (
              <div key={user.id} className="user">
                <h2>{user.name}</h2>
                <p>Email: {user.email}</p>

                <div className="posts">
                  {filteredPosts
                    .filter((post) => post.userId === user.id)
                    .map((post) => (
                      <div key={post.id} className="post">
                        <Link to={`/post/${post.id}`}>
                          <h3>{post.title}</h3>
                        </Link>
                        <p>{post.body}</p>

                        {/* Лайк и избранное */}
                        <div className="post-actions">
                          <button onClick={() => dispatch(toggleLike(post.id))}>
                            {post.liked ? "Unlike" : "Like"}
                          </button>
                          <button
                            onClick={() => dispatch(toggleFavorite(post.id))}
                          >
                            {post.favorite
                              ? "Remove from Favorites"
                              : "Add to Favorites"}
                          </button>
                        </div>

                        {/* Комментарии */}
                        {/* <div className="comments-section">
                          <h4>Comments</h4>
                          <ul>
                            {(comments[post.id] || []).map((comment) => (
                              <li key={comment.id}>                                
                                <p>{comment.body}</p>
                              </li>
                            ))}
                          </ul>
                        </div> */}
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default UserPostsPage;
