/**
 * PriorityBadge — displays a ticket priority as a colored pill with indicator dot
 */
export default function PriorityBadge({ priority }) {
  const classMap = {
    'Low':      'low',
    'Medium':   'medium',
    'High':     'high',
    'Critical': 'critical',
  };

  const cls = classMap[priority] || 'low';

  return (
    <span className={`sp-badge-priority ${cls}`}>
      <span className="sp-priority-dot" />
      {priority}
    </span>
  );
}
