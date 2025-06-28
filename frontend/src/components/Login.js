import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Save token and user info
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        navigate('/');
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      alert('Login error: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="card w-50 mx-auto" style={{ borderRadius: '15px' }}>
      <div className='card-body'>
        <div className='text-center h3 fw-bold text-primary'>🔐 Login</div>
        <label className='fw-bold mb-1'>📧 Email</label>
        <input
          type="email"
          className="form-control my-2 rounded-pill"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={loading}
        />
        <label className='fw-bold mt-2 mb-1'>🔒 Password</label>
        <input
          type="password"
          className="form-control my-2 rounded-pill"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          disabled={loading}
        />
        <button
          className="btn btn-primary w-100 rounded-pill mt-3"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <div className='text-center text-gray mt-2'>
          Don't have an account? <Link to="/signup">Signup</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
