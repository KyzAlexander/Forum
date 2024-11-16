import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import UserPostsPage from './pages/UserPostsPage/UserPostsPage';
import PostDetail from './components/PostDetail/PostDetail';

import './styles/_App.scss';


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>

          {/* <Route path="/" element={<AdminPage />} /> */}

          <Route path="/" element={<UserPostsPage />} />
          <Route path="/post/:postId" element={<PostDetail />} />

        </Routes>
      </Router>


    </div>
  );
}

export default App;
