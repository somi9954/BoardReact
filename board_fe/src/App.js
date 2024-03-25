import { Routes, Route } from 'react-router-dom';
import { useContext } from 'react';
import UserContext from './modules/user';

import FrontLayout from './layouts/front/CommonLayout';
import AdminLayout from './layouts/admin/CommonLayout';

/* 소비자 페이지 */
import NotFound from './pages/commons/NotFound';
import Main from './pages/front/Main';
import Login from './pages/front/member/login';
import Join from './pages/front/member/Join';
import Logout from './pages/front/member/Logout';
import Mypage from './pages/front/member/Mypage';
import BoardWrite from './pages/front/board/BoardWrite';

/* 관리자 페이지 */
import AdminMain from './pages/admin/Main';
import AdminConfig from './pages/admin/Config';
import AdminBoardWrite from './pages/admin/AdminBoardWrite';
import AdminBoardChange from './pages/admin/AdminBoardChange';

const App = () => {
  const {
    action: { updateUserInfo },
  } = useContext(UserContext);

  updateUserInfo();

  return (
    <Routes>
      <Route path="/" element={<FrontLayout />}>
        <Route index element={<Main />} />
        <Route path="/join" element={<Join />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/board/write/:bId" element={<BoardWrite />} />
      </Route>

      {/* 관리자 페이지 */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminMain />} />
        <Route path="/admin/board/list" element={<AdminMain />} />
        <Route path="/admin/board/add" element={<AdminBoardWrite />} />
        <Route path="/admin/board/edit/:bId" element={<AdminBoardChange />} />
        <Route path="config" element={<AdminConfig />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
