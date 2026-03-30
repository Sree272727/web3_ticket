import { useCallback, useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FiRotateCcw, FiSearch } from 'react-icons/fi';

import SupportPortalHeader from './components/SupportPortalHeader';
import SupportIntelligencePanel from './components/SupportIntelligencePanel';
// SupportSummaryCards removed
import SupportTicketTable from './components/SupportTicketTable';
import CreateTicketModal from './components/CreateTicketModal';
import TicketDetailDrawer from './components/TicketDetailDrawer';
import HelpResourcesModal from './components/HelpResourcesModal';
import PaginationControls from './components/PaginationControls';

import {
  MOCK_TICKETS,
  COMPANIES,
  CUSTOMER_USERS,
  TCS_USERS,
  TICKET_STATUSES,
  TICKET_PRIORITIES,
  TICKET_CATEGORIES,
  getHelpResourcesForPersona,
} from '../../data/supportMockData';
import { ticketMatchesSearch, generateTicketId } from './supportUtils';
import { usePersona } from '../../context/PersonaContext';

import './Support.css';

const PAGE_SIZE = 15;
const FAQ_QUESTION_MAP = {
  Training: 'How do I assign or troubleshoot required training for newly onboarded staff?',
  Compliance: 'Where can I find the latest survey-readiness and CMS-aligned guidance?',
  Documents: 'What should I do when Document Cafe uploads or previews fail?',
  Search: 'How can I improve AI search results for F-tags and current guidance?',
  Alerts: 'Why are critical alerts not appearing consistently during rounding workflows?',
  Notifications: 'Why is one employee not receiving assignment or reminder emails?',
  Admin: 'How should facility admin roles and internal review permissions be configured?',
  Billing: 'Who should I contact about renewals, upgrades, and account planning?',
  Reporting: 'Why does my compliance export not match the dashboard view?',
  Escalation: 'What information does support need before an escalated ticket can move forward?',
  Access: 'What should I do when a staff member is locked out before a compliance deadline?',
  Support: 'What details should be included when opening a support request?',
};

const LTC_LABELS = {
  Training: 'Training & Onboarding',
  Compliance: 'Survey Readiness & Compliance Content',
  Documents: 'Document Access & Policy Management',
  Search: 'AI Compliance Search',
  Alerts: 'Clinical Alerts & Rounding Workflows',
  Notifications: 'Training Notifications',
  Admin: 'Facility Administration',
  Billing: 'Renewal & Customer Success',
  Reporting: 'Compliance Reporting',
  Escalation: 'Escalation Readiness',
  Access: 'Staff Access & Login',
  Support: 'Support Operations',
};

function getVisibleTickets(tickets, persona) {
  switch (persona.id) {
    case 'tcs-admin':
    case 'tcs-employee':
      return tickets;
    case 'customer-admin':
      return tickets.filter((ticket) => ticket.companyId === persona.companyId);
    case 'customer-employee':
      return tickets.filter((ticket) => ticket.submittedByUserId === persona.userId);
    case 'account-manager':
      return tickets.filter((ticket) => (persona.assignedCompanies || []).includes(ticket.companyId));
    default:
      return tickets;
  }
}

function getPersonaCapabilities(persona) {
  const isTCS = persona.id === 'tcs-admin' || persona.id === 'tcs-employee';
  const isAccountManager = persona.id === 'account-manager';

  return {
    showCompany: isTCS || isAccountManager,
    showAssignedTo: isTCS || isAccountManager,
    showInternalData: isTCS,
    canCreateTicket: true,
  };
}

function getPersonaUserInfo(persona) {
  const allUsers = { ...CUSTOMER_USERS, ...TCS_USERS };
  const user = allUsers[persona.userId];
  const company = persona.companyId ? COMPANIES[persona.companyId] : null;

  return {
    submittedBy: user?.name || 'Unknown User',
    submittedByUserId: persona.userId,
    submittedByRole: user?.role || 'Unknown',
    companyId: persona.companyId || 'tcs-internal',
    companyName: company?.name || 'TCS Internal',
    conversationSide: persona.id === 'tcs-admin' || persona.id === 'tcs-employee' || persona.id === 'account-manager'
      ? 'support'
      : 'customer',
  };
}

function createInitialProgressStages(createdAt, submittedBy, submittedByRole) {
  return [
    {
      id: 'submitted',
      stage: 'Submitted',
      title: 'Submitted',
      description: 'The request was created and is waiting for support review.',
      reached: true,
      isCurrent: true,
      timestamp: createdAt,
      actor: submittedBy,
      role: submittedByRole,
      eventSummary: `${submittedBy} created the ticket.`,
    },
    {
      id: 'acknowledged',
      stage: 'Acknowledged',
      title: 'Acknowledged',
      description: 'Support has not yet acknowledged this request.',
      reached: false,
      isCurrent: false,
      timestamp: null,
      actor: null,
      role: null,
      eventSummary: 'Awaiting support acknowledgement.',
    },
    {
      id: 'in-progress',
      stage: 'In Progress',
      title: 'In Progress',
      description: 'The investigation has not started yet.',
      reached: false,
      isCurrent: false,
      timestamp: null,
      actor: null,
      role: null,
      eventSummary: 'Awaiting active investigation.',
    },
    {
      id: 'waiting-for-customer',
      stage: 'Waiting for Customer',
      title: 'Waiting for Customer',
      description: 'This stage will appear if support needs more information.',
      reached: false,
      isCurrent: false,
      timestamp: null,
      actor: null,
      role: null,
      eventSummary: 'Not reached yet.',
    },
    {
      id: 'resolved',
      stage: 'Resolved',
      title: 'Resolved',
      description: 'This stage appears once a fix, answer, or workaround is delivered.',
      reached: false,
      isCurrent: false,
      timestamp: null,
      actor: null,
      role: null,
      eventSummary: 'Not reached yet.',
    },
    {
      id: 'closed',
      stage: 'Closed',
      title: 'Closed',
      description: 'The ticket will close after confirmation or final review.',
      reached: false,
      isCurrent: false,
      timestamp: null,
      actor: null,
      role: null,
      eventSummary: 'Not reached yet.',
    },
  ];
}

function buildSupportIntelligence(tickets, persona) {
  if (tickets.length === 0) {
    return null;
  }

  const unresolvedStatuses = ['Open', 'In Progress', 'Waiting for Customer'];
  const unresolvedTickets = tickets.filter((ticket) => unresolvedStatuses.includes(ticket.status));
  const criticalTickets = tickets.filter((ticket) => ticket.priority === 'Critical');
  const waitingTickets = tickets.filter((ticket) => ticket.status === 'Waiting for Customer');

  const themeCounts = tickets.reduce((accumulator, ticket) => {
    const key = ticket.ltcArea || 'Support';
    accumulator[key] = (accumulator[key] || 0) + 1;
    return accumulator;
  }, {});

  const themeClusters = Object.entries(themeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([theme, count]) => ({
      name: LTC_LABELS[theme] || theme,
      count,
      detail: `${count} tickets in this scope point to repeat friction around ${theme.toLowerCase()}.`,
    }));

  const groupedByCompany = Object.values(tickets.reduce((accumulator, ticket) => {
    const existing = accumulator[ticket.companyId] || {
      companyName: ticket.companyName,
      unresolved: 0,
      critical: 0,
      waiting: 0,
      themes: {},
    };
    if (unresolvedStatuses.includes(ticket.status)) { existing.unresolved += 1; }
    if (ticket.priority === 'Critical') { existing.critical += 1; }
    if (ticket.status === 'Waiting for Customer') { existing.waiting += 1; }
    const theme = ticket.ltcArea || 'Support';
    existing.themes[theme] = (existing.themes[theme] || 0) + 1;
    accumulator[ticket.companyId] = existing;
    return accumulator;
  }, {}));

  const facilitySignals = groupedByCompany
    .map((company) => {
      const dominantTheme = Object.entries(company.themes).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Support';
      const score = company.unresolved * 3 + company.critical * 4 + company.waiting * 2;
      const tone = score >= 20 ? 'high-risk' : score >= 11 ? 'watch' : 'stable';

      return {
        companyName: company.companyName,
        label: tone === 'high-risk' ? 'Intervene' : tone === 'watch' ? 'Watchlist' : 'Stable',
        tone,
        detail: `${company.unresolved} unresolved, ${company.critical} critical, dominant issue area: ${LTC_LABELS[dominantTheme] || dominantTheme}.`,
        score,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, persona.id === 'customer-admin' || persona.id === 'customer-employee' ? 1 : 3);

  const faqCandidates = themeClusters.slice(0, 3).map((theme) => {
    const key = Object.keys(LTC_LABELS).find((labelKey) => LTC_LABELS[labelKey] === theme.name) || theme.name;
    return {
      question: FAQ_QUESTION_MAP[key] || `How do we reduce repeat issues related to ${theme.name}?`,
      rationale: `${theme.count} recent tickets suggest this topic should become guided self-service content or a short enablement asset.`,
    };
  });

  const actions = [];
  const trainingCount = themeCounts.Training || 0;
  const complianceCount = themeCounts.Compliance || 0;
  const documentCount = themeCounts.Documents || 0;
  const billingCount = themeCounts.Billing || 0;

  if (trainingCount >= 3) {
    actions.push({
      title: 'Launch onboarding refresher for training workflows',
      owner: persona.id.startsWith('customer') ? 'Facility admin' : 'TCS enablement',
      tone: 'info',
      description: 'Repeated training and onboarding tickets suggest a short role-based walkthrough would reduce repeat support demand.',
    });
  }

  if (complianceCount >= 3) {
    actions.push({
      title: 'Offer survey-readiness enablement',
      owner: persona.id === 'account-manager' ? 'Account manager' : 'Customer success',
      tone: 'warning',
      description: 'Compliance-content questions are clustering enough to justify a proactive review of survey-readiness resources and guidance placement.',
    });
  }

  if (documentCount >= 3) {
    actions.push({
      title: 'Run Document Cafe office hours',
      owner: 'Support operations',
      tone: 'info',
      description: 'Document preview and upload issues are recurring and map to a high-value LTC workflow around policy management.',
    });
  }

  if (unresolvedTickets.length >= 8 || facilitySignals.some((signal) => signal.tone === 'high-risk')) {
    actions.push({
      title: 'Account manager outreach recommended',
      owner: persona.id.startsWith('customer') ? 'TCS relationship owner' : 'Account manager',
      tone: 'critical',
      description: 'Open issue volume and unresolved patterns suggest a proactive check-in to protect adoption and reduce churn risk.',
    });
  }

  if (billingCount >= 2) {
    actions.push({
      title: 'Connect support trends to renewal planning',
      owner: 'Customer success + AM',
      tone: 'info',
      description: 'Commercial questions are surfacing alongside operational issues, which is a good moment to tie product value to account planning.',
    });
  }

  while (actions.length < 3) {
    actions.push({
      title: 'Publish FAQ from recurring support themes',
      owner: 'Knowledge management',
      tone: 'info',
      description: 'Converting repeated ticket themes into guided self-service content makes the portal feel proactive rather than reactive.',
    });
  }

  const healthScore = Math.max(0, 100 - (unresolvedTickets.length * 4 + criticalTickets.length * 6 + waitingTickets.length * 3));
  const healthTone = healthScore >= 72 ? 'stable' : healthScore >= 52 ? 'watch' : 'high-risk';
  const healthLabel = healthTone === 'stable' ? 'Healthy Signal' : healthTone === 'watch' ? 'Watchlist Signal' : 'Intervention Recommended';
  const scopeLabel = persona.id === 'customer-admin' || persona.id === 'customer-employee'
    ? 'your visible facility scope'
    : persona.id === 'account-manager'
      ? 'your assigned account portfolio'
      : 'the visible support portfolio';

  return {
    intro: `This layer turns support activity into operational and retention insight for ${scopeLabel}, showing why an LTC-specific portal can outperform a generic helpdesk.`,
    heroTitle: `${Math.round(healthScore)} support health score for ${scopeLabel}`,
    heroDescription: `${unresolvedTickets.length} unresolved tickets, ${criticalTickets.length} critical issues, and ${waitingTickets.length} waiting-on-customer cases are being translated into targeted enablement and follow-up recommendations.`,
    healthTone,
    healthLabel,
    themeClusters,
    facilitySignals,
    faqCandidates,
    recommendedActions: actions.slice(0, 3),
  };
}

export default function SupportPortalPage() {
  const { activePersona, activePersonaId } = usePersona();
  const { registerTopbarActions } = useOutletContext();
  const [tickets, setTickets] = useState(MOCK_TICKETS);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isIntelligenceModalOpen, setIsIntelligenceModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState(null);

  const capabilities = useMemo(() => getPersonaCapabilities(activePersona), [activePersona]);
  const userInfo = useMemo(() => getPersonaUserInfo(activePersona), [activePersona]);
  const helpResources = useMemo(() => getHelpResourcesForPersona(activePersona.id), [activePersona.id]);

  useEffect(() => {
    setSelectedTicketId(null);
    setSearchQuery('');
    setStatusFilter('');
    setPriorityFilter('');
    setCategoryFilter('');
    setCurrentPage(1);
  }, [activePersonaId]);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  const scopedTickets = useMemo(
    () => getVisibleTickets(tickets, activePersona),
    [tickets, activePersona]
  );

  const filteredTickets = useMemo(() => {
    return scopedTickets.filter((ticket) => {
      if (statusFilter && ticket.status !== statusFilter) { return false; }
      if (priorityFilter && ticket.priority !== priorityFilter) { return false; }
      if (categoryFilter && ticket.category !== categoryFilter) { return false; }
      if (!ticketMatchesSearch(ticket, searchQuery)) { return false; }
      return true;
    });
  }, [scopedTickets, statusFilter, priorityFilter, categoryFilter, searchQuery]);

  const pageCount = Math.max(1, Math.ceil(filteredTickets.length / PAGE_SIZE));

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, pageCount));
  }, [pageCount]);

  const paginatedTickets = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredTickets.slice(start, start + PAGE_SIZE);
  }, [filteredTickets, currentPage]);

  const selectedTicket = useMemo(
    () => tickets.find((ticket) => ticket.id === selectedTicketId) || null,
    [tickets, selectedTicketId]
  );

  const companyCount = useMemo(() => {
    return new Set(scopedTickets.map((ticket) => ticket.companyId)).size;
  }, [scopedTickets]);

  useEffect(() => {
    registerTopbarActions({
      onOpenIntelligence: () => setIsIntelligenceModalOpen(true),
      onOpenHelp: () => setIsHelpModalOpen(true),
    });

    return () => {
      registerTopbarActions({
        onOpenIntelligence: null,
        onOpenHelp: null,
      });
    };
  }, [registerTopbarActions]);

  const supportIntelligence = useMemo(
    () => buildSupportIntelligence(scopedTickets, activePersona),
    [scopedTickets, activePersona]
  );

  const handleCreateTicket = useCallback((formData) => {
    const now = new Date().toISOString();
    const newTicket = {
      id: generateTicketId(tickets),
      subject: formData.subject,
      description: formData.description,
      issueSummary: formData.subject,
      businessContext: 'Submitted through the Support Portal with local mock-state workflow for this demo.',
      ltcArea: formData.category === 'Billing & Renewal' ? 'Billing' : formData.category === 'Access & Login' ? 'Access' : 'Support',
      companyId: userInfo.companyId,
      companyName: userInfo.companyName,
      submittedBy: userInfo.submittedBy,
      submittedByUserId: userInfo.submittedByUserId,
      submittedByRole: userInfo.submittedByRole,
      category: formData.category,
      priority: formData.priority,
      status: 'Open',
      assignedTo: null,
      assignedToUserId: null,
      createdAt: now,
      updatedAt: now,
      currentStage: 'Submitted',
      resolutionNotes: null,
      internalNotes: null,
      attachments: formData.file ? [{ id: `attachment-${Date.now()}`, name: formData.file.name }] : [],
      progressStages: createInitialProgressStages(now, userInfo.submittedBy, userInfo.submittedByRole),
      timelineEvents: [
        {
          id: `event-${Date.now()}`,
          event: 'Ticket submitted',
          actor: userInfo.submittedBy,
          role: userInfo.submittedByRole,
          timestamp: now,
          type: 'created',
          internal: false,
        },
      ],
      conversation: [
        {
          id: `message-${Date.now()}`,
          author: userInfo.submittedBy,
          role: userInfo.submittedByRole,
          side: userInfo.conversationSide,
          timestamp: now,
          message: formData.description,
          attachments: formData.file ? [{ id: `message-file-${Date.now()}`, name: formData.file.name }] : [],
        },
      ],
    };

    setTickets((previous) => [newTicket, ...previous]);
    setSelectedTicketId(newTicket.id);
    setIsCreateModalOpen(false);
    setCurrentPage(1);
    setToast({ type: 'success', message: `${newTicket.id} was created and added to the queue.` });
  }, [tickets, userInfo]);

  const handleAddTicketComment = useCallback(({ message, file }) => {
    if (!selectedTicketId) {
      return;
    }

    const now = new Date().toISOString();

    setTickets((previous) => previous.map((ticket) => {
      if (ticket.id !== selectedTicketId) {
        return ticket;
      }

      const newComment = {
        id: `comment-${Date.now()}`,
        author: userInfo.submittedBy,
        role: userInfo.submittedByRole,
        side: userInfo.conversationSide,
        timestamp: now,
        message: message || 'Added a ticket update.',
        attachments: file ? [{ id: `attachment-${Date.now()}`, name: file.name }] : [],
      };

      const newEvent = {
        id: `event-${Date.now()}`,
        event: userInfo.conversationSide === 'support'
          ? 'Support update posted in ticket conversation'
          : 'Customer follow-up added to ticket conversation',
        actor: userInfo.submittedBy,
        role: userInfo.submittedByRole,
        timestamp: now,
        type: 'comment',
        internal: false,
      };

      return {
        ...ticket,
        updatedAt: now,
        conversation: [...(ticket.conversation || []), newComment],
        timelineEvents: [...(ticket.timelineEvents || []), newEvent],
      };
    }));

    setToast({ type: 'success', message: `Added a ticket update to ${selectedTicketId}.` });
  }, [selectedTicketId, userInfo]);

  function clearFilters() {
    setSearchQuery('');
    setStatusFilter('');
    setPriorityFilter('');
    setCategoryFilter('');
    setCurrentPage(1);
  }

  const filtersApplied = Boolean(searchQuery || statusFilter || priorityFilter || categoryFilter);

  return (
    <div className="support-portal">
      <SupportPortalHeader onOpenCreate={() => setIsCreateModalOpen(true)} />

      <section className="sp-content-shell">
        <div className="sp-filter-bar">
          <div className="sp-search-wrap">
            <FiSearch size={15} className="sp-search-icon" />
            <input
              type="text"
              className="sp-search-input"
              placeholder="Search by ticket ID, subject, submitter, company, or summary..."
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setCurrentPage(1);
              }}
              aria-label="Search tickets"
            />
          </div>

          <select
            className="sp-filter-select"
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filter by status"
          >
            <option value="">All Statuses</option>
            {TICKET_STATUSES.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          <select
            className="sp-filter-select"
            value={priorityFilter}
            onChange={(event) => {
              setPriorityFilter(event.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filter by priority"
          >
            <option value="">All Priorities</option>
            {TICKET_PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>{priority}</option>
            ))}
          </select>

          <select
            className="sp-filter-select"
            value={categoryFilter}
            onChange={(event) => {
              setCategoryFilter(event.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            {TICKET_CATEGORIES.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <div className="sp-filter-actions">
            <span className="sp-filter-count">
              {filteredTickets.length} ticket{filteredTickets.length !== 1 ? 's' : ''}
            </span>

            {filtersApplied && (
              <button type="button" className="sp-btn-tertiary" onClick={clearFilters}>
                <FiRotateCcw size={14} />
                Reset
              </button>
            )}
          </div>
        </div>

        <div className="sp-table-shell">
          <SupportTicketTable
            tickets={paginatedTickets}
            selectedId={selectedTicketId}
            onSelect={setSelectedTicketId}
            showCompany={capabilities.showCompany}
            showAssignedTo={capabilities.showAssignedTo}
          />
        </div>

        <PaginationControls
          currentPage={currentPage}
          totalPages={pageCount}
          totalItems={filteredTickets.length}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
        />
      </section>

      <CreateTicketModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTicket}
        companyName={userInfo.companyName}
        submittedBy={userInfo.submittedBy}
      />

      <HelpResourcesModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        resources={helpResources}
        personaLabel={activePersona.label}
      />

      {isIntelligenceModalOpen && (
        <div
          className="sp-modal-backdrop"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setIsIntelligenceModalOpen(false);
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="ai-intelligence-title"
        >
          <div className="sp-modal sp-ai-modal">
            <div className="sp-modal-header">
              <div>
                <h2 id="ai-intelligence-title">AI Intelligence</h2>
                <p className="sp-modal-subtitle">LTC-specific support insight, facility signals, FAQ candidates, and next-best actions.</p>
              </div>
              <button
                type="button"
                className="sp-modal-close"
                onClick={() => setIsIntelligenceModalOpen(false)}
                aria-label="Close AI intelligence"
              >
                ×
              </button>
            </div>
            <div className="sp-modal-body">
              <SupportIntelligencePanel insights={supportIntelligence} />
            </div>
          </div>
        </div>
      )}

      {selectedTicket && (
        <TicketDetailDrawer
          key={selectedTicket.id}
          ticket={selectedTicket}
          onClose={() => setSelectedTicketId(null)}
          onAddComment={handleAddTicketComment}
          showInternalData={capabilities.showInternalData}
          personaId={activePersona.id}
        />
      )}

      {toast && (
        <div className="sp-toast-container" role="status" aria-live="polite">
          <div className={`sp-toast ${toast.type}`}>
            <span>{toast.type === 'success' ? '✓' : '!'}</span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
