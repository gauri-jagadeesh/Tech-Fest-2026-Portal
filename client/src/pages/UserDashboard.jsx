import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { registrationsApi, usersApi } from '../services/api';
import TicketModal from '../components/TicketModal';
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  Trophy,
  User,
  School,
  Phone,
  Mail,
  Trash2,
  QrCode,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('passes'); // 'passes' | 'profile'
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [isTicketOpen, setIsTicketOpen] = useState(false);

  // Profile Edit State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    college: user?.college || '',
    phone: user?.phone || '',
  });
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const res = await registrationsApi.getMy();
      if (res.data && res.data.data) {
        setRegistrations(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRegistration = async (id, eventTitle) => {
    if (!window.confirm(`Are you sure you want to cancel your registration for "${eventTitle}"? Your reserved spot will be released.`)) {
      return;
    }

    try {
      await registrationsApi.cancel(id);
      setRegistrations(registrations.filter((r) => r._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel registration');
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileSuccess('');
    setProfileError('');

    try {
      const res = await usersApi.updateProfile(profileForm);
      if (res.data && res.data.success) {
        updateUser(res.data.data);
        setProfileSuccess('Profile details updated successfully!');
        setTimeout(() => setProfileSuccess(''), 4000);
      }
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem 6rem' }}>
      {/* Dashboard Top Header */}
      <div className="glass-card" style={{ padding: '2.5rem', marginBottom: '2.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                background: 'var(--gradient-cyber)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                fontWeight: 800,
                color: '#fff',
                boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)',
              }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{user?.name}</h1>
                <span className={`role-pill ${user?.role}`}>{user?.role}</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                {user?.college || 'Institute Student'} • {user?.email}
              </p>
            </div>
          </div>

          <Link to="/events" className="btn btn-primary">
            <Ticket size={16} /> Register for More Events
          </Link>
        </div>

        {/* Dashboard Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Registered Events</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-cyan-light)' }}>
              {registrations.length}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Confirmed Passes</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399' }}>
              {registrations.filter((r) => r.status === 'Confirmed').length}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Festival Year</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f59e0b' }}>
              2026
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === 'passes' ? 'active' : ''}`}
          onClick={() => setActiveTab('passes')}
        >
          <Ticket size={18} /> My Festival Passes ({registrations.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <User size={18} /> Profile Settings
        </button>
      </div>

      {/* Tab 1: Passes & Registrations */}
      {activeTab === 'passes' && (
        <div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <div style={{ width: '36px', height: '36px', border: '3px solid rgba(6,182,212,0.2)', borderTopColor: 'var(--accent-cyan-light)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <p style={{ color: 'var(--text-secondary)' }}>Loading your tickets...</p>
            </div>
          ) : registrations.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
              {registrations.map((reg) => {
                const evt = reg.event || {};
                return (
                  <div key={reg._id} className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <span className="badge badge-coding">{evt.category || 'Event'}</span>
                      <span className="ticket-code" style={{ fontSize: '0.85rem' }}>
                        {reg.ticketCode}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                      {evt.title || 'Event Pass'}
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Calendar size={15} color="var(--accent-cyan-light)" /> {evt.date || 'March 2026'}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock size={15} color="var(--accent-cyan-light)" /> {evt.time || '10:00 AM'}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <MapPin size={15} color="var(--accent-cyan-light)" /> {evt.venue || 'Campus'}
                      </div>
                      {reg.teamName && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <User size={15} color="var(--accent-cyan-light)" /> Team: {reg.teamName}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                      <button
                        onClick={() => {
                          setSelectedRegistration(reg);
                          setIsTicketOpen(true);
                        }}
                        className="btn btn-primary btn-sm"
                        style={{ flex: 1 }}
                      >
                        <QrCode size={15} /> View QR Badge
                      </button>
                      <button
                        onClick={() => handleCancelRegistration(reg._id, evt.title)}
                        className="btn btn-danger btn-sm"
                        title="Cancel Registration"
                      >
                        <Trash2 size={15} /> Cancel
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
              <Ticket size={48} color="var(--accent-cyan-light)" style={{ margin: '0 auto 1rem' }} />
              <h3>No Event Registrations Yet</h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
                You haven't registered for any Tech-Fest 2026 events. Browse the competitions and reserve your spot!
              </p>
              <Link to="/events" className="btn btn-primary">
                Explore All Competitions
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Profile Settings */}
      {activeTab === 'profile' && (
        <div className="glass-card" style={{ maxWidth: '600px', padding: '2.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>Student Profile Information</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
            Ensure your details are accurate for physical badge printing and event team certificates.
          </p>

          {profileSuccess && (
            <div className="form-success">
              <CheckCircle2 size={18} /> {profileSuccess}
            </div>
          )}
          {profileError && (
            <div className="form-error">
              <AlertCircle size={18} /> {profileError}
            </div>
          )}

          <form onSubmit={handleProfileSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-with-icon">
                <User className="input-icon" size={18} />
                <input
                  type="text"
                  className="form-input"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address (Immutable)</label>
              <div className="input-with-icon">
                <Mail className="input-icon" size={18} />
                <input
                  type="email"
                  className="form-input"
                  value={user?.email || ''}
                  disabled
                  style={{ opacity: 0.6, cursor: 'not-allowed' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">College / University</label>
              <div className="input-with-icon">
                <School className="input-icon" size={18} />
                <input
                  type="text"
                  className="form-input"
                  value={profileForm.college}
                  onChange={(e) => setProfileForm({ ...profileForm, college: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <div className="input-with-icon">
                <Phone className="input-icon" size={18} />
                <input
                  type="tel"
                  className="form-input"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ marginTop: '0.75rem' }}
              disabled={profileLoading}
            >
              {profileLoading ? 'Updating Profile...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>
      )}

      {/* Ticket QR Modal */}
      <TicketModal
        registration={selectedRegistration}
        isOpen={isTicketOpen}
        onClose={() => setIsTicketOpen(false)}
      />
    </div>
  );
};

export default UserDashboard;
