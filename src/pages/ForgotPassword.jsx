// src/components/ForgotPassword.jsx;
import React, { useState } from 'react';
import '../styles/ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Password reset email sent');
      } else {
        setError(data.error || 'Failed to send password reset email');
      }
    } catch (err) {
      setError('Failed to send password reset email');
    }
  };

  return (
    <div className='main-body'>
      <h2>Forgot Password</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
     <div className='form-border'>
     <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className='email-field'
            placeholder='Enter your email'
          />
        </div>
        <button type="submit" className='submit-button'>Send Reset Link</button>
      </form>
     </div>
    </div>
  );
};

export default ForgotPassword;
