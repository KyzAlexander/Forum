import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const users = useSelector((state: RootState) => state.users.users);

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <h2>Manage Users</h2>
      <Link to={"/"}>Главная для юзеров</Link>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;