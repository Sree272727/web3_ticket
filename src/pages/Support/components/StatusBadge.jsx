/**
 * StatusBadge — displays a ticket status as a colored pill
 */
export default function StatusBadge({ status }) {
  const classMap = {
    'Open':        'open',
    'In Progress': 'in-progress',
    'Waiting for Customer': 'waiting',
    'Resolved':    'resolved',
    'Closed':      'closed',
  };

  const cls = classMap[status] || 'open';

  return (
    <span className={`sp-badge-status ${cls}`}>
      {status}
    </span>
  );
}
