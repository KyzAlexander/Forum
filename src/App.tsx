import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import UserPostsPage from './pages/UserPostsPage/UserPostsPage';
import PostDetail from './components/PostDetail/PostDetail';

import './styles/_App.scss';
import LoginPage from './pages/LoginPage/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './components/AdminDashboard';
import UserAccountPage from './pages/UserAccountPage/UserAccountPage';



function App() {
  return (
    <div className="App">
      <Router>
        <Routes>


          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={['user', 'admin']}>
                <UserPostsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/:userId"
            element={
              <ProtectedRoute allowedRoles={['user', 'admin']}>
                <UserAccountPage />
              </ProtectedRoute>
            }
          />



          <Route path="/" element={<UserPostsPage />} />
          <Route path="/post/:postId" element={<PostDetail />} />

        </Routes>
      </Router>


    </div>
  );
}

export default App;
