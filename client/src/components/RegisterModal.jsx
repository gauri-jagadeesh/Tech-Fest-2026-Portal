import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { registrationsApi } from '../services/api';
import confetti from 'canvas-confetti';
import { X, Users, Plus, Trash2, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const RegisterModal = ({ event, isOpen, onClose, onSuccess }) => {
  const { user, isAuthenticated } = useAuth();
  const [teamName, setTeamName] = useState(user ? `${user.name}'s Team` : '');
  const [teamMembers, setTeamMembers] = useState([
    { name: user?.name || '', email: user?.email || '', college: user?.college || '' },
  ]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !event) return null;

  const handleAddMember = () => {
    if (teamMembers.length >= 4) {
      setError('Maximum 4 members allowed per team');
      return;
    }
    setTeamMembers([...teamMembers, { name: '', email: '', college: '' }]);
  };

  const handleRemoveMember = (index) => {
    if (teamMembers.length === 1) return;
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const handleMemberChange = (index, field, value) => {
    const updated = [...teamMembers];
    updated[index][field] = value;
    setTeamMembers(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isAuthenticated) {
      setError('Please login or create an account to complete registration');
      return;
    }

    setLoading(true);
    try {
      const res = await registrationsApi.register({
        eventId: event._id,
        teamName,
        teamMembers,
        notes,
      });

      if (res.data && res.data.success) {
        // Trigger celebratory confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#6366f1', '#a855f7', '#10b981'],
        });

        onSuccess(res.data.data);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="section-tag">Event Registration</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{event.title}</h3>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            <X size={22} />
          </button>
        </div>

        {!isAuthenticated ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <AlertCircle size={48} color="#f59e0b" style={{ margin: '0 auto 1rem' }} />
            <h4 style={{ marginBottom: '0.5rem' }}>Authentication Required</h4>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              You must be signed in with your student credentials to reserve a spot for Tech-Fest 2026 events.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link to="/login" className="btn btn-secondary" onClick={onClose}>
                Sign In
              </Link>
              <Link to="/signup" className="btn btn-primary" onClick={onClose}>
                Create Account
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="form-error">
                <AlertCircle size={18} /> {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Team / Participant Name</label>
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '1rem' }}
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g. CyberKnights or Solo"
                required
              />
            </div>

            {/* Team Members List */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>
                  Team Members ({teamMembers.length} of max 4)
                </label>
                <button
                  type="button"
                  onClick={handleAddMember}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '0.25rem 0.65rem', fontSize: '0.8rem' }}
                >
                  <Plus size={14} /> Add Teammate
                </button>
              </div>

              {teamMembers.map((member, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 1.2fr 1fr auto',
                    gap: '0.5rem',
                    marginBottom: '0.6rem',
                    background: 'rgba(255,255,255,0.02)',
                    padding: '0.6rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    alignItems: 'center',
                  }}
                >
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="form-input"
                    style={{ padding: '0.5rem 0.75rem' }}
                    value={member.name}
                    onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="form-input"
                    style={{ padding: '0.5rem 0.75rem' }}
                    value={member.email}
                    onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="College / Dept"
                    className="form-input"
                    style={{ padding: '0.5rem 0.75rem' }}
                    value={member.college}
                    onChange={(e) => handleMemberChange(idx, 'college', e.target.value)}
                  />
                  {teamMembers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(idx)}
                      className="btn btn-danger btn-sm"
                      style={{ padding: '0.45rem' }}
                      title="Remove member"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="form-group">
              <label className="form-label">Special Requests or Lab Access Notes</label>
              <textarea
                className="form-input"
                style={{ padding: '0.75rem 1rem', height: '70px', resize: 'vertical' }}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Bringing custom microcontroller or hardware kits..."
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ flex: 1 }}
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ flex: 1.5 }}
                disabled={loading}
              >
                {loading ? 'Confirming...' : 'Confirm Registration'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterModal;
