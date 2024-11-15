import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import './styles/_App.scss';
import PostList from './components/postList';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<PostList />} />
        </Routes>
      </Router>


    </div>
  );
}

export default App;
