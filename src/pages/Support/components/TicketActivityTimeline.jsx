import { formatDateTime } from '../supportUtils';

/**
 * TicketActivityTimeline — mocked audit trail for a ticket.
 *
 * Props:
 *   events         – array of timeline event objects
 *   showInternal   – boolean; if false, internal-only events are hidden
 */
export default function TicketActivityTimeline({ events, showInternal }) {
  const visible = showInternal
    ? events
    : events.filter(e => !e.internal);

  if (visible.length === 0) {
    return <p className="sp-no-resolution">No activity recorded yet.</p>;
  }

  return (
    <div className="sp-timeline">
      {visible.map(event => (
        <div
          key={event.id}
          className={`sp-timeline-event${event.internal ? ' internal' : ''}`}
        >
          <span className={`sp-timeline-dot ${event.type}`} />
          <div className="sp-timeline-event-label">
            {event.internal && (
              <span className="sp-timeline-internal-tag">Internal</span>
            )}
            {event.event}
          </div>
          <div className="sp-timeline-event-meta">
            {event.actor} · {event.role} · {formatDateTime(event.timestamp)}
          </div>
        </div>
      ))}
    </div>
  );
}
