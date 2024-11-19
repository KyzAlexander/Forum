import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, updateUserProfile } from "../../redux/slices/usersSlice";
import { fetchPosts, deletePost, movePostToTop, swapPosts } from "../../redux/slices/postsSlice";
import { AppDispatch, RootState } from "../../redux/store";

import "./index.scss";


const AdminPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { users, loading: usersLoading } = useSelector(
    (state: RootState) => state.users
  );
  const { posts, loading: postsLoading } = useSelector(
    (state: RootState) => state.posts
  );

  const isLoading = usersLoading || postsLoading

  const [filteredUserId, setFilteredUserId] = useState<number | null>(null);

  const [editingUser, setEditingUser] = useState<number | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchPosts());
  }, [dispatch]);


  useEffect(() => {
    if (editingUser !== null) {
      const user = users.find((u) => u.id === editingUser);
      if (user) {
        setEditedName(user.name);
        setEditedEmail(user.email);
      }
    }
  }, [users, editingUser]);


  return (
    <div className="admin-page">
      <h1 className="admin-page__title">Admin Panel</h1>


      {/* **************************************** */}

      {/* *********ДОБАВИТЬ ФИЛЬТ !!! */}

      {/* <div className="filter">
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
          </div> */}


      {/* **************************************************** */}

      <h2 className="admin-page__section-title">Users</h2>
      {isLoading ? (
        <p className="admin-page__loading">Loading ...</p>
      ) : (
        users.map((user) => (

          <div key={user.id} className="user-card">

            {editingUser === user.id ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  dispatch(
                    updateUserProfile({
                      id: user.id,
                      name: editedName,
                      email: editedEmail,
                    })
                  );
                  setEditingUser(null);
                }}
                className="edit-form"
              >
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  placeholder="Name"
                />
                <input
                  type="email"
                  value={editedEmail}
                  onChange={(e) => setEditedEmail(e.target.value)}
                  placeholder="Email"
                />
                <button type="submit" className="button button--save">
                  Save
                </button>
                <button
                  type="button"
                  className="button button--cancel"
                  onClick={() => setEditingUser(null)}
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div className="user-card__info">
                <p className="user-card__name">{user.name}</p>
                <p className="user-card__email">{user.email}</p>
                <button
                  className="button button--edit"
                  onClick={() => setEditingUser(user.id)}
                >
                  Edit
                </button>
              </div>
            )}

            <h3 className="user-card__posts-title">Posts</h3>
            {posts
              .filter((post) => post.userId === user.id)
              .map((post, index) => (
                <div className="post-card" key={post.id}>
                  <p className="post-card__title">{post.title}</p>
                  <p className="post-card__subtitle">{post.body}</p>
                  <div className="post-card__buttons">
                    <button
                      className="button button--delete"
                      onClick={() => dispatch(deletePost(post.id))}
                    >
                      Delete
                    </button>
                    <button
                      className="button button--top"
                      onClick={() => dispatch(movePostToTop(post.id))}
                    >
                      Move to Top
                    </button>
                    {index > 0 && (
                      <button
                        className="button button--swap"
                        onClick={() =>
                          dispatch(
                            swapPosts({
                              userId: user.id,
                              postId1: post.id,
                              postId2: posts.filter((p) => p.userId === user.id)[
                                index - 1
                              ].id,
                            })
                          )
                        }
                      >
                        Swap with Above
                      </button>
                    )}
                  </div>

                </div>
              ))}
          </div>
        ))
      )}
    </div>

  );
};

export default AdminPage;
