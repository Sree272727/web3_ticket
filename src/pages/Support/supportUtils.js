/**
 * Support Portal — utility helpers
 */

/**
 * Formats an ISO date string to a short human-readable date.
 * e.g. "2026-03-20T09:15:00Z" → "Mar 20, 2026"
 */
export function formatDate(isoString) {
  if (!isoString) { return '—'; }
  try {
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short',
      day:   'numeric',
      year:  'numeric',
    });
  } catch {
    return isoString;
  }
}

/**
 * Formats an ISO date string to date + time.
 * e.g. "2026-03-20T09:15:00Z" → "Mar 20, 2026 at 9:15 AM"
 */
export function formatDateTime(isoString) {
  if (!isoString) { return '—'; }
  try {
    return new Date(isoString).toLocaleString('en-US', {
      month:  'short',
      day:    'numeric',
      year:   'numeric',
      hour:   'numeric',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

/**
 * Returns true if the search query matches any searchable field on the ticket.
 */
export function ticketMatchesSearch(ticket, query) {
  if (!query) { return true; }
  const q = query.toLowerCase();
  return (
    ticket.id.toLowerCase().includes(q)           ||
    ticket.subject.toLowerCase().includes(q)       ||
    ticket.submittedBy.toLowerCase().includes(q)   ||
    ticket.companyName.toLowerCase().includes(q)   ||
    ticket.category.toLowerCase().includes(q)      ||
    ticket.description.toLowerCase().includes(q)   ||
    (ticket.issueSummary || '').toLowerCase().includes(q)
  );
}

/**
 * Generates a new ticket ID based on the current ticket list.
 */
export function generateTicketId(tickets) {
  const max = tickets.reduce((acc, t) => {
    const num = parseInt(t.id.replace('TKT-', ''), 10);
    return num > acc ? num : acc;
  }, 1000);
  return `TKT-${max + 1}`;
}
