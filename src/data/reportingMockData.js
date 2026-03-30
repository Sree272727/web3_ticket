export const REPORTING_TIME_PERIODS = [
  { value: '30', label: 'Last 30 Days', days: 30, bucketCount: 4, bucketLabel: 'week' },
  { value: '90', label: 'Last 90 Days', days: 90, bucketCount: 6, bucketLabel: 'biweek' },
  { value: '180', label: 'Last 180 Days', days: 180, bucketCount: 6, bucketLabel: 'month' },
];

export const ACCOUNT_MANAGER_BY_COMPANY = {
  'green-valley': 'Brian Callahan',
  oakridge: 'Brian Callahan',
  sunrise: 'Brian Callahan',
  meadowbrook: 'Rachel Monroe',
  'silver-pines': 'Michelle Ortega',
};

export const THEME_METADATA = {
  Documents: {
    label: 'Document Access & Policy Management',
    tag: 'FAQ Candidate',
    recommendationLabel: 'Create guided help and office hours',
    explanation: 'These tickets usually reflect friction in policy review, preview, upload, or publishing workflows.',
  },
  Training: {
    label: 'Training Assignment Confusion',
    tag: 'Training Opportunity',
    recommendationLabel: 'Run onboarding refresher',
    explanation: 'The pattern points to staff needing clearer assignment workflows and admin guidance.',
  },
  Search: {
    label: 'AI Compliance Search Issues',
    tag: 'Enablement Gap',
    recommendationLabel: 'Coach search best practices',
    explanation: 'Many of these requests look like trust or usage friction rather than pure product failure.',
  },
  Access: {
    label: 'User Access / Permissions',
    tag: 'Onboarding Friction',
    recommendationLabel: 'Tighten role setup guidance',
    explanation: 'Access-related tickets often appear when staff are added quickly or local admins lack backup coverage.',
  },
  Alerts: {
    label: 'Alerts / Notification Visibility',
    tag: 'Product Friction',
    recommendationLabel: 'Review mobile and alert workflows',
    explanation: 'These issues affect urgent workflows and deserve faster attention than routine support questions.',
  },
  Compliance: {
    label: 'Survey Readiness Content Requests',
    tag: 'Guidance Opportunity',
    recommendationLabel: 'Offer survey-readiness enablement',
    explanation: 'These requests suggest customers need proactive guidance before audit or survey periods.',
  },
  Notifications: {
    label: 'Notification Delivery Confusion',
    tag: 'FAQ Candidate',
    recommendationLabel: 'Publish troubleshooting checklist',
    explanation: 'Repeat reminders and delivery issues can often be reduced with better self-service instructions.',
  },
  Admin: {
    label: 'Role / Entitlement Setup Questions',
    tag: 'Enablement Gap',
    recommendationLabel: 'Clarify admin coverage and permissions',
    explanation: 'This pattern usually points to local admin-readiness gaps rather than a product defect.',
  },
  Billing: {
    label: 'Subscription / Renewal Questions',
    tag: 'Outreach Recommended',
    recommendationLabel: 'Prepare AM follow-up',
    explanation: 'Commercial questions mixed with support friction are a useful early retention signal.',
  },
  Escalation: {
    label: 'Escalation Follow-Up Delays',
    tag: 'Intervention Recommended',
    recommendationLabel: 'Accelerate case follow-up',
    explanation: 'These tickets often stay open because the case is blocked on customer evidence or cross-team follow-up.',
  },
  Reporting: {
    label: 'Reporting / Export Fidelity',
    tag: 'FAQ Candidate',
    recommendationLabel: 'Document export troubleshooting',
    explanation: 'Export mismatches create manual reconciliation work and should become guided content quickly.',
  },
  Support: {
    label: 'General Support Operations',
    tag: 'Workflow Review',
    recommendationLabel: 'Tighten intake guidance',
    explanation: 'This cluster usually reflects intake quality or support-process friction.',
  },
};

export const STATUS_META = {
  Open: { label: 'Open', colorClass: 'open' },
  'In Progress': { label: 'In Progress', colorClass: 'in-progress' },
  'Waiting for Customer': { label: 'Waiting on Customer', colorClass: 'waiting' },
  Resolved: { label: 'Resolved', colorClass: 'resolved' },
  Closed: { label: 'Closed', colorClass: 'closed' },
};

// AI resolution split — percentages must sum to 100
export const AI_RESOLUTION_SEGMENTS = [
  { label: 'AI Resolved',      value: 42, color: '#2563eb' },
  { label: 'Human Resolved',   value: 35, color: '#10b981' },
  { label: 'Escalated',        value: 14, color: '#f59e0b' },
  { label: 'Still Open',       value: 9,  color: '#e2e8f0' },
];

export const AI_RESOLUTION_STATS = {
  totalInteractions: 847,
  aiResolved: 356,
  humanResolved: 296,
  escalated: 120,
  stillOpen: 75,
  ticketsDeflected: 356,
  avgAiMinutes: 24,
  avgHumanHours: 31,
};

// Time-to-resolve distribution: AI vs human ticket counts per bucket
export const TIME_DISTRIBUTION = [
  { bucket: '< 15 min',  ai: 142, human: 8  },
  { bucket: '15–60 min', ai: 118, human: 22 },
  { bucket: '1–4 hrs',   ai: 62,  human: 31 },
  { bucket: '4–24 hrs',  ai: 28,  human: 48 },
  { bucket: '1–3 days',  ai: 6,   human: 42 },
  { bucket: '3+ days',   ai: 0,   human: 34 },
];

// Escalation funnel stages
export const ESCALATION_FUNNEL_DATA = [
  { stage: 'Help Requests Started',            count: 847 },
  { stage: 'Resolved by AI',                   count: 356 },
  { stage: 'Moved to Guided Troubleshooting',  count: 234 },
  { stage: 'Escalated to Human',               count: 185 },
  { stage: 'Resolved After Escalation',        count: 162 },
];

// Support volume trend — 12 months, shows AI lift over time
export const VOLUME_TREND_DATA = [
  { label: 'Jan', total: 98,  aiResolved: 38, humanTickets: 51, escalations: 9  },
  { label: 'Feb', total: 112, aiResolved: 45, humanTickets: 56, escalations: 11 },
  { label: 'Mar', total: 134, aiResolved: 58, humanTickets: 63, escalations: 13 },
  { label: 'Apr', total: 118, aiResolved: 52, humanTickets: 54, escalations: 12 },
  { label: 'May', total: 127, aiResolved: 56, humanTickets: 58, escalations: 13 },
  { label: 'Jun', total: 143, aiResolved: 67, humanTickets: 62, escalations: 14 },
  { label: 'Jul', total: 131, aiResolved: 63, humanTickets: 55, escalations: 13 },
  { label: 'Aug', total: 156, aiResolved: 76, humanTickets: 65, escalations: 15 },
  { label: 'Sep', total: 148, aiResolved: 74, humanTickets: 61, escalations: 13 },
  { label: 'Oct', total: 162, aiResolved: 83, humanTickets: 65, escalations: 14 },
  { label: 'Nov', total: 171, aiResolved: 91, humanTickets: 66, escalations: 14 },
  { label: 'Dec', total: 159, aiResolved: 87, humanTickets: 58, escalations: 14 },
];

// Training completion by facility (%)
export const TRAINING_COMPLETION = {
  overall: 74,
  byFacility: {
    'green-valley': 82,
    'oakridge':     61,
    'sunrise':      78,
    'meadowbrook':  69,
    'silver-pines': 71,
  },
};

// AI deflection opportunity — base data that gets scaled by filtered ticket counts
export const AI_DEFLECTION_BASE = [
  {
    id: 1,
    issueType: 'Password Reset & Account Unlock',
    module: 'Account Access',
    baseWeeklyVolume: 18,
    repeatRate: 92,
    baseAvgResolutionMin: 8,
    baseDeflectionScore: 93,
    rationale: 'Highly repetitive, standard resolution steps. Perfect for self-service password reset flow or chatbot-guided unlock.',
  },
  {
    id: 2,
    issueType: 'Training Assignment How-To',
    module: 'LMS',
    baseWeeklyVolume: 14,
    repeatRate: 87,
    baseAvgResolutionMin: 12,
    baseDeflectionScore: 88,
    rationale: 'Most tickets ask the same question about bulk assignment. A guided walkthrough or chatbot can resolve instantly.',
  },
  {
    id: 3,
    issueType: 'Document Upload Troubleshooting',
    module: 'Document Café',
    baseWeeklyVolume: 11,
    repeatRate: 78,
    baseAvgResolutionMin: 15,
    baseDeflectionScore: 81,
    rationale: 'Common file-size and format issues. Chatbot can guide compression, format conversion, and retry.',
  },
  {
    id: 4,
    issueType: 'Notification Delivery Questions',
    module: 'Notifications',
    baseWeeklyVolume: 9,
    repeatRate: 81,
    baseAvgResolutionMin: 10,
    baseDeflectionScore: 79,
    rationale: 'Users frequently ask why emails are not arriving. A chatbot can check settings and bounce status automatically.',
  },
  {
    id: 5,
    issueType: 'Survey Readiness Checklist Requests',
    module: 'Survey Readiness',
    baseWeeklyVolume: 7,
    repeatRate: 74,
    baseAvgResolutionMin: 18,
    baseDeflectionScore: 70,
    rationale: 'Recurring content request. Chatbot can link to the latest checklist and confirm last refresh date.',
  },
  {
    id: 6,
    issueType: 'AI Search Relevance Questions',
    module: 'AI Search',
    baseWeeklyVolume: 6,
    repeatRate: 68,
    baseAvgResolutionMin: 22,
    baseDeflectionScore: 62,
    rationale: 'Users need coaching on query formulation. A chatbot can suggest better search strategies in real time.',
  },
  {
    id: 7,
    issueType: 'Plan of Correction Workflow Help',
    module: 'Plan of Correction',
    baseWeeklyVolume: 5,
    repeatRate: 62,
    baseAvgResolutionMin: 28,
    baseDeflectionScore: 55,
    rationale: 'Recurring questions about POC submission steps and timelines. A chatbot can walk users through the standard workflow.',
  },
  {
    id: 8,
    issueType: 'Chat Support Inquiry Routing',
    module: 'Chat',
    baseWeeklyVolume: 4,
    repeatRate: 58,
    baseAvgResolutionMin: 20,
    baseDeflectionScore: 50,
    rationale: 'Users often start chats for simple questions. An AI triage layer can resolve or route more efficiently.',
  },
];

// Platform modules for chart labels and colors
export const PLATFORM_MODULES = [
  { key: 'Document Café',    color: '#2563eb' },
  { key: 'AI Search',        color: '#8b5cf6' },
  { key: 'LMS',              color: '#10b981' },
  { key: 'Survey Readiness', color: '#f59e0b' },
  { key: 'Plan of Correction', color: '#ef4444' },
  { key: 'Notifications',    color: '#0ea5e9' },
  { key: 'Account Access',   color: '#f97316' },
  { key: 'Chat',             color: '#ec4899' },
];

// Ticket theme categories for Chart 3
export const TICKET_THEME_CATEGORIES = [
  { key: 'Document Access', color: '#2563eb' },
  { key: 'Training & LMS',                      color: '#10b981' },
  { key: 'Survey Readiness',                    color: '#f59e0b' },
  { key: 'Plan of Correction',                  color: '#ef4444' },
  { key: 'AI Search',                           color: '#8b5cf6' },
  { key: 'Access & Login',                      color: '#f97316' },
  { key: 'Billing',                             color: '#64748b' },
  { key: 'AI Chat',                              color: '#0ea5e9' },
];

// Map ltcArea to theme category for chart 3
export const LTC_AREA_TO_THEME = {
  Documents:     'Document Access',
  Training:      'Training & LMS',
  Search:        'AI Search',
  Access:        'Access & Login',
  Billing:       'Billing',
  Alerts:        'AI Chat',
  Compliance:    'Survey Readiness',
  Notifications: 'AI Chat',
  Admin:         'Access & Login',
  Escalation:    'Plan of Correction',
  Reporting:     'Survey Readiness',
  Support:       'Document Access',
};

// Pre-seeded base health scores giving realistic demo spread.
// Live ticket deltas (unresolved, critical) adjust these values ±10 pts.
export const FACILITY_HEALTH_BASE = {
  'green-valley': 72,   // Watchlist — high training but persistent doc issues
  'oakridge':     86,   // Healthy — low unresolved, strong closure rate
  'sunrise':      67,   // Watchlist — moderate load, training near target
  'meadowbrook':  44,   // At Risk — high unresolved, critical tickets stalled
  'silver-pines': 54,   // Needs Attention — login/access friction recurring
};
