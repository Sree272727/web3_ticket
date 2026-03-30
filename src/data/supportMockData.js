/**
 * Support Portal – Mock Data
 * Long-term care / healthcare compliance domain
 */

export const COMPANIES = {
  'green-valley': { id: 'green-valley', name: 'Green Valley Care Center' },
  oakridge: { id: 'oakridge', name: 'Oakridge Skilled Nursing' },
  sunrise: { id: 'sunrise', name: 'Sunrise Rehab and Care' },
  meadowbrook: { id: 'meadowbrook', name: 'Meadowbrook Post-Acute' },
  'silver-pines': { id: 'silver-pines', name: 'Silver Pines Health Center' },
};

export const CUSTOMER_USERS = {
  'gv-admin': { id: 'gv-admin', name: 'Patricia Hensley', role: 'Customer Admin', companyId: 'green-valley' },
  'gv-emp1': { id: 'gv-emp1', name: 'Mark Torres', role: 'Director of Nursing', companyId: 'green-valley' },
  'gv-emp2': { id: 'gv-emp2', name: 'Sandra Okafor', role: 'Staff Educator', companyId: 'green-valley' },
  'oak-admin': { id: 'oak-admin', name: 'James Whitfield', role: 'Facility Administrator', companyId: 'oakridge' },
  'oak-emp1': { id: 'oak-emp1', name: 'Theresa Nguyen', role: 'MDS Coordinator', companyId: 'oakridge' },
  'oak-emp2': { id: 'oak-emp2', name: 'Alyssa Morgan', role: 'Customer Employee', companyId: 'oakridge' },
  'sun-admin': { id: 'sun-admin', name: 'Linda Patel', role: 'Customer Admin', companyId: 'sunrise' },
  'sun-emp1': { id: 'sun-emp1', name: 'Robert Chavez', role: 'Director of Nursing', companyId: 'sunrise' },
  'sun-emp2': { id: 'sun-emp2', name: 'Elena Morris', role: 'Customer Employee', companyId: 'sunrise' },
  'mb-admin': { id: 'mb-admin', name: 'Carol Jennings', role: 'Customer Admin', companyId: 'meadowbrook' },
  'mb-emp1': { id: 'mb-emp1', name: 'Darius Blake', role: 'Facility Administrator', companyId: 'meadowbrook' },
  'mb-emp2': { id: 'mb-emp2', name: 'Nina Salazar', role: 'MDS Coordinator', companyId: 'meadowbrook' },
  'sp-admin': { id: 'sp-admin', name: 'David Kim', role: 'Customer Admin', companyId: 'silver-pines' },
  'sp-emp1': { id: 'sp-emp1', name: 'Angela Brooks', role: 'Staff Educator', companyId: 'silver-pines' },
  'sp-emp2': { id: 'sp-emp2', name: 'Maya Fletcher', role: 'Customer Employee', companyId: 'silver-pines' },
};

export const TCS_USERS = {
  'tcs-admin': { id: 'tcs-admin', name: 'Rachel Monroe', role: 'TCS Admin' },
  'tcs-emp1': { id: 'tcs-emp1', name: 'Kevin Stafford', role: 'TCS Employee' },
  'tcs-emp2': { id: 'tcs-emp2', name: 'Michelle Ortega', role: 'TCS Employee' },
  'tcs-emp3': { id: 'tcs-emp3', name: 'Jordan Ellis', role: 'TCS Employee' },
  'tcs-am1': {
    id: 'tcs-am1',
    name: 'Brian Callahan',
    role: 'Account Manager',
    assignedCompanies: ['green-valley', 'oakridge', 'sunrise'],
  },
};

export const PERSONAS = [
  {
    id: 'tcs-admin',
    label: 'TCS Admin',
    description: 'Platform owner / super admin',
    userId: 'tcs-admin',
    companyId: null,
    assignedCompanies: null,
    subtitle: 'Monitor escalations, coach the support team, and keep the customer experience on track across every account.',
    colorClass: 'tcs-admin',
  },
  {
    id: 'tcs-employee',
    label: 'TCS Employee',
    description: 'Support / operations user',
    userId: 'tcs-emp1',
    companyId: null,
    assignedCompanies: null,
    subtitle: 'Triage platform issues, respond to customer questions, and move tickets steadily toward resolution.',
    colorClass: 'tcs-employee',
  },
  {
    id: 'customer-admin',
    label: 'Customer Admin',
    description: 'Facility administrator — Green Valley Care Center',
    userId: 'gv-admin',
    companyId: 'green-valley',
    assignedCompanies: null,
    subtitle: 'Track your facility’s open requests, attach supporting files, and follow support responses in one place.',
    colorClass: 'customer-admin',
  },
  {
    id: 'customer-employee',
    label: 'Customer Employee',
    description: 'Facility staff — Green Valley Care Center',
    userId: 'gv-emp1',
    companyId: 'green-valley',
    assignedCompanies: null,
    subtitle: 'See the requests you submitted, add clarifying notes, and keep work moving with support.',
    colorClass: 'customer-employee',
  },
  {
    id: 'account-manager',
    label: 'Account Manager',
    description: 'TCS relationship owner — Green Valley, Oakridge, Sunrise',
    userId: 'tcs-am1',
    companyId: null,
    assignedCompanies: ['green-valley', 'oakridge', 'sunrise'],
    subtitle: 'Watch ticket trends across assigned facilities and spot customer-health risks before they escalate.',
    colorClass: 'account-manager',
  },
];

export const TICKET_CATEGORIES = [
  'Bug',
  'How Do I',
  'Do You Have',
  'General',
  'Access & Login',
  'Billing & Renewal',
];

export const TICKET_PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];
export const TICKET_STATUSES = ['Open', 'In Progress', 'Waiting for Customer', 'Resolved', 'Closed'];

const STAGE_ORDER = [
  'Submitted',
  'Acknowledged',
  'In Progress',
  'Waiting for Customer',
  'Resolved',
  'Closed',
];

const STAGE_META = {
  Submitted: {
    description: 'The request was created and captured with its initial business context.',
    eventType: 'created',
  },
  Acknowledged: {
    description: 'Support has reviewed the request, confirmed scope, and assigned an owner.',
    eventType: 'assigned',
  },
  'In Progress': {
    description: 'A support analyst is actively investigating, troubleshooting, or preparing guidance.',
    eventType: 'status',
  },
  'Waiting for Customer': {
    description: 'Support is paused pending customer confirmation, screenshots, or follow-up details.',
    eventType: 'waiting',
  },
  Resolved: {
    description: 'A fix, answer, or workaround has been delivered and is awaiting closure.',
    eventType: 'resolved',
  },
  Closed: {
    description: 'The ticket has been completed and closed with a final summary.',
    eventType: 'closed',
  },
};

const ALL_USERS = { ...CUSTOMER_USERS, ...TCS_USERS };

const COMPANY_USER_MAP = {
  'green-valley': ['gv-admin', 'gv-emp1', 'gv-emp2'],
  oakridge: ['oak-admin', 'oak-emp1', 'oak-emp2'],
  sunrise: ['sun-admin', 'sun-emp1', 'sun-emp2'],
  meadowbrook: ['mb-admin', 'mb-emp1', 'mb-emp2'],
  'silver-pines': ['sp-admin', 'sp-emp1', 'sp-emp2'],
};

const SUPPORT_OWNERS = ['tcs-emp1', 'tcs-emp2', 'tcs-emp3'];

const ISSUE_TEMPLATES = [
  {
    subject: 'Unable to preview compliance documents in Document Cafe',
    category: 'Bug',
    priority: 'High',
    statusPattern: ['In Progress', 'Resolved', 'Waiting for Customer', 'Open', 'Resolved'],
    description:
      'Users report that the document preview panel opens but renders a blank screen for policy packets and uploaded PDFs. Downloads still work, but the in-app preview is unreliable during review meetings.',
    summary:
      'Document preview instability is slowing policy review and survey-prep workflows.',
    context:
      'Teams rely on quick previews during daily standups, mock surveys, and document approval reviews. When preview fails, staff have to download files locally and lose time.',
    resolution:
      'Preview cache rules were adjusted and the rendering worker was recycled. The customer was given a browser-refresh workaround until the fix was released broadly.',
    internal:
      'Root cause pointed to stale preview-worker cache entries after the last UI bundle deployment.',
    helpTag: 'Documents',
    module: 'Document Café',
    attachments: ['survey-readiness-policy.pdf'],
  },
  {
    subject: 'AI compliance search is returning outdated guidance for F-tag queries',
    category: 'Bug',
    priority: 'Critical',
    statusPattern: ['In Progress', 'In Progress', 'Resolved', 'Waiting for Customer', 'Open'],
    description:
      'Search results for common F-tags are surfacing superseded guidance before current interpretive guidance, which is causing confusion for compliance leaders and educators.',
    summary:
      'Relevance ranking is not consistently favoring the newest guidance set.',
    context:
      'Customers use this search during survey prep and real-time audits. Accuracy and freshness are central to trust in the platform.',
    resolution:
      'The search-index weighting for publication date and guidance priority was tuned, and customers were given a filter-based workaround pending full reindex.',
    internal:
      'Index freshness lag appears concentrated in the nightly ranking merge job for regulatory content.',
    helpTag: 'Search',
    module: 'AI Search',
    attachments: ['search-results-screenshot.png'],
  },
  {
    subject: 'Need help bulk-assigning training to newly onboarded staff',
    category: 'How Do I',
    priority: 'Medium',
    statusPattern: ['Resolved', 'Closed', 'Resolved', 'Open', 'Resolved'],
    description:
      'An administrator needs to assign mandatory training to several new hires at once and cannot find the fastest workflow in the training module.',
    summary:
      'Customer needs product guidance for efficient training assignment management.',
    context:
      'Facilities are onboarding staff quickly and want to avoid individual assignment steps when orientation deadlines are tight.',
    resolution:
      'Support shared the bulk-assignment workflow, recommended role-based groups, and linked the quick guide used during onboarding.',
    internal:
      'Opportunity to add better in-product education around assignment templates and saved cohorts.',
    helpTag: 'Training',
    module: 'LMS',
    attachments: ['new-hire-training-list.xlsx'],
  },
  {
    subject: 'Staff member account locked after password reset attempt',
    category: 'Access & Login',
    priority: 'High',
    statusPattern: ['Resolved', 'Closed', 'Resolved', 'In Progress', 'Resolved'],
    description:
      'A staff member tried to reset a password, the link expired, and the account now shows as locked. The user needs platform access before a training deadline.',
    summary:
      'A login issue is blocking required work and needs fast remediation.',
    context:
      'Password issues usually surface right before due dates or audits when staff are trying to complete urgent tasks.',
    resolution:
      'The account was unlocked, a new reset email was issued, and the password-expiration guidance was clarified for local admins.',
    internal:
      'This pattern is increasing among first-time users who do not complete the reset flow in the first email session.',
    helpTag: 'Access',
    module: 'Account Access',
    attachments: ['lockout-error.png'],
  },
  {
    subject: 'Large policy upload is failing in Document Cafe',
    category: 'Bug',
    priority: 'High',
    statusPattern: ['In Progress', 'Waiting for Customer', 'Resolved', 'Open', 'In Progress'],
    description:
      'A large PDF upload reaches most of the progress bar and then fails with a generic error. Smaller files continue to upload successfully.',
    summary:
      'File-size handling is preventing policy updates from being published on time.',
    context:
      'Facilities often upload revised infection-control or emergency-preparedness policies in large PDF packets before audits.',
    resolution:
      'Support documented a temporary compression workaround and queued a fix to the upload timeout threshold.',
    internal:
      'Likely multipart timeout on the edge proxy when payloads stay open beyond the default upload window.',
    helpTag: 'Documents',
    module: 'Document Café',
    attachments: ['infection-control-policy-2026.pdf'],
  },
  {
    subject: 'Question about renewal options and plan upgrade timing',
    category: 'Billing & Renewal',
    priority: 'Medium',
    statusPattern: ['Open', 'In Progress', 'Waiting for Customer', 'Resolved', 'Open'],
    description:
      'The customer wants to understand renewal timing, upgrade options, and whether AI search and training modules can be bundled into the next contract term.',
    summary:
      'This is a commercial support inquiry tied to upcoming renewal planning.',
    context:
      'Stakeholders are comparing current feature usage against next-year priorities and budget.',
    resolution:
      'An account review was scheduled, renewal options were outlined, and the account manager prepared a summary of recommended package changes.',
    internal:
      'Coordinate with sales ops before promising any custom bundle language or multi-site discounting.',
    helpTag: 'Billing',
    module: 'Account Access',
    attachments: ['renewal-review-notes.docx'],
  },
  {
    subject: 'Critical alert banner is not visible on tablet during rounds',
    category: 'Bug',
    priority: 'Critical',
    statusPattern: ['Open', 'In Progress', 'Resolved', 'Open', 'Waiting for Customer'],
    description:
      'A clinical leader using a tablet during rounds cannot see the critical alert banner that appears properly on desktop, raising concerns about visibility for urgent items.',
    summary:
      'Responsive behavior is hiding critical alerts on tablets.',
    context:
      'Mobile and tablet visibility matters for nurses, DONs, and compliance leaders working away from a desk.',
    resolution:
      'A CSS breakpoint issue was corrected and a patch was staged so alert cards remain visible on tablet widths.',
    internal:
      'Responsive stacking for the alert ribbon regressed when the dashboard shell spacing was tightened earlier this month.',
    helpTag: 'Alerts',
    module: 'Notifications',
    attachments: ['ipad-rounding-photo.jpg'],
  },
  {
    subject: 'Need a survey-readiness checklist aligned to current CMS guidance',
    category: 'Do You Have',
    priority: 'High',
    statusPattern: ['Open', 'In Progress', 'Resolved', 'Open', 'Resolved'],
    description:
      'The customer wants to know whether the platform includes a current survey-readiness checklist or self-assessment aligned to CMS expectations for skilled nursing facilities.',
    summary:
      'Customer is requesting current compliance content and guidance artifacts.',
    context:
      'These requests usually come before annual state surveys, mock surveys, and executive QAPI planning sessions.',
    resolution:
      'Support linked the survey-readiness toolkit, documented where it lives in the library, and confirmed the next scheduled content refresh.',
    internal:
      'Content team should consider surfacing this library asset more prominently in onboarding and search.',
    helpTag: 'Compliance',
    module: 'Survey Readiness',
    attachments: ['survey-audit-agenda.pdf'],
  },
  {
    subject: 'Training notification emails are not reaching one employee',
    category: 'Bug',
    priority: 'Low',
    statusPattern: ['Open', 'Waiting for Customer', 'Resolved', 'Open', 'In Progress'],
    description:
      'One employee is not receiving training assignment and deadline reminder emails, even though notifications are enabled and peers are receiving them.',
    summary:
      'A targeted notification-delivery issue is affecting one user.',
    context:
      'These issues are common when facilities depend on automated reminders for annual competencies and due dates.',
    resolution:
      'Support verified settings, resent the notice, and refreshed the notification profile while checking bounce logs.',
    internal:
      'Customer-specific bounce suppression may still be involved and should be reviewed if the pattern returns.',
    helpTag: 'Notifications',
    module: 'Notifications',
    attachments: ['notification-settings.png'],
  },
  {
    subject: 'Need clarification on who can see internal document-review comments',
    category: 'General',
    priority: 'Medium',
    statusPattern: ['Resolved', 'Closed', 'Open', 'In Progress', 'Resolved'],
    description:
      'An admin wants to confirm whether document-review comments are visible to all users or only to the reviewer and selected admin roles.',
    summary:
      'This is an access-governance and product-behavior clarification request.',
    context:
      'Facilities are standardizing review workflows and want to avoid confusion around internal comments versus publishable notes.',
    resolution:
      'Support clarified the role matrix and shared best practices for using review notes without exposing incomplete guidance too widely.',
    internal:
      'Documentation could do a better job explaining shared versus restricted comment visibility.',
    helpTag: 'Admin',
    module: 'Chat',
    attachments: ['review-comment-example.png'],
  },
  {
    subject: 'Need follow-up on a prior escalation that is waiting on customer documents',
    category: 'General',
    priority: 'High',
    statusPattern: ['Waiting for Customer', 'Waiting for Customer', 'In Progress', 'Resolved', 'Waiting for Customer'],
    description:
      'The ticket is paused while support waits for supporting screenshots, policy copies, or timestamps from the facility before the investigation can continue.',
    summary:
      'Support is blocked until the customer provides missing evidence.',
    context:
      'This is common on troubleshooting tickets where support cannot reproduce the issue without the customer’s latest files or environment details.',
    resolution:
      'Support resumed work after documents arrived, validated the issue, and posted next steps for final review.',
    internal:
      'If the customer does not respond within the SLA follow-up window, the ticket can move toward closure.',
    helpTag: 'Escalation',
    module: 'Plan of Correction',
    attachments: ['requested-screenshots-list.txt'],
  },
  {
    subject: 'Compliance dashboard export is missing one department from the report',
    category: 'Bug',
    priority: 'Medium',
    statusPattern: ['In Progress', 'Resolved', 'Open', 'Resolved', 'Closed'],
    description:
      'A report export includes most departments correctly but omits one department’s data even though the dashboard view appears complete in the browser.',
    summary:
      'Export fidelity does not match on-screen reporting for one department.',
    context:
      'Leaders use exported reports in governance meetings, so missing data creates manual reconciliation work.',
    resolution:
      'Support corrected the department filter mapping for exports and provided a regenerated report for the affected date range.',
    internal:
      'The export mapper still has hard-coded assumptions around department aliases in legacy accounts.',
    helpTag: 'Reporting',
    module: 'Survey Readiness',
    attachments: ['monthly-compliance-export.xlsx'],
  },
  {
    subject: 'Question about assigning a second facility administrator role',
    category: 'How Do I',
    priority: 'Low',
    statusPattern: ['Resolved', 'Open', 'Resolved', 'Closed', 'Resolved'],
    description:
      'A team wants to add a second facility administrator so there is backup coverage for document approvals and training oversight.',
    summary:
      'Customer needs guidance on role setup and admin coverage planning.',
    context:
      'Backup admins are important during PTO, survey prep weeks, and times of turnover.',
    resolution:
      'Support outlined the steps to add a second admin and suggested least-privilege settings for backup coverage.',
    internal:
      'This is a good candidate for a quick-start guide and role-matrix cross-link.',
    helpTag: 'Admin',
    module: 'LMS',
    attachments: ['admin-coverage-plan.docx'],
  },
];

function toIso(date) {
  return new Date(date).toISOString();
}

function addHours(iso, hours) {
  return toIso(new Date(new Date(iso).getTime() + hours * 60 * 60 * 1000));
}

function addMinutes(iso, minutes) {
  return toIso(new Date(new Date(iso).getTime() + minutes * 60 * 1000));
}

function titleCaseStage(stage) {
  if (stage === 'In Progress') { return stage; }
  return stage;
}

function buildStageSequence(status) {
  switch (status) {
    case 'Open':
      return ['Submitted', 'Acknowledged'];
    case 'In Progress':
      return ['Submitted', 'Acknowledged', 'In Progress'];
    case 'Waiting for Customer':
      return ['Submitted', 'Acknowledged', 'In Progress', 'Waiting for Customer'];
    case 'Resolved':
      return ['Submitted', 'Acknowledged', 'In Progress', 'Resolved'];
    case 'Closed':
      return ['Submitted', 'Acknowledged', 'In Progress', 'Resolved', 'Closed'];
    default:
      return ['Submitted'];
  }
}

function buildProgressStages({ createdAt, submittedBy, submittedByRole, assignedUser, status }) {
  const activeSequence = buildStageSequence(status);
  return STAGE_ORDER.map((stage, index) => {
    const reached = activeSequence.includes(stage);
    const isCurrent = reached && stage === activeSequence[activeSequence.length - 1];
    const timestamp = reached ? addHours(createdAt, index * 4 + 1) : null;
    const actor = index === 0
      ? submittedBy
      : assignedUser?.name || 'Rachel Monroe';
    const role = index === 0
      ? submittedByRole
      : assignedUser?.role || 'TCS Admin';

    return {
      id: stage.toLowerCase().replace(/\s+/g, '-'),
      stage,
      title: titleCaseStage(stage),
      description: STAGE_META[stage].description,
      reached,
      isCurrent,
      timestamp,
      actor,
      role,
      eventSummary: reached
        ? `${actor} moved the ticket to ${stage.toLowerCase()}.`
        : `This stage has not been reached yet.`,
    };
  });
}

function buildTimeline({ createdAt, submittedBy, submittedByRole, assignedUser, status, internal }) {
  const currentOwner = assignedUser || TCS_USERS['tcs-admin'];
  const events = [
    {
      id: 'timeline-created',
      event: 'Ticket submitted',
      actor: submittedBy,
      role: submittedByRole,
      timestamp: createdAt,
      type: 'created',
      internal: false,
    },
  ];

  if (currentOwner) {
    events.push({
      id: 'timeline-assigned',
      event: `Ticket acknowledged and assigned to ${currentOwner.name}`,
      actor: 'Rachel Monroe',
      role: 'TCS Admin',
      timestamp: addHours(createdAt, 1),
      type: 'assigned',
      internal: false,
    });
  }

  if (['In Progress', 'Waiting for Customer', 'Resolved', 'Closed'].includes(status)) {
    events.push({
      id: 'timeline-progress',
      event: 'Status updated to In Progress',
      actor: currentOwner.name,
      role: currentOwner.role,
      timestamp: addHours(createdAt, 5),
      type: 'status',
      internal: false,
    });
  }

  if (status === 'Waiting for Customer') {
    events.push({
      id: 'timeline-waiting',
      event: 'Requested follow-up documents from customer',
      actor: currentOwner.name,
      role: currentOwner.role,
      timestamp: addHours(createdAt, 11),
      type: 'waiting',
      internal: false,
    });
  }

  if (['Resolved', 'Closed'].includes(status)) {
    events.push({
      id: 'timeline-resolved',
      event: 'Resolution shared with customer',
      actor: currentOwner.name,
      role: currentOwner.role,
      timestamp: addHours(createdAt, 13),
      type: 'resolved',
      internal: false,
    });
  }

  if (status === 'Closed') {
    events.push({
      id: 'timeline-closed',
      event: 'Ticket closed after customer confirmation',
      actor: currentOwner.name,
      role: currentOwner.role,
      timestamp: addHours(createdAt, 21),
      type: 'closed',
      internal: false,
    });
  }

  events.push({
    id: 'timeline-note',
    event: `Internal note: ${internal}`,
    actor: currentOwner.name,
    role: currentOwner.role,
    timestamp: addHours(createdAt, 9),
    type: 'note',
    internal: true,
  });

  return events.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

function buildConversation({ createdAt, submittedBy, submittedByRole, assignedUser, status, summary, attachments }) {
  const currentOwner = assignedUser || TCS_USERS['tcs-admin'];
  const thread = [
    {
      id: 'msg-1',
      author: submittedBy,
      role: submittedByRole,
      side: 'customer',
      timestamp: addMinutes(createdAt, 15),
      message: `We are seeing an issue tied to this ticket. ${summary}`,
      attachments: attachments.length ? [{ id: 'att-1', name: attachments[0] }] : [],
    },
    {
      id: 'msg-2',
      author: currentOwner.name,
      role: currentOwner.role,
      side: 'support',
      timestamp: addHours(createdAt, 2),
      message: 'We have reviewed the request and started triage. If there are screenshots, timestamps, or affected user names, please add them here so we can keep the investigation moving.',
      attachments: [],
    },
  ];

  if (status === 'Waiting for Customer') {
    thread.push({
      id: 'msg-3',
      author: currentOwner.name,
      role: currentOwner.role,
      side: 'support',
      timestamp: addHours(createdAt, 10),
      message: 'We are currently waiting on one more screenshot and the exact time the issue occurred. Once that is attached, we can continue the investigation.',
      attachments: [],
    });
  } else if (['Resolved', 'Closed'].includes(status)) {
    thread.push({
      id: 'msg-3',
      author: currentOwner.name,
      role: currentOwner.role,
      side: 'support',
      timestamp: addHours(createdAt, 12),
      message: 'A resolution or workaround has been provided in this ticket. Please review and let us know if anything still looks off in your environment.',
      attachments: [],
    });
    thread.push({
      id: 'msg-4',
      author: submittedBy,
      role: submittedByRole,
      side: 'customer',
      timestamp: addHours(createdAt, 18),
      message: status === 'Closed'
        ? 'Confirmed on our side. Everything looks good now, and you can close the request.'
        : 'This looks much better. We will monitor and follow up if anything changes.',
      attachments: [],
    });
  } else {
    thread.push({
      id: 'msg-3',
      author: submittedBy,
      role: submittedByRole,
      side: 'customer',
      timestamp: addHours(createdAt, 8),
      message: 'Adding a bit more context here in case it helps. The issue was reproduced again during our morning review workflow.',
      attachments: [],
    });
  }

  return thread;
}

// Resolution time multipliers by module — some modules are fast, others are slow
const MODULE_RESOLUTION_MULTIPLIER = {
  'Account Access': 0.5,    // fast — password resets, simple unlocks
  'Notifications': 0.6,     // relatively fast — settings checks
  'AI Search': 0.8,         // moderate — guidance and coaching
  'Document Café': 1.0,     // baseline
  'LMS': 1.2,               // slower — training workflows are complex
  'Chat': 1.3,              // slow — often needs investigation
  'Survey Readiness': 1.5,  // slow — requires content review
  'Plan of Correction': 1.8, // slowest — complex compliance workflows
};

// Company-level resolution speed modifier (some facilities respond faster)
const COMPANY_RESOLUTION_MODIFIER = {
  'green-valley': 0.85,    // responsive facility, fast turnaround
  'oakridge': 1.1,         // slightly slow
  'sunrise': 0.95,         // average
  'meadowbrook': 1.35,     // slow — often delayed customer responses
  'silver-pines': 1.2,     // moderate delays
};

function createTicket(template, companyId, userId, index) {
  const company = COMPANIES[companyId];
  const user = CUSTOMER_USERS[userId];
  const assignedUser = TCS_USERS[SUPPORT_OWNERS[index % SUPPORT_OWNERS.length]];
  const status = template.statusPattern[index % template.statusPattern.length];
  const priority = index % 7 === 0 ? 'Critical' : template.priority;
  // Spread tickets across ~170 days (covers 180-day filter) with slight clustering toward recent
  // Uses a non-linear distribution: more tickets in recent weeks, fewer further back
  const maxDaysBack = 170;
  const linearPos = (index + 4) / 84; // 0.05 to ~0.95 range
  const curvedPos = Math.pow(linearPos, 1.4); // skew toward recent (lower values = more recent)
  const daysBack = curvedPos * maxDaysBack;
  const hoursBack = daysBack * 24 + ((index * 7 + 3) % 17) * 3; // add jitter within the day
  const createdAt = toIso(new Date(Date.UTC(2026, 2, 27, 16, 0, 0) - hoursBack * 60 * 60 * 1000));

  // Resolution time varies by module complexity and facility responsiveness
  const moduleMultiplier = MODULE_RESOLUTION_MULTIPLIER[template.module] || 1.0;
  const companyModifier = COMPANY_RESOLUTION_MODIFIER[companyId] || 1.0;
  const jitter = 0.8 + ((index * 7 + 3) % 11) / 25; // deterministic pseudo-random 0.8–1.24
  const baseHours = { Open: 0, 'In Progress': 8, 'Waiting for Customer': 13, Resolved: 18, Closed: 24 };
  const resolveHours = Math.round((baseHours[status] || 0) * moduleMultiplier * companyModifier * jitter);
  const updatedAt = addHours(createdAt, resolveHours);
  const owner = status === 'Open' ? null : assignedUser;

  // Determine resolution type: ai-resolved, human-resolved, or in-progress
  // Based on module AI-friendliness and a deterministic pseudo-random seed
  const AI_FRIENDLY_MODULES = { 'Account Access': 0.7, 'Notifications': 0.5, 'LMS': 0.45, 'AI Search': 0.3, 'Document Café': 0.25, 'Chat': 0.2, 'Survey Readiness': 0.15, 'Plan of Correction': 0.1 };
  const aiChance = AI_FRIENDLY_MODULES[template.module] || 0.25;
  const seed = ((index * 13 + 7) % 100) / 100; // deterministic 0-1
  let resolutionType;
  if (['Open', 'In Progress', 'Waiting for Customer'].includes(status)) {
    resolutionType = 'in-progress';
  } else if (seed < aiChance) {
    resolutionType = 'ai-resolved';
  } else {
    resolutionType = 'human-resolved';
  }

  return {
    id: `TKT-${1001 + index}`,
    subject: template.subject,
    description: template.description,
    issueSummary: template.summary,
    businessContext: template.context,
    companyId: company.id,
    companyName: company.name,
    submittedBy: user.name,
    submittedByUserId: user.id,
    submittedByRole: user.role,
    category: template.category,
    ltcArea: template.helpTag,
    module: template.module,
    resolutionType,
    priority,
    status,
    assignedTo: owner?.name || null,
    assignedToUserId: owner?.id || null,
    createdAt,
    updatedAt,
    currentStage: buildStageSequence(status).slice(-1)[0],
    resolutionNotes: ['Resolved', 'Closed'].includes(status) ? template.resolution : null,
    internalNotes: template.internal,
    attachments: template.attachments.map((name, attachmentIndex) => ({
      id: `ticket-${index}-attachment-${attachmentIndex}`,
      name,
    })),
    progressStages: buildProgressStages({
      createdAt,
      submittedBy: user.name,
      submittedByRole: user.role,
      assignedUser: owner,
      status,
    }),
    timelineEvents: buildTimeline({
      createdAt,
      submittedBy: user.name,
      submittedByRole: user.role,
      assignedUser: owner,
      status,
      internal: template.internal,
    }),
    conversation: buildConversation({
      createdAt,
      submittedBy: user.name,
      submittedByRole: user.role,
      assignedUser: owner,
      status,
      summary: template.summary,
      attachments: template.attachments,
    }),
  };
}

// Ticket generation with uneven distribution per company.
// Each company has a different support profile — some modules cause more tickets
// at certain facilities based on their size, digital maturity, and pain points.
// Format: { companyId: { templateIndex: count } }
const COMPANY_TICKET_WEIGHTS = {
  'green-valley': {
    0: 2, // Document Café - preview issues (heavy doc users)
    1: 1, // AI Search
    2: 2, // LMS (large staff, lots of training)
    3: 1, // Account Access
    4: 2, // Document Café - upload issues
    5: 1, // Account Access - billing
    6: 1, // Notifications
    7: 1, // Survey Readiness
    8: 1, // Notifications
    9: 0, // Chat (rarely use chat)
    10: 1, // Plan of Correction
    11: 1, // Survey Readiness
    12: 1, // LMS
  },
  oakridge: {
    0: 1, // Document Café
    1: 2, // AI Search (struggle with search)
    2: 1, // LMS
    3: 2, // Account Access (frequent lockouts)
    4: 1, // Document Café
    5: 0, // No billing questions
    6: 2, // Notifications (tablet issues)
    7: 2, // Survey Readiness (heavy survey prep)
    8: 1, // Notifications
    9: 1, // Chat
    10: 1, // Plan of Correction
    11: 1, // Survey Readiness
    12: 0, // LMS (small team)
  },
  sunrise: {
    0: 1, // Document Café
    1: 1, // AI Search
    2: 1, // LMS
    3: 1, // Account Access
    4: 0, // No upload issues
    5: 1, // Account Access - billing
    6: 0, // No alert issues
    7: 1, // Survey Readiness
    8: 1, // Notifications
    9: 1, // Chat
    10: 0, // No escalation issues
    11: 1, // Survey Readiness
    12: 1, // LMS
  },
  meadowbrook: {
    0: 2, // Document Café (major doc pain)
    1: 1, // AI Search
    2: 2, // LMS (onboarding backlog)
    3: 2, // Account Access (high turnover = lockouts)
    4: 2, // Document Café (large policy uploads)
    5: 1, // Account Access - billing
    6: 1, // Notifications
    7: 2, // Survey Readiness (upcoming audit)
    8: 1, // Notifications
    9: 2, // Chat (many questions)
    10: 2, // Plan of Correction (active POC)
    11: 2, // Survey Readiness
    12: 1, // LMS
  },
  'silver-pines': {
    0: 1, // Document Café
    1: 2, // AI Search (trust issues with AI)
    2: 1, // LMS
    3: 2, // Account Access (new staff)
    4: 1, // Document Café
    5: 1, // Account Access - billing
    6: 1, // Notifications
    7: 1, // Survey Readiness
    8: 2, // Notifications (delivery confusion)
    9: 1, // Chat
    10: 1, // Plan of Correction
    11: 0, // No reporting issues
    12: 1, // LMS
  },
};

const generatedTickets = [];
let ticketIndex = 0;

Object.keys(COMPANY_USER_MAP).forEach((companyId, companyIndex) => {
  const weights = COMPANY_TICKET_WEIGHTS[companyId] || {};
  ISSUE_TEMPLATES.forEach((template, templateIndex) => {
    const count = weights[templateIndex] !== undefined ? weights[templateIndex] : 1;
    const userIds = COMPANY_USER_MAP[companyId];
    for (let copy = 0; copy < count; copy++) {
      const submitterId = userIds[(templateIndex + companyIndex + copy) % userIds.length];
      generatedTickets.push(createTicket(template, companyId, submitterId, ticketIndex));
      ticketIndex += 1;
    }
  });
});

export const MOCK_TICKETS = generatedTickets;

export const HELP_RESOURCES_BY_PERSONA = {
  'tcs-admin': {
    intro: 'Resources focused on platform oversight, escalation management, and support governance.',
    articles: [
      { id: 'ta-1', title: 'Escalation triage playbook for critical compliance incidents', tag: 'Ops' },
      { id: 'ta-2', title: 'Reviewing backlog health by account and product area', tag: 'Support' },
      { id: 'ta-3', title: 'When to move a ticket into waiting-for-customer status', tag: 'Workflow' },
    ],
    guides: [
      { id: 'tg-1', title: 'Support ops weekly review checklist for customer-impacting issues' },
      { id: 'tg-2', title: 'Incident communication expectations for regulated content defects' },
    ],
    videos: [
      { id: 'tv-1', title: 'Managing escalations across multiple facilities (7 min)' },
      { id: 'tv-2', title: 'Using ticket trends to coach the support team (6 min)' },
    ],
    faqs: [
      { id: 'tf-1', title: 'Which tickets should remain visible to account managers?' },
      { id: 'tf-2', title: 'When should internal notes be converted into a customer-facing summary?' },
    ],
  },
  'tcs-employee': {
    intro: 'Resources for troubleshooting, support responses, and realistic next-step handling.',
    articles: [
      { id: 'ea-1', title: 'How to request useful screenshots and reproduction steps', tag: 'Support' },
      { id: 'ea-2', title: 'Troubleshooting Document Cafe upload and preview issues', tag: 'Documents' },
      { id: 'ea-3', title: 'Explaining AI search relevance workarounds to customers', tag: 'Search' },
    ],
    guides: [
      { id: 'eg-1', title: 'Response templates for customer follow-up and next steps' },
      { id: 'eg-2', title: 'Support checklist for training and notification tickets' },
    ],
    videos: [
      { id: 'ev-1', title: 'Writing clear support updates inside a ticket thread (5 min)' },
      { id: 'ev-2', title: 'When to escalate to product or content teams (4 min)' },
    ],
    faqs: [
      { id: 'ef-1', title: 'What belongs in an internal note versus a public comment?' },
      { id: 'ef-2', title: 'When should I close a ticket after the customer responds?' },
    ],
  },
  'customer-admin': {
    intro: 'Resources aimed at managing staff access, compliance content, training, and facility workflows.',
    articles: [
      { id: 'ca-1', title: 'Assigning training to staff and monitoring completion', tag: 'Training' },
      { id: 'ca-2', title: 'Managing facility admins, approvers, and reviewers', tag: 'Admin' },
      { id: 'ca-3', title: 'Uploading policy revisions to Document Cafe', tag: 'Documents' },
    ],
    guides: [
      { id: 'cg-1', title: 'Survey-readiness prep checklist for facility leaders' },
      { id: 'cg-2', title: 'How to gather the right screenshots before opening a ticket' },
    ],
    videos: [
      { id: 'cv-1', title: 'Platform essentials for facility administrators (8 min)' },
      { id: 'cv-2', title: 'Tracking compliance activity across teams (6 min)' },
    ],
    faqs: [
      { id: 'cf-1', title: 'Can I add more than one facility administrator?' },
      { id: 'cf-2', title: 'Who can see ticket comments and attachments from my facility?' },
    ],
  },
  'customer-employee': {
    intro: 'Simple self-service resources for daily work, access questions, and training help.',
    articles: [
      { id: 'ua-1', title: 'How to find and complete assigned training', tag: 'Training' },
      { id: 'ua-2', title: 'What to do when a document will not open', tag: 'Documents' },
      { id: 'ua-3', title: 'How to add screenshots to a support ticket', tag: 'Support' },
    ],
    guides: [
      { id: 'ug-1', title: 'Quick start guide for logging in and resetting your password' },
      { id: 'ug-2', title: 'Finding the latest compliance guidance in search' },
    ],
    videos: [
      { id: 'uv-1', title: 'Submitting a clear support request (4 min)' },
      { id: 'uv-2', title: 'Working with alerts and due-date reminders (3 min)' },
    ],
    faqs: [
      { id: 'uf-1', title: 'Will my manager be able to see my ticket updates?' },
      { id: 'uf-2', title: 'Why am I not receiving a training reminder email?' },
    ],
  },
  'account-manager': {
    intro: 'Resources focused on account health, customer communication, and renewal-sensitive support issues.',
    articles: [
      { id: 'aa-1', title: 'Reading support patterns for customer-health risk signals', tag: 'Account' },
      { id: 'aa-2', title: 'How to summarize ticket themes for renewal conversations', tag: 'Renewal' },
      { id: 'aa-3', title: 'When to bring support leadership into a customer call', tag: 'Escalation' },
    ],
    guides: [
      { id: 'ag-1', title: 'Monthly account review prep using support activity' },
      { id: 'ag-2', title: 'Tracking unresolved issues by assigned facility portfolio' },
    ],
    videos: [
      { id: 'av-1', title: 'Using ticket data to prepare for customer check-ins (5 min)' },
      { id: 'av-2', title: 'Spotting renewal friction from support trends (4 min)' },
    ],
    faqs: [
      { id: 'af-1', title: 'Which ticket details are intentionally hidden from account managers?' },
      { id: 'af-2', title: 'How should I talk about open product issues with a customer?' },
    ],
  },
};

export const HELP_RESOURCES = HELP_RESOURCES_BY_PERSONA['customer-admin'];

export function getHelpResourcesForPersona(personaId) {
  return HELP_RESOURCES_BY_PERSONA[personaId] || HELP_RESOURCES_BY_PERSONA['customer-admin'];
}
