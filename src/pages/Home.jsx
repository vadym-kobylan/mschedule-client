import React, { useState } from 'react';
import Login from '../components/Login';
import '../App.css';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';


const Home = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const { role, id } = useSelector((state) => state.user);


  return (
    <div>
      <h1>MSchedule</h1>
      {role === 'ADMIN' && (
        <div className="buttonsWrapper">
          <Link to="/users-table">Users Table</Link>
          <Link to="/create-user">Create User</Link>
        </div>
      )}

      {role === 'MEMBER' && (
        <div className="buttonsWrapper">
          <Link to={`/schedule/${id}`}>Go to Scheduler</Link>
        </div>
      )}

      {!role && <Login open={isLoginOpen} setOpen={setIsLoginOpen} />}
    </div>
  );
};

export default Home;
