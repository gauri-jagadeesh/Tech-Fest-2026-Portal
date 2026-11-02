import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Calendar,
  Layers,
  LayoutDashboard,
  ShieldCheck,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  X,
  User as UserIcon,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <header className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container navbar-inner">
        {/* Brand Logo */}
        <Link to="/" className="nav-brand" onClick={() => setMobileMenuOpen(false)}>
          <div className="nav-logo-icon">
            <Sparkles size={22} />
          </div>
          <div className="nav-brand-text">
            TECH•FEST <span>2026</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav>
          <ul className="nav-links">
            <li>
              <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/events" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Calendar size={16} /> Explore Events
              </NavLink>
            </li>
            {isAuthenticated && (
              <li>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <LayoutDashboard size={16} /> My Passes
                </NavLink>
              </li>
            )}
            {isAdmin && (
              <li>
                <NavLink
                  to="/admin"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <ShieldCheck size={16} /> Admin Portal
                </NavLink>
              </li>
            )}
          </ul>
        </nav>

        {/* User / Auth Actions */}
        <div className="nav-actions">
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className="user-badge">
                <div className="user-avatar">
                  {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon size={14} />}
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  {user.name?.split(' ')[0]}
                </span>
                <span className={`role-pill ${user.role}`}>{user.role}</span>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-secondary btn-sm"
                title="Logout"
              >
                <LogOut size={15} />
                <span style={{ display: 'none' }}>Logout</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                <LogIn size={15} /> Login
              </Link>
              <Link to="/signup" className="btn btn-primary btn-sm">
                <UserPlus size={15} /> Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`mobile-nav-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <NavLink
          to="/"
          className="nav-link"
          onClick={() => setMobileMenuOpen(false)}
        >
          Home
        </NavLink>
        <NavLink
          to="/events"
          className="nav-link"
          onClick={() => setMobileMenuOpen(false)}
        >
          <Calendar size={18} /> Explore Events
        </NavLink>
        {isAuthenticated && (
          <NavLink
            to="/dashboard"
            className="nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            <LayoutDashboard size={18} /> My Passes & Registrations
          </NavLink>
        )}
        {isAdmin && (
          <NavLink
            to="/admin"
            className="nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            <ShieldCheck size={18} /> Admin Portal
          </NavLink>
        )}
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="btn btn-danger btn-sm"
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            <LogOut size={16} /> Logout ({user.name})
          </button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Link
              to="/login"
              className="btn btn-secondary"
              onClick={() => setMobileMenuOpen(false)}
            >
              <LogIn size={16} /> Login
            </Link>
            <Link
              to="/signup"
              className="btn btn-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              <UserPlus size={16} /> Create Student Account
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
