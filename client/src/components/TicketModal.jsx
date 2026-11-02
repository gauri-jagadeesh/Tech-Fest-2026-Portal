import React, { useState } from 'react';
import { X, Sparkles, Calendar, MapPin, Clock, Copy, Check, QrCode, Printer } from 'lucide-react';

const TicketModal = ({ registration, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !registration) return null;

  const event = registration.event || {};
  const ticketCode = registration.ticketCode || 'TF26-DEMO-001';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(ticketCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '540px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header" style={{ marginBottom: '1.25rem' }}>
          <div>
            <span className="section-tag">Official Entry Pass</span>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Tech-Fest 2026 Badge</h3>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close pass">
            <X size={22} />
          </button>
        </div>

        {/* The Digital Pass Card */}
        <div className="ticket-card" id="printable-ticket">
          {/* Ticket Header */}
          <div className="ticket-header">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-cyan-light)', fontWeight: 800, fontSize: '0.85rem' }}>
                <Sparkles size={16} /> TECH-FEST 2026 DELEGATE PASS
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '0.25rem', color: '#fff' }}>
                {event.title}
              </div>
            </div>
            <div className="ticket-code">
              {ticketCode}
            </div>
          </div>

          {/* Event Details Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '1.25rem 0' }}>
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Date & Time</div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                {event.date}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{event.time}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Venue Hall</div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                {event.venue}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Team / Registered Name</div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                {registration.teamName || 'Individual'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Verification Status</div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#34d399', marginTop: '0.2rem' }}>
                ✓ {registration.status || 'Confirmed'}
              </div>
            </div>
          </div>

          {/* QR Code & Barcode Section */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1.25rem', borderTop: '1px dashed var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div className="ticket-qr-dummy">
                {/* SVG QR Code Simulation */}
                <svg viewBox="0 0 24 24" width="76" height="76" fill="#0f172a">
                  <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 0h4v4h-4v-4zm-4 4h4v4h-4v-4zm0-4h4v4h-4v-4zm4-4h4v4h-4v-4zM6 6h0v0H6z" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Scan at Entrance
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '170px' }}>
                  Show this digital QR pass at check-in counter to collect physical kit & badge.
                </div>
              </div>
            </div>

            <button
              onClick={handleCopyCode}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <button onClick={handlePrint} className="btn btn-secondary" style={{ flex: 1 }}>
            <Printer size={16} /> Print Pass
          </button>
          <button onClick={onClose} className="btn btn-primary" style={{ flex: 1 }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketModal;
