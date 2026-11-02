import React, { useState, useEffect } from 'react';
import { eventsApi } from '../services/api';
import { X, AlertCircle } from 'lucide-react';

const CATEGORIES = [
  'Hackathon',
  'Coding',
  'Robotics',
  'Gaming',
  'AI & Data',
  'Paper Presentation',
  'Workshop',
];

const EventFormModal = ({ event, isOpen, onClose, onSuccess }) => {
  const isEditing = !!event?._id;

  const [formData, setFormData] = useState({
    title: '',
    category: 'Hackathon',
    shortDescription: '',
    description: '',
    date: 'March 15, 2026',
    time: '10:00 AM - 04:00 PM',
    venue: 'Convention Hall & Innovation Arena',
    teamSize: '1 - 4 Members',
    prizePool: '₹50,000',
    capacity: 100,
    status: 'Open',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    rules: '',
    coordinatorName: 'Aryan Sharma',
    coordinatorPhone: '+91 98765 43210',
    coordinatorEmail: 'events@techfest2026.com',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        category: event.category || 'Hackathon',
        shortDescription: event.shortDescription || '',
        description: event.description || '',
        date: event.date || 'March 15, 2026',
        time: event.time || '10:00 AM - 04:00 PM',
        venue: event.venue || 'Main Auditorium',
        teamSize: event.teamSize || '1 - 4 Members',
        prizePool: event.prizePool || '₹50,000',
        capacity: event.capacity || 100,
        status: event.status || 'Open',
        image: event.image || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
        rules: Array.isArray(event.rules) ? event.rules.join('\n') : (event.rules || ''),
        coordinatorName: event.coordinator?.name || 'TechFest Committee',
        coordinatorPhone: event.coordinator?.phone || '+91 98765 43210',
        coordinatorEmail: event.coordinator?.email || 'events@techfest2026.com',
      });
    } else {
      setFormData({
        title: '',
        category: 'Hackathon',
        shortDescription: '',
        description: '',
        date: 'March 15, 2026',
        time: '10:00 AM - 04:00 PM',
        venue: 'Main Campus Hall',
        teamSize: '1 - 4 Members',
        prizePool: '₹50,000',
        capacity: 100,
        status: 'Open',
        image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
        rules: 'Valid College ID required.\nBring your own laptops.\nJudges decision is final.',
        coordinatorName: 'Aryan Sharma',
        coordinatorPhone: '+91 98765 43210',
        coordinatorEmail: 'events@techfest2026.com',
      });
    }
  }, [event, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      title: formData.title,
      category: formData.category,
      shortDescription: formData.shortDescription,
      description: formData.description,
      date: formData.date,
      time: formData.time,
      venue: formData.venue,
      teamSize: formData.teamSize,
      prizePool: formData.prizePool,
      capacity: Number(formData.capacity),
      status: formData.status,
      image: formData.image,
      rules: formData.rules.split('\n').filter((r) => r.trim() !== ''),
      coordinator: {
        name: formData.coordinatorName,
        phone: formData.coordinatorPhone,
        email: formData.coordinatorEmail,
      },
    };

    try {
      let res;
      if (isEditing) {
        res = await eventsApi.update(event._id, payload);
      } else {
        res = await eventsApi.create(payload);
      }

      if (res.data && res.data.success) {
        onSuccess(res.data.data);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="section-tag">{isEditing ? 'Update Event' : 'Create New Event'}</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
              {isEditing ? `Edit: ${event.title}` : 'Add Tech-Fest 2026 Event'}
            </h3>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close form">
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="form-error">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Event Title *</label>
              <input
                type="text"
                name="title"
                className="form-input"
                style={{ paddingLeft: '1rem' }}
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. RoboWars Mecha Clash"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                name="category"
                className="form-input"
                style={{ paddingLeft: '1rem' }}
                value={formData.category}
                onChange={handleChange}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Short Tagline Description *</label>
            <input
              type="text"
              name="shortDescription"
              className="form-input"
              style={{ paddingLeft: '1rem' }}
              value={formData.shortDescription}
              onChange={handleChange}
              placeholder="Brief 1-line summary for event cards"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Full Event Description *</label>
            <textarea
              name="description"
              className="form-input"
              style={{ padding: '0.75rem 1rem', height: '90px', resize: 'vertical' }}
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed breakdown of the tournament, scoring, criteria..."
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Date *</label>
              <input
                type="text"
                name="date"
                className="form-input"
                style={{ paddingLeft: '1rem' }}
                value={formData.date}
                onChange={handleChange}
                placeholder="e.g. March 15, 2026"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Time Slot *</label>
              <input
                type="text"
                name="time"
                className="form-input"
                style={{ paddingLeft: '1rem' }}
                value={formData.time}
                onChange={handleChange}
                placeholder="e.g. 10:00 AM - 04:00 PM"
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Venue *</label>
              <input
                type="text"
                name="venue"
                className="form-input"
                style={{ paddingLeft: '1rem' }}
                value={formData.venue}
                onChange={handleChange}
                placeholder="e.g. CS Lab 3"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Prize Pool *</label>
              <input
                type="text"
                name="prizePool"
                className="form-input"
                style={{ paddingLeft: '1rem' }}
                value={formData.prizePool}
                onChange={handleChange}
                placeholder="e.g. ₹50,000"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Total Capacity *</label>
              <input
                type="number"
                name="capacity"
                className="form-input"
                style={{ paddingLeft: '1rem' }}
                value={formData.capacity}
                onChange={handleChange}
                min="10"
                max="1000"
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Team Size</label>
              <input
                type="text"
                name="teamSize"
                className="form-input"
                style={{ paddingLeft: '1rem' }}
                value={formData.teamSize}
                onChange={handleChange}
                placeholder="e.g. 2 - 4 Members"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Registration Status</label>
              <select
                name="status"
                className="form-input"
                style={{ paddingLeft: '1rem' }}
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Open">Open</option>
                <option value="Closing Soon">Closing Soon</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Banner Image URL</label>
            <input
              type="url"
              name="image"
              className="form-input"
              style={{ paddingLeft: '1rem' }}
              value={formData.image}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Rules & Regulations (one rule per line)</label>
            <textarea
              name="rules"
              className="form-input"
              style={{ padding: '0.75rem 1rem', height: '80px', resize: 'vertical' }}
              value={formData.rules}
              onChange={handleChange}
              placeholder="College ID card mandatory&#10;No pre-written solutions&#10;Team must present live demo"
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1.5 }} disabled={loading}>
              {loading ? 'Saving Event...' : (isEditing ? 'Save Changes' : 'Publish Event')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventFormModal;
