import { FiLock, FiX } from 'react-icons/fi';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import TicketConversationThread from './TicketConversationThread';
import TicketMessageComposer from './TicketMessageComposer';
import TicketProgressStepper from './TicketProgressStepper';
import { formatDateTime } from '../supportUtils';

export default function TicketDetailDrawer({
  ticket,
  onClose,
  onAddComment,
  showInternalData,
  personaId,
}) {
  if (!ticket) {
    return null;
  }

  const showSoftenedNotes = personaId === 'account-manager';
  const showCustomerResolution = ['Resolved', 'Closed'].includes(ticket.status);
  const visibleInternalNotes = showInternalData
    ? ticket.internalNotes
    : showSoftenedNotes
      ? `Support handling is underway with limited account-facing visibility. Current status: ${ticket.status}.`
      : showCustomerResolution
        ? ticket.resolutionNotes
        : null;

  const internalLabel = showInternalData
    ? 'Resolution / Internal Notes'
    : showSoftenedNotes
      ? 'Operational Summary'
      : 'Resolution Summary';

  return (
    <div className="sp-drawer-overlay" role="dialog" aria-modal="true" aria-labelledby="ticket-drawer-title">
      <div className="sp-drawer-backdrop" onClick={onClose} />
      <aside className="sp-drawer-panel">
        <div className="sp-drawer-header">
          <div className="sp-drawer-header-copy">
            <span className="sp-drawer-ticket-id">{ticket.id}</span>
            <h2 id="ticket-drawer-title">{ticket.subject}</h2>
            <p>{ticket.companyName} · {ticket.issueSummary}</p>
          </div>

          <button type="button" className="sp-drawer-close" onClick={onClose} aria-label="Close ticket detail">
            <FiX />
          </button>
        </div>

        <div className="sp-drawer-body">
          <section className="sp-drawer-card">
            <div className="sp-drawer-badges">
              <StatusBadge status={ticket.status} />
              <PriorityBadge priority={ticket.priority} />
              <span className="sp-inline-meta-chip">{ticket.category}</span>
              {ticket.ltcArea && <span className="sp-inline-meta-chip">{ticket.ltcArea}</span>}
            </div>

            <div className="sp-overview-grid">
              <div className="sp-overview-item">
                <span className="sp-overview-label">Company</span>
                <span className="sp-overview-value">{ticket.companyName}</span>
              </div>
              <div className="sp-overview-item">
                <span className="sp-overview-label">Submitted By</span>
                <span className="sp-overview-value">{ticket.submittedBy}</span>
              </div>
              <div className="sp-overview-item">
                <span className="sp-overview-label">Category</span>
                <span className="sp-overview-value">{ticket.category}</span>
              </div>
              <div className="sp-overview-item">
                <span className="sp-overview-label">Assigned To</span>
                <span className="sp-overview-value">{ticket.assignedTo || 'Unassigned'}</span>
              </div>
              <div className="sp-overview-item">
                <span className="sp-overview-label">Created Date</span>
                <span className="sp-overview-value">{formatDateTime(ticket.createdAt)}</span>
              </div>
              <div className="sp-overview-item">
                <span className="sp-overview-label">Last Updated</span>
                <span className="sp-overview-value">{formatDateTime(ticket.updatedAt)}</span>
              </div>
            </div>
          </section>

          <section className="sp-drawer-card">
            <div className="sp-section-heading">
              <h3>Ticket Progress</h3>
              <span>Lifecycle and milestone details</span>
            </div>
            <TicketProgressStepper stages={ticket.progressStages || []} />
          </section>

          <section className="sp-drawer-card">
            <div className="sp-section-heading">
              <h3>Description</h3>
            </div>
            <div className="sp-description-text">
              <p>{ticket.description}</p>
            </div>
          </section>

          {visibleInternalNotes && (
            <section className="sp-drawer-card">
              <div className="sp-section-heading">
                <h3>{internalLabel}</h3>
                {showInternalData && (
                  <span className="sp-internal-pill">
                    <FiLock size={12} />
                    Internal visibility
                  </span>
                )}
              </div>
              <div className="sp-resolution-box">{visibleInternalNotes}</div>
            </section>
          )}

          <section className="sp-drawer-card">
            <div className="sp-section-heading">
              <h3>Ticket Conversation</h3>
              <span>Comments and follow-up notes tied to this request only</span>
            </div>
            <TicketConversationThread comments={ticket.conversation || []} />
            <TicketMessageComposer onSubmit={onAddComment} />
          </section>
        </div>
      </aside>
    </div>
  );
}
