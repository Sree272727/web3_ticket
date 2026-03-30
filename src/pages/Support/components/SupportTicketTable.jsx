import { FiZap, FiUser, FiLoader } from 'react-icons/fi';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import { formatDate } from '../supportUtils';

/**
 * Derive resolution icon from the actual ticket status (not from stored resolutionType)
 * to ensure consistency with the Status column.
 */
function getResolutionInfo(ticket) {
  if (['Open', 'In Progress', 'Waiting for Customer'].includes(ticket.status)) {
    return { icon: FiLoader, cls: 'sp-res-progress', label: 'In Progress' };
  }
  // Resolved or Closed — use stored resolutionType
  if (ticket.resolutionType === 'ai-resolved') {
    return { icon: FiZap, cls: 'sp-res-ai', label: 'AI Resolved' };
  }
  return { icon: FiUser, cls: 'sp-res-human', label: 'Human Resolved' };
}

/**
 * SupportTicketTable — enterprise-style ticket table.
 * Column visibility is persona-aware.
 */
export default function SupportTicketTable({
  tickets,
  selectedId,
  onSelect,
  showCompany,
  showAssignedTo,
}) {
  if (tickets.length === 0) {
    return (
      <div className="sp-table-wrapper">
        <div className="sp-empty-state">
          <div className="sp-empty-icon">📋</div>
          <p className="sp-empty-title">No tickets found</p>
          <p className="sp-empty-desc">
            Try adjusting your filters or submit a new support request.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="sp-table-wrapper">
      <table className="sp-ticket-table">
        <thead>
          <tr>
            <th className="sp-th-center">Ticket</th>
            <th>Subject</th>
            {showCompany && <th className="sp-th-center">Company</th>}
            <th className="sp-th-center">Category</th>
            <th className="sp-th-center">Priority</th>
            <th className="sp-th-center">Status</th>
            {showAssignedTo && <th className="sp-th-center">Assigned To</th>}
            <th className="sp-th-center">Last Updated</th>
            <th className="sp-th-center">Submitted</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map(ticket => {
            const res = getResolutionInfo(ticket);
            const Icon = res.icon;
            return (
              <tr
                key={ticket.id}
                className={ticket.id === selectedId ? 'selected' : ''}
                onClick={() => onSelect(ticket.id === selectedId ? null : ticket.id)}
              >
                <td className="sp-td-center">
                  <span className="sp-ticket-id-wrap">
                    <span className={`sp-res-icon ${res.cls}`}>
                      <Icon size={12} />
                      <span className="sp-res-tooltip">{res.label}</span>
                    </span>
                    <span className="sp-ticket-id">{ticket.id}</span>
                  </span>
                </td>
                <td className="sp-ticket-subject-cell">
                  <span className="sp-ticket-subject" title={ticket.subject}>
                    {ticket.subject}
                  </span>
                  {ticket.ltcArea && <div className="sp-ticket-taxonomy">{ticket.ltcArea}</div>}
                </td>
                {showCompany && (
                  <td className="sp-td-center">
                    <span className="sp-company-chip" title={ticket.companyName}>
                      {ticket.companyName}
                    </span>
                  </td>
                )}
                <td className="sp-td-center">
                  <span className="sp-date-cell">{ticket.category}</span>
                </td>
                <td className="sp-td-center">
                  <PriorityBadge priority={ticket.priority} />
                </td>
                <td className="sp-td-center">
                  <StatusBadge status={ticket.status} />
                </td>
                {showAssignedTo && (
                  <td className="sp-td-center">
                    {ticket.assignedTo
                      ? <span className="sp-assigned-cell">{ticket.assignedTo}</span>
                      : <span className="sp-unassigned">Unassigned</span>}
                  </td>
                )}
                <td className="sp-td-center">
                  <span className="sp-date-cell">{formatDate(ticket.updatedAt)}</span>
                </td>
                <td className="sp-td-center">
                  <span className="sp-date-cell">{formatDate(ticket.createdAt)}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
