import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../redux/slices/usersSlice";
import { fetchPosts } from "../../redux/slices/postsSlice";
import { AppDispatch, RootState } from "../../redux/store";
import AdminUserCard from "../../components/AdminUserCard/AdminUserCard";
import Loader from "../../components/Loader/Loader";
import BackToLoginButton from "../../components/BackToLoginButton/BackToLoginButton";
import "./index.scss";


const AdminPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { users, loading: usersLoading } = useSelector(
    (state: RootState) => state.users
  );
  const { posts, loading: postsLoading } = useSelector(
    (state: RootState) => state.posts
  );

  const isLoading = usersLoading || postsLoading;

  const [filteredUserId, setFilteredUserId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchPosts());
  }, [dispatch]);

  return (
    <div className="admin-page">
      <h1 className="admin-page__title">Admin Panel</h1>

      <div className="filter">
        <label>Filter by user:</label>
        <select
          value={filteredUserId || ""}
          onChange={(e) => setFilteredUserId(Number(e.target.value) || null)}
        >
          <option value="">All Users</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      <h2 className="admin-page__section-title">Users</h2>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {filteredUserId === null
            ? users.map((user) => (
              <AdminUserCard
                key={user.id}
                user={user}
                posts={posts.filter((post) => post.userId === user.id)}
              />
            ))
            : users
              .filter((user) => user.id === filteredUserId)
              .map((user) => (
                <AdminUserCard
                  key={user.id}
                  user={user}
                  posts={posts.filter((post) => post.userId === user.id)}
                />
              ))}
        </>
      )}
      <BackToLoginButton />
    </div>
  );
};

export default AdminPage;
