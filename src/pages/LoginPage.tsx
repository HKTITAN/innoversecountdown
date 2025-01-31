import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleLogin = () => {
    console.log("handleLogin", process.env);
    console.log("password", password);

    if (password === process.env.REACT_APP_ADMIN_PASSWORD) {
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/admin');
    } else {
      setError('Invalid password');
    }
  };

  return (
    <div id="login" className="login-container">
      <div className="login-box">
        <h2><i className="fas fa-lock"></i> Admin Login</h2>
        <input
          type="password"
          id="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="error-message">{error}</p>}
        <button onClick={handleLogin}>
          <i className="fas fa-sign-in-alt"></i> Login
        </button>
      </div>
    </div>
  );
};

export default LoginPage;