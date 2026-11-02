import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventsApi } from '../services/api';
import CountdownTimer from '../components/CountdownTimer';
import EventCard from '../components/EventCard';
import RegisterModal from '../components/RegisterModal';
import TicketModal from '../components/TicketModal';
import {
  Sparkles,
  Terminal,
  Cpu,
  Trophy,
  Flame,
  Gamepad2,
  BrainCircuit,
  ArrowRight,
  ShieldAlert,
  Calendar,
  CheckCircle2,
  Users,
} from 'lucide-react';

const Home = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [latestRegistration, setLatestRegistration] = useState(null);
  const [isTicketOpen, setIsTicketOpen] = useState(false);

  useEffect(() => {
    eventsApi
      .getAll({ featured: 'true' })
      .then((res) => {
        if (res.data && res.data.data) {
          setFeaturedEvents(res.data.data.slice(0, 3));
        }
      })
      .catch((err) => {
        console.warn('Could not load featured events from API:', err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleOpenRegister = (event) => {
    setSelectedEvent(event);
    setIsRegisterOpen(true);
  };

  const handleRegisterSuccess = (registration) => {
    setLatestRegistration(registration);
    setIsTicketOpen(true);
  };

  const categories = [
    { name: 'Hackathons', icon: <Terminal size={24} />, desc: '36-hour sprint solving real industry problems', color: 'var(--accent-purple)' },
    { name: 'Competitive Coding', icon: <Cpu size={24} />, desc: 'Algorithmic battles and data structure duels', color: 'var(--accent-cyan-light)' },
    { name: 'Robotics Combat', icon: <Flame size={24} />, desc: 'Pneumatic flippers & spinning weapon mechas', color: 'var(--accent-amber)' },
    { name: 'AI & Data Science', icon: <BrainCircuit size={24} />, desc: 'LLM agents, computer vision, and neural nets', color: 'var(--accent-emerald)' },
    { name: 'Esports Championship', icon: <Gamepad2 size={24} />, desc: 'LAN tournaments in Valorant and Rocket League', color: 'var(--accent-rose)' },
    { name: 'Tech Workshops', icon: <Sparkles size={24} />, desc: 'Cloud, Web3, and container masterclasses', color: 'var(--accent-indigo)' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-pill">
            <Sparkles size={16} /> ANNUAL NATIONAL TECH FESTIVAL • MARCH 14-16, 2026
          </div>
          <h1 className="hero-title">
            INNOVATE. CODE. <span className="text-gradient">ELEVATE.</span>
          </h1>
          <p className="hero-subtitle">
            Step into the epicenter of technological breakthrough. Over 5,000 developers, roboticists, and creative thinkers gather for India's premier collegiate engineering celebration.
          </p>

          <div className="hero-buttons">
            <Link to="/events" className="btn btn-primary btn-lg">
              Explore All Events <ArrowRight size={18} />
            </Link>
            <Link to="/signup" className="btn btn-secondary btn-lg">
              Create Student Pass
            </Link>
          </div>

          {/* Countdown Clock */}
          <div style={{ marginTop: '3rem' }}>
            <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 700 }}>
              Festival Kickoff Countdown
            </div>
            <CountdownTimer targetDate="2026-03-14T09:00:00" />
          </div>

          {/* Stats Bar */}
          <div className="stats-grid">
            <div className="glass-card stat-card">
              <div className="stat-icon"><Users size={24} /></div>
              <div className="stat-value text-gradient">5,000+</div>
              <div className="stat-desc">Collegiate Attendees</div>
            </div>
            <div className="glass-card stat-card">
              <div className="stat-icon"><Trophy size={24} /></div>
              <div className="stat-value text-gradient">₹5,00,000</div>
              <div className="stat-desc">Total Cash Prize Pool</div>
            </div>
            <div className="glass-card stat-card">
              <div className="stat-icon"><Terminal size={24} /></div>
              <div className="stat-value text-gradient">15+ Arenas</div>
              <div className="stat-desc">Flagship Tech Contests</div>
            </div>
            <div className="glass-card stat-card">
              <div className="stat-icon"><Sparkles size={24} /></div>
              <div className="stat-value text-gradient">60+ Colleges</div>
              <div className="stat-desc">Nationwide Representation</div>
            </div>
          </div>
        </div>
      </section>

      {/* Flagship Domains / Categories */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Diverse Tracks</span>
            <h2 className="section-title">Battlegrounds of Innovation</h2>
            <p className="section-subtitle">
              Choose your arena. From low-level memory optimizations to bulletproof combat mechatronics.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {categories.map((cat, i) => (
              <Link to={`/events?category=${cat.name.split(' ')[0]}`} key={i} className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', textDecoration: 'none' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: cat.color }}>
                  {cat.icon}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>{cat.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', flex: 1 }}>{cat.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-cyan-light)', fontSize: '0.85rem', fontWeight: 600 }}>
                  Browse Events <ArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events Showcase */}
      <section style={{ padding: '4rem 0 6rem', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Flagship Competitions</span>
            <h2 className="section-title">Featured Highlights</h2>
            <p className="section-subtitle">
              Reserve your slot early. High-demand arenas fill quickly due to venue capacity constraints.
            </p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ width: '40px', height: '40px', border: '3px solid rgba(6,182,212,0.2)', borderTopColor: 'var(--accent-cyan-light)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <p style={{ color: 'var(--text-secondary)' }}>Loading flagship events...</p>
            </div>
          ) : featuredEvents.length > 0 ? (
            <div className="events-grid">
              {featuredEvents.map((evt) => (
                <EventCard key={evt._id} event={evt} onRegister={handleOpenRegister} />
              ))}
            </div>
          ) : (
            <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
              <Terminal size={40} color="var(--accent-cyan-light)" style={{ margin: '0 auto 1rem' }} />
              <h3>Events Initializing</h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
                Explore the complete catalogue on our events directory.
              </p>
              <Link to="/events" className="btn btn-primary">Browse All Events</Link>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <Link to="/events" className="btn btn-secondary btn-lg">
              View All 15+ Events &amp; Workshops <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Festival Schedule Timeline */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Event Timeline</span>
            <h2 className="section-title">3 Days of Pure Tech Adrenaline</h2>
            <p className="section-subtitle">Plan your festival calendar and mark your presence.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {/* Day 1 */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <span className="badge badge-hackathon">Day 01 • March 14</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>09:00 AM - 08:00 PM</span>
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.75rem' }}>Inauguration &amp; Hackathon Launch</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                Keynote address by industry veterans, kickoff of the 36-hour National HackNova hackathon, and CloudOps workshop.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <li>✓ 09:30 AM: Grand Inaugural Ceremony</li>
                <li>✓ 11:00 AM: HackNova 36h Problem Statements Released</li>
                <li>✓ 02:00 PM: Kubernetes Masterclass Bootcamp</li>
              </ul>
            </div>

            {/* Day 2 */}
            <div className="glass-card" style={{ padding: '2rem', borderColor: 'var(--border-glow)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <span className="badge badge-robotics">Day 02 • March 15</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>10:00 AM - 09:00 PM</span>
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.75rem' }}>Combat Arena &amp; Code Wars</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                High-octane RoboWars combat tournament in the arena, CodeSprint algorithmic duel, and 24h CTF CyberShield.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <li>✓ 10:00 AM: CodeSprint Algorithmic Duel Round 1</li>
                <li>✓ 01:00 PM: RoboWars 15kg &amp; 30kg Mecha Clashes</li>
                <li>✓ 03:00 PM: Valorant LAN Tournament Semifinals</li>
              </ul>
            </div>

            {/* Day 3 */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <span className="badge badge-ai">Day 03 • March 16</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>10:00 AM - 06:00 PM</span>
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.75rem' }}>AI Summit &amp; Grand Finale</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                NeuralCon AI agent demos, IEEE technical paper evaluations, and Grand Valedictory Award Ceremony.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <li>✓ 10:00 AM: NeuralCon GenAI Project Showcases</li>
                <li>✓ 12:00 PM: HackNova Final Pitch &amp; Jury Review</li>
                <li>✓ 04:30 PM: Grand Prize Distribution &amp; DJ Concert</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

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

export default Home;
