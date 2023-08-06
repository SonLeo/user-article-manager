import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import UserList from './pages/UserList';
import UserAdd from './pages/UserAdd';
import UserDetail from './pages/UserDetail';
import ArticleAdd from './pages/ArticleAdd';
import ArticleEdit from './pages/ArticleEdit';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<UserList />} />
        <Route path='/add' element={<UserAdd />} />
        <Route path='/edit/:userId' element={<UserDetail />} />
        <Route path='/:userId/article/add' element={<ArticleAdd />} />
        <Route path='/:userId/article/edit/:articleId' element={<ArticleEdit />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
