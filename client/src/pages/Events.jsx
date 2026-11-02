import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { eventsApi, registrationsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import EventCard from '../components/EventCard';
import RegisterModal from '../components/RegisterModal';
import TicketModal from '../components/TicketModal';
import { Search, Filter, Calendar, Terminal } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Hackathon',
  'Coding',
  'Robotics',
  'Gaming',
  'AI & Data',
  'Paper Presentation',
  'Workshop',
];

const Events = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const { isAuthenticated } = useAuth();
  const [events, setEvents] = useState([]);
  const [registeredEventIds, setRegisteredEventIds] = useState(new Set());
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal States
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [latestRegistration, setLatestRegistration] = useState(null);
  const [isTicketOpen, setIsTicketOpen] = useState(false);

  // Fetch events based on category & search
  useEffect(() => {
    fetchEvents();
  }, [selectedCategory]);

  // Fetch user's registered events if logged in to show "Registered" status
  useEffect(() => {
    if (isAuthenticated) {
      registrationsApi.getMy()
        .then((res) => {
          if (res.data && res.data.data) {
            const ids = new Set(res.data.data.map((r) => r.event?._id || r.event));
            setRegisteredEventIds(ids);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory !== 'All') {
        params.category = selectedCategory;
      }
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }
      const res = await eventsApi.getAll(params);
      if (res.data && res.data.data) {
        setEvents(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEvents();
  };

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const handleOpenRegister = (event) => {
    setSelectedEvent(event);
    setIsRegisterOpen(true);
  };

  const handleRegisterSuccess = (registration) => {
    setRegisteredEventIds((prev) => new Set([...prev, registration.event?._id || registration.event]));
    setLatestRegistration(registration);
    setIsTicketOpen(true);
    // Refresh count on events
    fetchEvents();
  };

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem 6rem' }}>
      {/* Header */}
      <div className="section-header" style={{ textAlign: 'left', marginBottom: '2.5rem' }}>
        <span className="section-tag">Explore &amp; Compete</span>
        <h1 className="section-title">Festival Competitions &amp; Arenas</h1>
        <p className="section-subtitle" style={{ marginLeft: 0 }}>
          Find your challenge, register with your team, and download your verified entry tickets.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <form onSubmit={handleSearchSubmit} className="search-box">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search by title, keywords, tags, or venue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <div className="category-pills">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => handleCategorySelect(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
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
          <p style={{ color: 'var(--text-secondary)' }}>Searching arenas...</p>
        </div>
      ) : events.length > 0 ? (
        <div className="events-grid">
          {events.map((evt) => (
            <EventCard
              key={evt._id}
              event={evt}
              onRegister={handleOpenRegister}
              isRegistered={registeredEventIds.has(evt._id)}
            />
          ))}
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <Terminal size={48} color="var(--accent-cyan-light)" style={{ margin: '0 auto 1rem' }} />
          <h3>No Events Found</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
            No competitions match "{searchQuery || selectedCategory}". Try clearing search filters.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
              fetchEvents();
            }}
            className="btn btn-secondary"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Modals */}
      <RegisterModal
        event={selectedEvent}
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

export default Events;
