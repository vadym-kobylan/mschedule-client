import * as React from 'react';
import axios from 'axios';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';

import AdminTable from './components/AdminTable';

import './App.css';
import AdminTasks from './components/AdminTasks';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, logoutUser } from './redux/userSlice';
import CreateUser from './pages/CreateUser';
import UserSchedule from './pages/UserSchedule';

const App = () => {
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const { role, token } = useSelector((state) => state.user);

  const onLogoutClick = () => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    axios
      .post(`http://localhost:8080/api/v1/auth/logout`, { headers })
      .then((res) => {
        dispatch(logoutUser());
        navigateTo('/');
      })
      .catch((error) => {
        console.error(error);
        dispatch(logoutUser());
        navigateTo('/');
      });
  };

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const id = localStorage.getItem('id');
    dispatch(setUser({ id, role, token }));
  }, []);

  return (
    <>
      {role && (
        <div className="menuButtonsWrapper">
          <Link className="homeButton" to="/">
            Home
          </Link>
          <button className="logoutButton" onClick={() => onLogoutClick()}>
            Log Out
          </button>
        </div>
      )}
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="/users-table" element={role === 'ADMIN' ? <AdminTable /> : <NotFound />} />
        <Route
          path="/users-table/:doctorId"
          element={role === 'ADMIN' ? <AdminTasks /> : <NotFound />}
        />
        <Route path="/create-user" element={role === 'ADMIN' ? <CreateUser /> : <NotFound />} />
        <Route path="/schedule/:userId" element={<UserSchedule />} />
      </Routes>
    </>
  );
};

export default App;
