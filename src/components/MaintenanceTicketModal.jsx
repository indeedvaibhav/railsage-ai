import { useEffect, useRef } from 'react';

export default function MaintenanceTicketModal({ ticket, onClose }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  if (!ticket) return null;

  return (
    <div className="ticket-modal-overlay" ref={overlayRef} onClick={handleOverlayClick}>
      <div className="ticket-modal" role="dialog" aria-modal="true">
        <div className="ticket-modal-header">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <h3>Maintenance Ticket</h3>
          <button className="ticket-modal-close" onClick={onClose} aria-label="Close modal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="ticket-modal-body">
          <div className="ticket-row">
            <span className="ticket-label">Ticket Number</span>
            <span className="ticket-value ticket-number-value">{ticket.ticketNumber}</span>
          </div>
          <div className="ticket-row">
            <span className="ticket-label">Zone</span>
            <span className="ticket-value">{ticket.zone}</span>
          </div>
          <div className="ticket-row">
            <span className="ticket-label">Fault Type</span>
            <span className="ticket-value">{ticket.faultType}</span>
          </div>
          <div className="ticket-row">
            <span className="ticket-label">Frequency</span>
            <span className="ticket-value">{ticket.frequency}</span>
          </div>
          <div className="ticket-row">
            <span className="ticket-label">Date Raised</span>
            <span className="ticket-value">{ticket.dateRaised}</span>
          </div>
          <div className="ticket-row">
            <span className="ticket-label">Status</span>
            <span className="ticket-value ticket-status-open">{ticket.status}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Implement maintenance ticket modal */
