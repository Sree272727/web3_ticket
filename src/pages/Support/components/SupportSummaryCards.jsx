import { FiInbox, FiLoader, FiAlertTriangle, FiCheckCircle, FiGrid, FiLayers } from 'react-icons/fi';

/**
 * SupportSummaryCards — KPI cards that update based on persona-filtered tickets.
 */
export default function SupportSummaryCards({ tickets, companyCount, showFacilities }) {
  const total = tickets.length;
  const open = tickets.filter(t => t.status === 'Open').length;
  const inProgress = tickets.filter(t => t.status === 'In Progress').length;
  const waiting = tickets.filter(t => t.status === 'Waiting for Customer').length;
  const critical = tickets.filter(t => t.priority === 'Critical' || t.priority === 'High').length;
  const resolved = tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length;

  const cards = [
    {
      key: 'total',
      label: 'Total Tickets',
      value: total,
      icon: <FiGrid />,
      type: 'total',
    },
    {
      key: 'open',
      label: 'Open Tickets',
      value: open,
      icon: <FiInbox />,
      type: 'open',
    },
    {
      key: 'inprogress',
      label: 'In Progress',
      value: inProgress,
      icon: <FiLoader />,
      type: 'inprogress',
    },
    {
      key: 'waiting',
      label: 'Waiting on Customer',
      value: waiting,
      icon: <FiLoader />,
      type: 'waiting',
    },
    {
      key: 'critical',
      label: 'High / Critical',
      value: critical,
      icon: <FiAlertTriangle />,
      type: 'critical',
    },
    {
      key: 'resolved',
      label: 'Resolved',
      value: resolved,
      icon: <FiCheckCircle />,
      type: 'resolved',
    },
  ];

  if (showFacilities) {
    cards.push({
      key: 'facilities',
      label: 'Facilities',
      value: companyCount,
      icon: <FiLayers />,
      type: 'facilities',
    });
  }

  return (
    <div className="sp-summary">
      <div className="summary-cards">
        {cards.map(card => (
          <div key={card.key} className="summary-card">
            <div className={`summary-card-icon ${card.type}`}>
              {card.icon}
            </div>
            <div>
              <div className="summary-card-value">{card.value}</div>
              <div className="summary-card-label">{card.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
