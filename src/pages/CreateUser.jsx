import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateUser = () => {
  const toastId = useRef(null);

  const { token } = useSelector((state) => state.user);
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const onCreateUser = () => {
    setError('');

    if (email.length <= 0 || firstname.length <= 0 || lastname.length <= 0) {
      setError('Please, enter all fields');
      return;
    }

    const userdata = { firstname, lastname, email };

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json', // Adjust content type as needed
    };

    toastId.current = toast.loading('Creating...');

    axios
      .post(`http://localhost:8080/api/v1/auth/register`, userdata, { headers })
      .then((res) => {
        toast.update(toastId.current, {
          render: 'User created successfully, password sent to email...',
          type: 'success',
          isLoading: false,
          autoClose: 5000,
        });

        setEmail('');
        setFirstname('');
        setLastname('');
      })
      .catch((error) => {
        if (error.response.status === 409) {
          toast.update(toastId.current, {
            render: 'User with such email already exists...',
            type: 'error',
            isLoading: false,
            autoClose: 5000,
          });
        } else {
          toast.update(toastId.current, {
            render: 'Error during creation (check email for correctness)...',
            type: 'error',
            isLoading: false,
            autoClose: 5000,
          });
        }
      });
  };

  return (
    <>
      <ToastContainer autoClose={5000} useRef={toastId} />
      <div className="createUserForm">
        <div>
          <label>First Name</label>
          <input type="plain" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
        </div>

        <div>
          <label>Last Name</label>
          <input type="plain" value={lastname} onChange={(e) => setLastname(e.target.value)} />
        </div>

        <div>
          <label>Email</label>

          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <p className="formError">{error}</p>

        <button className="createUserButton" onClick={onCreateUser}>
          Create User
        </button>
      </div>
    </>
  );
};

export default CreateUser;
