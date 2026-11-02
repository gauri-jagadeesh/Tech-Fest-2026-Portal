import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, Award, ArrowRight } from 'lucide-react';

const getCategoryBadgeClass = (category) => {
  switch (category) {
    case 'Hackathon': return 'badge-hackathon';
    case 'Coding': return 'badge-coding';
    case 'Robotics': return 'badge-robotics';
    case 'Gaming': return 'badge-gaming';
    case 'AI & Data': return 'badge-ai';
    default: return 'badge-default';
  }
};

const EventCard = ({ event, onRegister, isRegistered }) => {
  const percentFilled = Math.min(
    100,
    Math.round(((event.registeredCount || 0) / (event.capacity || 100)) * 100)
  );

  return (
    <div className="glass-card event-card">
      {/* Event Image & Badge Overlays */}
      <div className="event-card-img-wrap">
        <img
          src={event.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'}
          alt={event.title}
          className="event-card-img"
          loading="lazy"
        />
        <div className="event-badge-overlay">
          <span className={`badge ${getCategoryBadgeClass(event.category)}`}>
            {event.category}
          </span>
        </div>
        <div className="event-prize-overlay">
          <Award size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
          {event.prizePool}
        </div>
      </div>

      {/* Card Content */}
      <div className="event-card-body">
        <h3 className="event-card-title">{event.title}</h3>
        <p className="event-card-desc">
          {event.shortDescription || event.description?.substring(0, 120) + '...'}
        </p>

        {/* Metadata List */}
        <div className="event-meta-list">
          <div className="event-meta-item">
            <Calendar size={15} />
            <span>{event.date}</span>
          </div>
          <div className="event-meta-item">
            <Clock size={15} />
            <span>{event.time}</span>
          </div>
          <div className="event-meta-item">
            <MapPin size={15} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {event.venue}
            </span>
          </div>
          <div className="event-meta-item">
            <Users size={15} />
            <span>Team: {event.teamSize}</span>
          </div>
        </div>

        {/* Capacity / Slots Remaining Bar */}
        <div className="event-capacity-bar">
          <div className="capacity-info">
            <span>Seats: {event.registeredCount} / {event.capacity}</span>
            <span>{Math.max(0, event.capacity - event.registeredCount)} Spots Left</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${percentFilled}%` }} />
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="event-card-footer">
          <Link
            to={`/events/${event._id}`}
            className="btn btn-secondary btn-sm"
            style={{ flex: 1 }}
          >
            Details <ArrowRight size={14} />
          </Link>
          {isRegistered ? (
            <button className="btn btn-sm" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7', border: '1px solid rgba(16, 185, 129, 0.4)', flex: 1.2 }} disabled>
              ✓ Registered
            </button>
          ) : (
            <button
              onClick={() => onRegister(event)}
              className="btn btn-primary btn-sm"
              style={{ flex: 1.2 }}
              disabled={event.registeredCount >= event.capacity}
            >
              {event.registeredCount >= event.capacity ? 'Full' : 'Register'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
