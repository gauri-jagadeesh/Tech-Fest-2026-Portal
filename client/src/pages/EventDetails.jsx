import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { eventsApi, registrationsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import RegisterModal from '../components/RegisterModal';
import TicketModal from '../components/TicketModal';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Award,
  ArrowLeft,
  CheckCircle,
  Share2,
  Mail,
  Phone,
  User,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

const EventDetails = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [userRegistration, setUserRegistration] = useState(null);

  // Modal States
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [latestRegistration, setLatestRegistration] = useState(null);
  const [isTicketOpen, setIsTicketOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    setLoading(true);
    try {
      const res = await eventsApi.getById(id);
      if (res.data && res.data.data) {
        setEvent(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load event details');
    } finally {
      setLoading(false);
    }
  };

  // Check if current user is registered
  useEffect(() => {
    if (isAuthenticated && id) {
      registrationsApi.getMy()
        .then((res) => {
          if (res.data && res.data.data) {
            const found = res.data.data.find(
              (r) => (r.event?._id || r.event) === id
            );
            if (found) {
              setIsRegistered(true);
              setUserRegistration(found);
            }
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated, id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleRegisterSuccess = (registration) => {
    setIsRegistered(true);
    setUserRegistration(registration);
    setLatestRegistration(registration);
    setIsTicketOpen(true);
    fetchEventDetails();
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 0' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(6, 182, 212, 0.2)',
            borderTopColor: 'var(--accent-cyan-light)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 1rem',
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: 'var(--text-secondary)' }}>Loading event arena details...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div className="glass-card" style={{ maxWidth: '500px', margin: '0 auto', padding: '3rem 2rem' }}>
          <AlertCircle size={48} color="#f43f5e" style={{ margin: '0 auto 1rem' }} />
          <h2>Event Not Found</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '1rem 0 1.5rem' }}>
            {error || 'The requested event does not exist or may have been unlisted.'}
          </p>
          <Link to="/events" className="btn btn-primary">
            <ArrowLeft size={16} /> Return to Events
          </Link>
        </div>
      </div>
    );
  }

  const percentFilled = Math.min(
    100,
    Math.round(((event.registeredCount || 0) / (event.capacity || 100)) * 100)
  );

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 6rem' }}>
      {/* Breadcrumb Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        <Link to="/" style={{ color: 'var(--text-secondary)' }}>Home</Link>
        <span>/</span>
        <Link to="/events" style={{ color: 'var(--text-secondary)' }}>Events</Link>
        <span>/</span>
        <span style={{ color: 'var(--accent-cyan-light)' }}>{event.title}</span>
      </div>

      {/* Main Grid: Details & Registration Card */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.1fr', gap: '2.5rem', alignItems: 'start' }}>
        {/* Left Column: Details & Rules */}
        <div>
          {/* Banner Image */}
          <div style={{ position: 'relative', height: '360px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '2rem', border: '1px solid var(--border-subtle)' }}>
            <img
              src={event.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80'}
              alt={event.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem' }}>
              <span className="badge badge-hackathon" style={{ fontSize: '0.85rem', padding: '0.4rem 0.9rem' }}>
                {event.category}
              </span>
            </div>
            <div style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem', background: 'rgba(7,9,14,0.9)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glow)' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent-amber)', fontWeight: 700 }}>
                Total Prize Pool
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
                {event.prizePool}
              </div>
            </div>
          </div>

          <h1 style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            {event.title}
          </h1>

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={18} color="var(--accent-cyan-light)" /> {event.date}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={18} color="var(--accent-cyan-light)" /> {event.time}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={18} color="var(--accent-cyan-light)" /> {event.venue}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={18} color="var(--accent-cyan-light)" /> {event.teamSize}
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.75rem' }}>About the Competition</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1rem', whiteSpace: 'pre-line' }}>
              {event.description}
            </p>
          </div>

          {/* Rules & Guidelines */}
          {event.rules && event.rules.length > 0 && (
            <div className="glass-card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck color="var(--accent-cyan-light)" size={22} /> Rules &amp; Regulations
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {event.rules.map((rule, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    <CheckCircle size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '3px' }} />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Column: Registration Card & Contacts */}
        <div style={{ position: 'sticky', top: '100px' }}>
          <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.5rem', border: '1px solid var(--border-glow)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Event Registration</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Registration Fee: <strong style={{ color: '#34d399' }}>{event.registrationFee || 'Free'}</strong>
            </p>

            {/* Capacity Progress */}
            <div style={{ marginBottom: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                <span>Registered: {event.registeredCount} / {event.capacity}</span>
                <span>{Math.max(0, event.capacity - event.registeredCount)} Spots Left</span>
              </div>
              <div className="progress-track" style={{ height: '8px' }}>
                <div className="progress-fill" style={{ width: `${percentFilled}%` }} />
              </div>
            </div>

            {/* Action Button */}
            {isRegistered ? (
              <div>
                <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '1rem', borderRadius: 'var(--radius-sm)', textAlign: 'center', marginBottom: '1rem' }}>
                  <div style={{ color: '#34d399', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                    ✓ You are registered!
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Ticket: <strong>{userRegistration?.ticketCode}</strong>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setLatestRegistration(userRegistration);
                    setIsTicketOpen(true);
                  }}
                  className="btn btn-secondary"
                  style={{ width: '100%' }}
                >
                  View My Digital Pass
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsRegisterOpen(true)}
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
                disabled={event.registeredCount >= event.capacity}
              >
                {event.registeredCount >= event.capacity ? 'Arena Capacity Full' : 'Register for Event'}
              </button>
            )}

            <button
              onClick={handleCopyLink}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', marginTop: '0.75rem' }}
            >
              <Share2 size={15} /> {copiedLink ? 'Link Copied to Clipboard!' : 'Share Event'}
            </button>
          </div>

          {/* Coordinator Information Card */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <User size={16} color="var(--accent-cyan-light)" /> Arena Coordinator
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <div><strong>Name:</strong> {event.coordinator?.name || 'TechFest Committee'}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Phone size={14} /> {event.coordinator?.phone || '+91 98765 43210'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Mail size={14} /> {event.coordinator?.email || 'events@techfest2026.com'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <RegisterModal
        event={event}
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccess={handleRegisterSuccess}
      />

      <TicketModal
        registration={latestRegistration}
        isOpen={isTicketOpen}
        onClose={() => setIsTicketOpen(false)}
      />
    </div>
  );
};

export default EventDetails;
