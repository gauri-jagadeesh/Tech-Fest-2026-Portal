import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, Sparkles, Shield } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  // Demo auto-fill helpers
  const fillStudentDemo = () => {
    setEmail('student@techfest2026.com');
    setPassword('Student@2026');
    setError('');
  };

  const fillAdminDemo = () => {
    setEmail('admin@techfest2026.com');
    setPassword('Admin@2026');
    setError('');
  };

  return (
    <div className="auth-wrapper">
      <div className="glass-card auth-card">
        <div className="auth-header">
          <div className="nav-logo-icon" style={{ margin: '0 auto 1rem' }}>
            <Sparkles size={22} />
          </div>
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">
            Sign in to access your registered event passes and schedules.
          </p>
        </div>

        {/* Demo Quick-Fill Buttons */}
        <div className="demo-box">
          <div className="demo-title">
            <Sparkles size={14} /> Quick Demo Logins for Evaluation
          </div>
          <div className="demo-buttons">
            <button
              type="button"
              onClick={fillStudentDemo}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, fontSize: '0.8rem' }}
            >
              Student Demo
            </button>
            <button
              type="button"
              onClick={fillAdminDemo}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, fontSize: '0.8rem', borderColor: 'rgba(244, 63, 94, 0.4)' }}
            >
              <Shield size={13} color="#f43f5e" /> Admin Demo
            </button>
          </div>
        </div>

        {error && (
          <div className="form-error">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">College Email Address</label>
            <div className="input-with-icon">
              <Mail className="input-icon" size={18} />
              <input
                type="email"
                className="form-input"
                placeholder="student@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-with-icon">
              <Lock className="input-icon" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : (
              <>
                <LogIn size={18} /> Sign In to Portal
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Don't have an account yet?{' '}
          <Link to="/signup" style={{ color: 'var(--accent-cyan-light)', fontWeight: 600 }}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
