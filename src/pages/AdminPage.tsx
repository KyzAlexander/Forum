import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { updateUserProfile, togglePostPriority } from '../redux/slices/adminSlice';

const AdminPage: React.FC = () => {
  const dispatch = useDispatch();
  const users = useSelector((state: RootState) => state.users.users);
  const posts = useSelector((state: RootState) => state.posts.posts);



  const handleUserUpdate = (userId: number, newName: string, newEmail: string) => {
    dispatch(updateUserProfile({ userId, name: newName, email: newEmail }));
  };

  const handleTogglePriority = (postId: number) => {
    dispatch(togglePostPriority(postId));
  };

  return (
    <div className="admin-page">
      <h2>Admin Panel</h2>
      <h3>Manage Users</h3>
      {users.map((user) => (
        <div key={user.id}>
          <input
            type="text"
            defaultValue={user.name}
            onBlur={(e) => handleUserUpdate(user.id, e.target.value, user.email)}
          />
          <input
            type="email"
            defaultValue={user.email}
            onBlur={(e) => handleUserUpdate(user.id, user.name, e.target.value)}
          />
        </div>
      ))}
      <h3>Manage Post Priority</h3>
      {/* {posts.map((post) => (
        <div key={post.id}>
          <p>{post.title}</p>
          <button onClick={() => handleTogglePriority(post.id)}>
            {post.priority ? 'Remove from Top' : 'Promote to Top'}
          </button>
        </div>
      ))} */}
    </div>
  );
};

export default AdminPage;