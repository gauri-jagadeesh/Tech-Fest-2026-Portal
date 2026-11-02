import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { healthApi } from '../services/api';
import { Sparkles, Terminal, Shield, Github, Heart, Activity } from 'lucide-react';

const Footer = () => {
  const [apiHealth, setApiHealth] = useState('checking');

  useEffect(() => {
    healthApi.check()
      .then((res) => {
        if (res.data && res.data.status === 'ok') {
          setApiHealth('healthy');
        } else {
          setApiHealth('degraded');
        }
      })
      .catch(() => {
        setApiHealth('offline');
      });
  }, []);

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-col">
            <div className="nav-brand" style={{ marginBottom: '1rem' }}>
              <div className="nav-logo-icon">
                <Sparkles size={20} />
              </div>
              <div className="nav-brand-text">
                TECH•FEST <span>2026</span>
              </div>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: '320px' }}>
              The premier national science and technological symposium. Uniting developers, designers, and robotics engineers to engineer the next frontier.
            </p>
            {/* Live API Health indicator */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.04)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)', fontSize: '0.78rem' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: apiHealth === 'healthy' ? '#10b981' : (apiHealth === 'checking' ? '#f59e0b' : '#f43f5e'),
                  boxShadow: apiHealth === 'healthy' ? '0 0 8px #10b981' : 'none',
                }}
              />
              <span style={{ color: 'var(--text-secondary)' }}>
                Backend API: <strong>{apiHealth === 'healthy' ? 'Online (Render / Local)' : (apiHealth === 'checking' ? 'Connecting...' : 'Standby')}</strong>
              </span>
            </div>
          </div>

          {/* Categories */}
          <div className="footer-col">
            <h4>Competitions</h4>
            <ul className="footer-links">
              <li><Link to="/events?category=Hackathon">National Hackathon</Link></li>
              <li><Link to="/events?category=Coding">CodeSprint Extreme</Link></li>
              <li><Link to="/events?category=Robotics">RoboWars Combat</Link></li>
              <li><Link to="/events?category=AI & Data">NeuralCon AI Summit</Link></li>
              <li><Link to="/events?category=Gaming">Valorant Titan Series</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Quick Access</h4>
            <ul className="footer-links">
              <li><Link to="/">Home Overview</Link></li>
              <li><Link to="/events">All Events</Link></li>
              <li><Link to="/dashboard">Registration Passes</Link></li>
              <li><Link to="/login">Student Portal</Link></li>
              <li><a href="/api/health" target="_blank" rel="noreferrer">Render Health Check</a></li>
            </ul>
          </div>

          {/* Tech Stack Info */}
          <div className="footer-col">
            <h4>Architecture</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
              Built with the MERN Stack: MongoDB Atlas, Express.js, React, Node.js, Vite, deployed on Render &amp; Netlify.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-coding">MongoDB Atlas</span>
              <span className="badge badge-hackathon">Express API</span>
              <span className="badge badge-ai">React + Vite</span>
              <span className="badge badge-robotics">Render + Netlify</span>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div>
            &copy; 2026 Tech-Fest Organizing Committee. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            Built for Excellence with Full MERN Architecture
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
