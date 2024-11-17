import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { fetchUsers } from "../../redux/slices/usersSlice";
import {
  fetchPosts,
  toggleFavorite,
  toggleLike,
} from "../../redux/slices/postsSlice";
import { fetchCommentsByPostId } from "../../redux/slices/commentsSlice";

import "./index.scss";
import UserWithPosts from "../../components/UserWithPosts/UserWithPosts";

const UserPostsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Получение пользователей и постов из состояния  

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
            {filteredUserId === null
              ? users.map((user) => (
                <UserWithPosts
                  key={user.id}
                  user={user}
                  posts={posts.filter((post) => post.userId === user.id)}
                  comments={comments}
                  onToggleLike={(postId) => dispatch(toggleLike(postId))}
                  onToggleFavorite={(postId) => dispatch(toggleFavorite(postId))}
                />
              ))
              : users
                .filter((user) => user.id === filteredUserId)
                .map((user) => (
                  <UserWithPosts
                    key={user.id}
                    user={user}
                    posts={posts.filter((post) => post.userId === user.id)}
                    comments={comments}
                    onToggleLike={(postId) => dispatch(toggleLike(postId))}
                    onToggleFavorite={(postId) => dispatch(toggleFavorite(postId))}
                  />
                ))}
          </div>
        </div>
      )}
    </>
  );
};

export default UserPostsPage;
