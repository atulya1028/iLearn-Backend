import React, { useState } from 'react';
import '../styles/SignUp.css';
import { Link } from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setError('');
      } else {
        setMessage('');
        setError(data.error || 'Something went wrong');
      }
    } catch (error) {
      setMessage('');
      setError('Something went wrong');
    }
  };

  return (
    <div className='main-body'>
      <h2>Sign Up</h2>
     <div className='form-border'>
     <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder='Name'
            className='field'
          />
        </div>
        <div>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder='Email'
            className='field'
          />
        </div>
        <div>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder='Password'
            className='field'
          />
        </div>
        <div>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder='Phone'
            className='field'
          />
        </div>
        <button type="submit" className='sign-up-btn'>Sign Up</button>
      </form>
     </div>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Link to='/login'>Already a user? Please sign in</Link>
    </div>
  );
};

export default SignUp;
