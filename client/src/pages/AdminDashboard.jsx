import React, { useState, useEffect } from 'react';
import { eventsApi, registrationsApi, usersApi } from '../services/api';
import EventFormModal from '../components/EventFormModal';
import {
  ShieldCheck,
  Plus,
  Edit2,
  Trash2,
  Users,
  Calendar,
  Ticket,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  Award,
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('events'); // 'events' | 'registrations' | 'users'
  const [stats, setStats] = useState({ totalUsers: 0, totalEvents: 0, totalRegistrations: 0 });
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Event modal state
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  // Registration filter state
  const [selectedEventFilter, setSelectedEventFilter] = useState('');

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [eventsRes, regRes, usersRes] = await Promise.all([
        eventsApi.getAll(),
        registrationsApi.getAll(),
        usersApi.getAll(),
      ]);

      if (eventsRes.data?.data) setEvents(eventsRes.data.data);
      if (regRes.data?.data) setRegistrations(regRes.data.data);
      if (usersRes.data?.data) setUsers(usersRes.data.data);
      if (usersRes.data?.stats) setStats(usersRes.data.stats);
    } catch (err) {
      console.error('Failed to load admin portal data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Event Handlers
  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setIsEventModalOpen(true);
  };

  const handleEditEvent = (evt) => {
    setSelectedEvent(evt);
    setIsEventModalOpen(true);
  };

  const handleDeleteEvent = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete event "${title}"? This will permanently remove the event and all associated registrations.`)) {
      return;
    }

    try {
      await eventsApi.delete(id);
      setEvents(events.filter((e) => e._id !== id));
      loadAllData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete event');
    }
  };

  const handleEventSaved = (savedEvent) => {
    loadAllData();
  };

  // Registration Handlers
  const handleToggleRegistrationStatus = async (regId, currentStatus) => {
    const newStatus = currentStatus === 'Confirmed' ? 'Cancelled' : 'Confirmed';
    try {
      await registrationsApi.updateStatus(regId, newStatus);
      setRegistrations(
        registrations.map((r) => (r._id === regId ? { ...r, status: newStatus } : r))
      );
    } catch (err) {
      alert('Failed to update registration status');
    }
  };

  const filteredRegistrations = selectedEventFilter
    ? registrations.filter((r) => (r.event?._id || r.event) === selectedEventFilter)
    : registrations;

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem 6rem' }}>
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <span className="section-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <ShieldCheck size={16} /> Festival Operations Center
          </span>
          <h1 className="section-title" style={{ marginBottom: '0.25rem' }}>
            Tech-Fest 2026 Admin Portal
          </h1>
          <p className="section-subtitle" style={{ marginLeft: 0 }}>
            Real-time event administration, registration quotas, and delegate management.
          </p>
        </div>

        <button onClick={handleCreateEvent} className="btn btn-primary">
          <Plus size={18} /> Create New Event
        </button>
      </div>

      {/* Metric Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Total Registered Users</span>
            <Users size={18} color="var(--accent-cyan-light)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {stats.totalUsers || users.length}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Active Competitions</span>
            <Calendar size={18} color="var(--accent-indigo)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {stats.totalEvents || events.length}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Total Delegations</span>
            <Ticket size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {stats.totalRegistrations || registrations.length}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Total Cash Prize Pool</span>
            <Award size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b' }}>
            ₹5,00,000+
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          <Calendar size={18} /> Manage Events ({events.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'registrations' ? 'active' : ''}`}
          onClick={() => setActiveTab('registrations')}
        >
          <Ticket size={18} /> Manage Registrations ({registrations.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={18} /> Attendees &amp; Users ({users.length})
        </button>
      </div>

      {/* TAB 1: Events Management */}
      {activeTab === 'events' && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Active Festival Competitions</h3>
            <button onClick={handleCreateEvent} className="btn btn-primary btn-sm">
              <Plus size={15} /> Add Competition
            </button>
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Event Title</th>
                  <th>Track</th>
                  <th>Date &amp; Venue</th>
                  <th>Capacity</th>
                  <th>Prize Pool</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((evt) => (
                  <tr key={evt._id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{evt.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Team: {evt.teamSize}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-coding">{evt.category}</span>
                    </td>
                    <td>
                      <div>{evt.date}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{evt.venue}</div>
                    </td>
                    <td>
                      <div>
                        <strong>{evt.registeredCount}</strong> / {evt.capacity}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {Math.max(0, evt.capacity - evt.registeredCount)} open
                      </div>
                    </td>
                    <td style={{ color: 'var(--accent-amber)', fontWeight: 700 }}>
                      {evt.prizePool}
                    </td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          background: evt.status === 'Open' ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.15)',
                          color: evt.status === 'Open' ? '#34d399' : '#fda4af',
                        }}
                      >
                        {evt.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleEditEvent(evt)}
                          className="btn btn-secondary btn-sm"
                          title="Edit Event"
                          style={{ padding: '0.35rem 0.65rem' }}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(evt._id, evt.title)}
                          className="btn btn-danger btn-sm"
                          title="Delete Event"
                          style={{ padding: '0.35rem 0.65rem' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Registrations Management */}
      {activeTab === 'registrations' && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
              All Registrations ({filteredRegistrations.length})
            </h3>

            {/* Filter by event */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Filter by Arena:</label>
              <select
                className="form-input"
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                value={selectedEventFilter}
                onChange={(e) => setSelectedEventFilter(e.target.value)}
              >
                <option value="">All Competitions</option>
                {events.map((e) => (
                  <option key={e._id} value={e._id}>
                    {e.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ticket Code</th>
                  <th>Attendee Name</th>
                  <th>Event Arena</th>
                  <th>Team Info</th>
                  <th>Status</th>
                  <th>Registration Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistrations.length > 0 ? (
                  filteredRegistrations.map((reg) => (
                    <tr key={reg._id}>
                      <td>
                        <span className="ticket-code" style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem' }}>
                          {reg.ticketCode}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{reg.user?.name || 'Registered User'}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {reg.user?.email} • {reg.user?.college}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{reg.event?.title || 'Event'}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {reg.event?.category} • {reg.event?.date}
                        </div>
                      </td>
                      <td>
                        <div>{reg.teamName || 'Solo'}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {reg.teamMembers?.length || 1} Member(s)
                        </div>
                      </td>
                      <td>
                        <span
                          className="badge"
                          style={{
                            background: reg.status === 'Confirmed' ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.15)',
                            color: reg.status === 'Confirmed' ? '#34d399' : '#fda4af',
                          }}
                        >
                          {reg.status}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {new Date(reg.registeredAt || reg.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <button
                          onClick={() => handleToggleRegistrationStatus(reg._id, reg.status)}
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                        >
                          {reg.status === 'Confirmed' ? 'Mark Cancelled' : 'Confirm'}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      No registrations found for selected filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Users Directory */}
      {activeTab === 'users' && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Registered System Users ({users.length})
          </h3>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>College / Institution</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td style={{ fontWeight: 600 }}>{u.name}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                    <td>{u.college || '—'}</td>
                    <td>{u.phone || '—'}</td>
                    <td>
                      <span className={`role-pill ${u.role}`}>{u.role}</span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Event Create / Edit Modal */}
      <EventFormModal
        event={selectedEvent}
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onSuccess={handleEventSaved}
      />
    </div>
  );
};

export default AdminDashboard;
