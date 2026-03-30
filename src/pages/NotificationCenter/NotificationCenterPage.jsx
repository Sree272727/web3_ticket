// /src/pages/NotificationCenter/NotificationCenterPage.jsx
import { useState, useMemo, useEffect } from 'react';
import { FiBell, FiAlertTriangle, FiBookOpen, FiInfo, FiCheck, FiExternalLink } from 'react-icons/fi';
import { usePersona } from '../../context/PersonaContext';
import { NOTIFICATION_MOCK, getVisibleNotifications } from '../../data/notificationMockData';
import './NotificationCenter.css';

// ── Helpers ──────────────────────────────────────────────────

function formatDate(iso) {
  const d = new Date(iso);
  const now = new Date();
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) {
    return 'Just now';
  }
  if (diff < 3600) {
    return `${Math.floor(diff / 60)}m ago`;
  }
  if (diff < 86400) {
    return `${Math.floor(diff / 3600)}h ago`;
  }
  const days = Math.floor(diff / 86400);
  if (days < 7) {
    return `${days}d ago`;
  }
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getTypeBadgeClass(type) {
  const map = {
    'Compliance Alert':  'compliance-alert',
    'Training Reminder': 'training-reminder',
    'Document Update':   'document-update',
    'System Notice':     'system-notice',
    'Account Alert':     'account-alert',
    'Support Update':    'support-update',
  };
  return map[type] || 'system-notice';
}

function getPriorityBadgeClass(priority) {
  return priority ? priority.toLowerCase() : 'low';
}

function getPersonaSubtitle(persona) {
  switch (persona.id) {
    case 'tcs-admin':
      return 'Monitor all platform notifications across every company and user group.';
    case 'tcs-employee':
      return 'View platform-wide notifications relevant to support and operations.';
    case 'customer-admin':
      return `View notifications for your company and team at ${persona.description.split('—')[1]?.trim() || 'your facility'}.`;
    case 'customer-employee':
      return 'View notifications relevant to your role and facility.';
    case 'account-manager':
      return 'Monitor notifications for your assigned companies and their compliance activity.';
    default:
      return 'View and manage platform notifications.';
  }
}

// ── Main Component ────────────────────────────────────────────

export default function NotificationCenterPage() {
  const { activePersona } = usePersona();

  // Local copy of notifications so we can mark as read
  const [notifications, setNotifications] = useState(NOTIFICATION_MOCK);
  const [typeFilter, setTypeFilter]       = useState('');
  const [readFilter, setReadFilter]       = useState('');

  // Reset filters when persona changes
  useEffect(() => {
    setTypeFilter('');
    setReadFilter('');
  }, [activePersona.id]);

  const visibleNotifications = useMemo(
    () => getVisibleNotifications(notifications, activePersona),
    [notifications, activePersona]
  );

  const filteredNotifications = useMemo(() => {
    return visibleNotifications.filter(n => {
      if (typeFilter && n.category !== typeFilter) { return false; }
      if (readFilter === 'unread' && n.isRead) { return false; }
      if (readFilter === 'read'   && !n.isRead) { return false; }
      return true;
    });
  }, [visibleNotifications, typeFilter, readFilter]);

  // Summary counts from all visible (not filtered)
  const totalUnread = useMemo(
    () => visibleNotifications.filter(n => !n.isRead).length,
    [visibleNotifications]
  );
  const complianceAlerts = useMemo(
    () => visibleNotifications.filter(n => n.category === 'Compliance Alert' && !n.isRead).length,
    [visibleNotifications]
  );
  const trainingReminders = useMemo(
    () => visibleNotifications.filter(n => n.category === 'Training Reminder' && !n.isRead).length,
    [visibleNotifications]
  );
  const otherUnread = useMemo(
    () => visibleNotifications.filter(n => !n.isRead && n.category !== 'Compliance Alert' && n.category !== 'Training Reminder').length,
    [visibleNotifications]
  );

  function markAsRead(id) {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  }

  function markAllAsRead() {
    const visibleIds = new Set(visibleNotifications.map(n => n.id));
    setNotifications(prev =>
      prev.map(n => visibleIds.has(n.id) ? { ...n, isRead: true } : n)
    );
  }

  return (
    <div className="nc-page">

      {/* Header */}
      <div className="nc-header">
        <div className="nc-header-row">
          <div>
            <h1 className="nc-title">Notification Center</h1>
            <p className="nc-subtitle">{getPersonaSubtitle(activePersona)}</p>
          </div>
          <div className="nc-header-actions">
          </div>
        </div>
      </div>

      {/* Persona Banner */}
      <div className="nc-persona-banner">
        <span className={`nc-persona-banner-dot ${activePersona.colorClass}`} />
        <span>
          Viewing as <strong>{activePersona.label}</strong> — {activePersona.description}
        </span>
      </div>

      {/* Summary Cards */}
      <div className="nc-summary">
        <div className="nc-summary-card">
          <div className="nc-summary-icon unread">
            <FiBell size={18} />
          </div>
          <div className="nc-summary-info">
            <div className="nc-summary-value">{totalUnread}</div>
            <div className="nc-summary-label">Total Unread</div>
          </div>
        </div>

        <div className="nc-summary-card">
          <div className="nc-summary-icon alert">
            <FiAlertTriangle size={18} />
          </div>
          <div className="nc-summary-info">
            <div className="nc-summary-value">{complianceAlerts}</div>
            <div className="nc-summary-label">Compliance Alerts</div>
          </div>
        </div>

        <div className="nc-summary-card">
          <div className="nc-summary-icon training">
            <FiBookOpen size={18} />
          </div>
          <div className="nc-summary-info">
            <div className="nc-summary-value">{trainingReminders}</div>
            <div className="nc-summary-label">Training Reminders</div>
          </div>
        </div>

        <div className="nc-summary-card">
          <div className="nc-summary-icon other">
            <FiInfo size={18} />
          </div>
          <div className="nc-summary-info">
            <div className="nc-summary-value">{otherUnread}</div>
            <div className="nc-summary-label">System / Other</div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="nc-filter-bar">
        <span className="nc-filter-label">Filter</span>

        <select
          className="nc-filter-select"
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          aria-label="Filter by type"
        >
          <option value="">All Types</option>
          <option value="Compliance Alert">Compliance Alert</option>
          <option value="Training Reminder">Training Reminder</option>
          <option value="Document Update">Document Update</option>
          <option value="System Notice">System Notice</option>
          <option value="Account Alert">Account Alert</option>
          <option value="Support Update">Support Update</option>
        </select>

        <div className="nc-filter-divider" />

        <select
          className="nc-filter-select"
          value={readFilter}
          onChange={e => setReadFilter(e.target.value)}
          aria-label="Filter by read status"
        >
          <option value="">All Status</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
        </select>

        <span className="nc-filter-count">
          {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Notification List */}
      <div className="nc-list">
        {filteredNotifications.length === 0 ? (
          <div className="nc-empty-state">
            <span className="nc-empty-icon">
              <FiBell size={36} style={{ color: 'var(--color-border-dark)' }} />
            </span>
            <h3 className="nc-empty-title">No notifications found</h3>
            <p className="nc-empty-desc">
              {typeFilter || readFilter
                ? 'No notifications match your current filters. Try adjusting your filter criteria.'
                : 'You have no notifications at this time.'}
            </p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onMarkRead={markAsRead}
            />
          ))
        )}
      </div>

    </div>
  );
}

// ── Notification Card Sub-component ──────────────────────────

function NotificationCard({ notification, onMarkRead }) {
  const {
    id, category, priority, title, message,
    companyName, createdAt, isRead, actionLabel, actionUrl,
  } = notification;

  function handleClick() {
    if (!isRead) {
      onMarkRead(id);
    }
  }

  return (
    <div
      className={`nc-notification-card${!isRead ? ' unread' : ''}`}
      onClick={handleClick}
      role="article"
      aria-label={title}
    >
      <div className="nc-card-top">
        <div className="nc-card-badges">
          <span className={`nc-type-badge ${getTypeBadgeClass(category)}`}>
            {category}
          </span>
          <span className={`nc-priority-badge ${getPriorityBadgeClass(priority)}`}>
            {priority}
          </span>
        </div>
        <div className="nc-card-meta">
          <span className="nc-card-date">{formatDate(createdAt)}</span>
          {!isRead && <span className="nc-unread-dot" title="Unread" />}
        </div>
      </div>

      <h3 className="nc-card-title">{title}</h3>
      <p className="nc-card-message">{message}</p>

      <div className="nc-card-footer">
        <span className="nc-card-company">
          <FiInfo size={11} />
          {companyName}
        </span>
        {actionLabel && actionUrl && (
          <a
            href={actionUrl}
            className="nc-card-action"
            onClick={e => e.stopPropagation()}
            target="_blank"
            rel="noopener noreferrer"
          >
            {actionLabel}
            <FiExternalLink size={10} />
          </a>
        )}
      </div>
    </div>
  );
}
