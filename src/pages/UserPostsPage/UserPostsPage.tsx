import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { fetchUsers } from "../../redux/slices/usersSlice";
import {
  fetchPosts,
  toggleDislike,
  toggleFavorite,
  toggleLike,
} from "../../redux/slices/postsSlice";
import { fetchCommentsByPostId } from "../../redux/slices/commentsSlice";
import UserWithPosts from "../../components/UserWithPosts/UserWithPosts";
import Loader from "../../components/Loader/Loader";
import BackToLoginButton from "../../components/BackToLoginButton/BackToLoginButton";
import "./index.scss";


const UserPostsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

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
  const [openComments, setOpenComments] = useState<Record<number, boolean>>({});

  const isLoading = postsLoading || usersLoading || commentsLoading;

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchPosts());
  }, [dispatch]);

  useEffect(() => {
    posts.forEach((post) => {
      if (!comments[post.id]) {
        dispatch(fetchCommentsByPostId(post.id));
      }
    });
  }, [dispatch, posts, comments]);

  const toggleComments = (postId: number) => {
    setOpenComments((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="user-posts-page">
          <h1>User Posts</h1>
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
          <div className="user-list">
            {filteredUserId === null
              ? users.map((user) => (
                <UserWithPosts
                  key={user.id}
                  user={user}
                  posts={posts.filter((post) => post.userId === user.id)}
                  comments={comments}
                  openComments={openComments}
                  onToggleLike={(postId) => dispatch(toggleLike(postId))}
                  onToggleDislike={(postId) =>
                    dispatch(toggleDislike(postId))
                  }
                  onToggleFavorite={(postId) =>
                    dispatch(toggleFavorite(postId))
                  }
                  onToggleComments={toggleComments}
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
                    openComments={openComments}
                    onToggleLike={(postId) => dispatch(toggleLike(postId))}
                    onToggleDislike={(postId) =>
                      dispatch(toggleDislike(postId))
                    }
                    onToggleFavorite={(postId) =>
                      dispatch(toggleFavorite(postId))
                    }
                    onToggleComments={toggleComments}
                  />
                ))}
          </div>
          <BackToLoginButton />
        </div>
      )}
    </>
  );
};

export default UserPostsPage;
