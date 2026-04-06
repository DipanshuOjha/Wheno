import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin ? { email, password } : { name, email, password };
      
      const res = await axios.post(`http://localhost:5000${endpoint}`, payload);
      
      login(res.data.token, res.data.user);
      onClose(); // Close modal on success
    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="hora-modal-bg" style={{ display: 'flex' }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="auth-modal">
        <button className="pm-close" onClick={onClose} style={{ position: 'absolute', top: '14px', right: '14px' }}>✕</button>
        <div className="auth-brand">
          <div className="auth-brand-name">Wheno</div>
          <div className="auth-brand-tag">Choose the right moment.</div>
        </div>
        <div className="auth-title">{isLogin ? 'Welcome back' : 'Create your account'}</div>
        <div className="auth-sub">
          {isLogin ? 'Sign in to save activities, journals and bookings' : 'Join Wheno to save activities, journals and bookings'}
        </div>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="auth-field">
              <label className="auth-label">Your name</label>
              <input className="auth-input" type="text" placeholder="e.g. Priya Sharma" value={name} onChange={e => setName(e.target.value)} required={!isLogin} />
            </div>
          )}
          <div className="auth-field">
            <label className="auth-label">Email</label>
            <input className="auth-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="auth-field">
            <label className="auth-label">Password</label>
            <input className="auth-input" type="password" placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)} required minLength="6" />
          </div>
          
          {error && <div className="auth-error" style={{ display: 'block' }}>{error}</div>}
          
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
          
          <div className="auth-switch">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(!isLogin); setError(''); }}>
              {isLogin ? 'Register' : 'Sign In'}
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;