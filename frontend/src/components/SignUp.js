import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const SignUp = ({ setUser }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Save token and user info from backend
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        navigate('/');
      } else {
        alert(data.message || 'Signup failed');
      }
    } catch (error) {
      alert('Signup error: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="card w-50 mx-auto" style={{ borderRadius: '15px' }}>
      <div className="card-body">
        <div className="text-center h3 fw-bold text-primary">📝 Sign Up</div>
        <label className="fw-bold mb-1">🤵 Name</label>
        <input
          type="text"
          className="form-control my-2 rounded-pill"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
        />
        <label className="fw-bold mt-2 mb-1">📧 Email</label>
        <input
          type="email"
          className="form-control my-2 rounded-pill"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <label className="fw-bold mt-2 mb-1">🔒 Password</label>
        <input
          type="password"
          className="form-control my-2 rounded-pill"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
        <button
          className="btn btn-success w-100 rounded-pill mt-3"
          onClick={handleSignUp}
          disabled={loading}
        >
          {loading ? 'Registering...' : '🚀 Register Now'}
        </button>
        <div className="text-center text-gray mt-2">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
