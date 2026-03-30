import { useEffect, useMemo, useState } from 'react';
import {
  FiActivity,
  FiAlertTriangle,
  FiArrowRight,
  FiBookOpen,
  FiBriefcase,
  FiCpu,
  FiInfo,
  FiLock,
  FiPlus,
  FiSearch,
  FiShield,
  FiTrendingUp,
  FiUsers,
  FiX,
} from 'react-icons/fi';
import { usePersona } from '../../context/PersonaContext';
import { MOCK_USERS, MOCK_COMPANIES, MOCK_AUDIT_LOG } from '../../data/adminMockData';
import { MOCK_TICKETS } from '../../data/supportMockData';
import './AdminConsole.css';

const UNRESOLVED_STATUSES = ['Open', 'In Progress', 'Waiting for Customer'];
const SUPPORT_THEME_LABELS = {
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

const FAQ_SUGGESTION_MAP = {
  Training: 'How should new-hire training be assigned and monitored without creating repeat support tickets?',
  Compliance: 'Where should facility admins start when they need survey-readiness guidance?',
  Documents: 'What should a facility do when Document Cafe uploads or previews fail?',
  Search: 'How can teams improve AI search results for current F-tag guidance?',
  Alerts: 'Why are clinical alerts inconsistent during mobile or rounding workflows?',
  Notifications: 'What should admins check when only one employee is missing reminder emails?',
  Admin: 'How should facility admins and backup approvers be configured?',
  Billing: 'When should support trends trigger account-manager follow-up before renewal?',
  Reporting: 'What should teams verify when exports do not match dashboard results?',
  Escalation: 'What information is required before an escalation can move forward?',
  Access: 'What should happen when a staff member is locked out before a compliance deadline?',
  Support: 'What should be included in a strong support request to reduce back-and-forth?',
};

function formatDate(iso) {
  if (!iso) {
    return '—';
  }
  const date = new Date(iso);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDateTime(iso) {
  if (!iso) {
    return '—';
  }
  const date = new Date(iso);
  return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ${date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })}`;
}

function getRoleClass(role) {
  const map = {
    'TCS Admin': 'tcs-admin',
    'TCS Employee': 'tcs-employee',
    'Account Manager': 'account-manager',
    'Customer Admin': 'customer-admin',
    'Customer Employee': 'customer-employee',
  };
  return map[role] || 'customer-employee';
}

function getPlanClass(plan) {
  if (!plan) return 'basic';
  if (plan.includes('Full')) return 'full';
  if (plan.includes('Frontline')) return 'frontline';
  if (plan.includes('Café')) return 'cafe';
  return 'basic';
}

function getScoreClass(score) {
  if (score >= 82) {
    return 'good';
  }
  if (score >= 65) {
    return 'warning';
  }
  return 'poor';
}

function getPersonaSubtitle(persona) {
  switch (persona.id) {
    case 'tcs-admin':
      return 'Run platform operations, spot account risk, and guide support strategy across every facility.';
    case 'tcs-employee':
      return 'Monitor operational patterns, recurring issues, and support readiness across visible accounts.';
    case 'customer-admin':
      return 'Review your facility’s admin readiness, support themes, and recommended next actions.';
    case 'customer-employee':
      return 'View your profile and company access details.';
    case 'account-manager':
      return 'Track support health and intervention signals across your assigned account portfolio.';
    default:
      return 'Admin Console';
  }
}

function getVisibleSupportTickets(tickets, persona) {
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
      return [];
  }
}

function themeLabel(theme) {
  return SUPPORT_THEME_LABELS[theme] || theme || 'Support Operations';
}

function buildActionFromTheme(theme, companyName, companyInsight) {
  switch (theme) {
    case 'Training':
      return {
        title: `Recommend onboarding refresher for ${companyName}`,
        owner: 'Enablement',
        detail: 'Repeated training and setup questions suggest a short role-based walkthrough would reduce repeat demand.',
        tone: 'info',
      };
    case 'Compliance':
      return {
        title: `Offer survey-readiness review to ${companyName}`,
        owner: 'Customer Success',
        detail: 'Recurring compliance-content questions indicate a need for proactive guidance before they become escalations.',
        tone: 'warning',
      };
    case 'Documents':
      return {
        title: `Schedule Document Cafe office hours for ${companyName}`,
        owner: 'Support Ops',
        detail: 'Document upload and preview issues are tied to a high-value LTC workflow and deserve proactive enablement.',
        tone: 'info',
      };
    case 'Billing':
      return {
        title: `Coordinate renewal narrative for ${companyName}`,
        owner: 'Account Manager',
        detail: 'Commercial questions are appearing alongside support friction, making this a good moment for account outreach.',
        tone: 'warning',
      };
    case 'Access':
      return {
        title: `Review admin coverage and lockout handling for ${companyName}`,
        owner: 'Admin Team',
        detail: 'Access issues close to deadlines usually point to admin-readiness gaps or missing backup coverage.',
        tone: 'warning',
      };
    default:
      if (companyInsight.unresolvedCount >= 4 || companyInsight.supportHealthTone === 'poor') {
        return {
          title: `Account-manager outreach recommended for ${companyName}`,
          owner: 'Account Manager',
          detail: 'Open issue volume and repeat friction suggest proactive outreach to protect adoption and satisfaction.',
          tone: 'critical',
        };
      }
      return {
        title: `Publish FAQ candidate for ${companyName}`,
        owner: 'Knowledge Management',
        detail: 'Turn repeated support themes into guided self-service content to reduce future ticket load.',
        tone: 'info',
      };
  }
}

function buildFacilityRiskDetail(companyName, dominantThemeLabel, unresolvedCount, criticalCount, waitingCount, adminUsersCount, tone) {
  const reasons = [];

  if (criticalCount >= 2) {
    reasons.push(`${criticalCount} high-severity support issues are still active`);
  } else if (criticalCount === 1) {
    reasons.push('a high-severity issue is still active');
  }

  if (waitingCount >= 2) {
    reasons.push(`${waitingCount} tickets are stalled waiting for customer follow-up`);
  } else if (waitingCount === 1) {
    reasons.push('one ticket is blocked waiting for customer follow-up');
  }

  if (unresolvedCount >= 4) {
    reasons.push(`${unresolvedCount} unresolved tickets are accumulating in the queue`);
  } else if (unresolvedCount >= 2) {
    reasons.push(`repeat friction is building across ${unresolvedCount} unresolved requests`);
  }

  if (adminUsersCount === 0) {
    reasons.push('no visible customer-admin coverage is available');
  } else if (adminUsersCount === 1 && tone !== 'good') {
    reasons.push('only one admin is covering the account');
  }

  if (dominantThemeLabel) {
    reasons.push(`the strongest pattern is in ${dominantThemeLabel}`);
  }

  if (reasons.length === 0) {
    return `${companyName} should stay on watch because support activity is rising even though there is not yet a single dominant failure point.`;
  }

  return `${companyName} needs attention because ${reasons.slice(0, 2).join(' and ')}.`;
}

function trimSentence(value = '') {
  return value.replace(/\.$/, '');
}

function buildCompanyInsight(company, users, supportTickets) {
  const companyUsers = users.filter((user) => user.companyId === company.id);
  const adminUsers = companyUsers.filter((user) => user.role === 'Customer Admin');
  const unresolvedTickets = supportTickets.filter((ticket) => UNRESOLVED_STATUSES.includes(ticket.status));
  const waitingTickets = supportTickets.filter((ticket) => ticket.status === 'Waiting for Customer');
  const criticalTickets = supportTickets.filter((ticket) => ticket.priority === 'Critical' || ticket.priority === 'High');
  const recentTickets = [...supportTickets]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 4);

  const themeCounts = supportTickets.reduce((accumulator, ticket) => {
    const key = ticket.ltcArea || 'Support';
    accumulator[key] = (accumulator[key] || 0) + 1;
    return accumulator;
  }, {});

  const themeTicketMap = supportTickets.reduce((accumulator, ticket) => {
    const key = ticket.ltcArea || 'Support';
    if (!accumulator[key]) {
      accumulator[key] = [];
    }
    accumulator[key].push(ticket);
    return accumulator;
  }, {});

  const topThemes = Object.entries(themeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([theme, count]) => ({
      key: theme,
      label: themeLabel(theme),
      count,
      detail: (() => {
        const sampleTicket = (themeTicketMap[theme] || [])
          .slice()
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0];
        if (!sampleTicket) {
          return `${count} ticket${count !== 1 ? 's' : ''} tied to ${themeLabel(theme).toLowerCase()}.`;
        }
        return `${count} ticket${count !== 1 ? 's' : ''} tied to ${themeLabel(theme).toLowerCase()}, led by "${trimSentence(sampleTicket.subject)}".`;
      })(),
    }));

  const rawHealthScore = Math.round(
    company.complianceScore * 0.45 +
    (100 - unresolvedTickets.length * 11 - criticalTickets.length * 9 - waitingTickets.length * 7 - (adminUsers.length === 0 ? 12 : 0)) * 0.55
  );
  const supportHealthScore = Math.max(0, Math.min(100, rawHealthScore));
  const supportHealthTone = getScoreClass(supportHealthScore);

  const recommendedActions = [];
  const topThemeTickets = topThemes.map((theme) => {
    const themeTickets = (themeTicketMap[theme.key] || []).slice().sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    return {
      ...theme,
      topTicket: themeTickets[0] || null,
      secondTicket: themeTickets[1] || null,
    };
  });

  topThemeTickets.slice(0, 2).forEach((theme, index) => {
    if (!theme.topTicket) {
      return;
    }
    const baseAction = buildActionFromTheme(theme.key, company.name, {
      unresolvedCount: unresolvedTickets.length,
      supportHealthTone,
    });
    recommendedActions.push({
      ...baseAction,
      detail: index === 0
        ? `${trimSentence(theme.topTicket.issueSummary || theme.topTicket.description || baseAction.detail)} at ${company.name}, so ${baseAction.detail.charAt(0).toLowerCase()}${baseAction.detail.slice(1)}`
        : `${trimSentence(theme.topTicket.subject)} is one of the repeat themes here, and ${baseAction.detail.charAt(0).toLowerCase()}${baseAction.detail.slice(1)}`,
    });
  });
  if (adminUsers.length === 0) {
    recommendedActions.push({
      title: `Restore admin coverage for ${company.name}`,
      owner: 'Admin Team',
      detail: 'No visible customer-admin user is assigned, which creates operational risk for approvals and user management.',
      tone: 'critical',
    });
  }
  if (recommendedActions.length < 3) {
    recommendedActions.push({
      title: `Build FAQ for ${company.name}`,
      owner: 'Knowledge Management',
      detail: recentTickets[0]
        ? `Use the recent "${trimSentence(recentTickets[0].subject)}" pattern to create self-service guidance and reduce repeat support dependency.`
        : 'Use recent repeat questions to create self-service guidance and reduce support dependency.',
      tone: 'info',
    });
  }

  const faqCandidates = topThemeTickets.slice(0, 2).map((theme) => ({
    question: theme.topTicket
      ? `How should ${company.name} handle "${trimSentence(theme.topTicket.subject).toLowerCase()}"?`
      : FAQ_SUGGESTION_MAP[theme.key] || `How can ${company.name} reduce repeat support issues in ${theme.label.toLowerCase()}?`,
    reason: theme.topTicket
      ? `${theme.count} recurring ${theme.label.toLowerCase()} tickets, including "${trimSentence(theme.topTicket.subject)}," suggest this should become guided content.`
      : `${theme.count} recurring tickets suggest this should become guided content.`,
  }));

  if (faqCandidates.length < 3 && recentTickets[0]) {
    faqCandidates.push({
      question: `What should staff collect before opening a ticket about "${trimSentence(recentTickets[0].subject).toLowerCase()}"?`,
      reason: `Recent activity at ${company.name} suggests better intake guidance would shorten troubleshooting time.`,
    });
  }

  const adminCoverageLabel = adminUsers.length === 0
    ? 'No visible admin coverage'
    : adminUsers.length === 1
      ? 'Single admin coverage'
      : 'Healthy admin coverage';

  const riskSummary = supportHealthTone === 'poor'
    ? buildFacilityRiskDetail(company.name, topThemes[0]?.label, unresolvedTickets.length, criticalTickets.length, waitingTickets.length, adminUsers.length, supportHealthTone)
    : supportHealthTone === 'warning'
      ? buildFacilityRiskDetail(company.name, topThemes[0]?.label, unresolvedTickets.length, criticalTickets.length, waitingTickets.length, adminUsers.length, supportHealthTone)
      : `${company.name} appears healthy overall, but recent activity still suggests a follow-up opportunity around ${topThemes[0]?.label || 'support operations'}.`;

  return {
    ...company,
    companyUsers,
    adminUsers,
    totalTickets: supportTickets.length,
    unresolvedCount: unresolvedTickets.length,
    waitingCount: waitingTickets.length,
    criticalCount: criticalTickets.length,
    topThemes,
    recentTickets,
    supportHealthScore,
    supportHealthTone,
    recommendedActions: recommendedActions.slice(0, 3),
    faqCandidates,
    adminCoverageLabel,
    adminCoverageTone: adminUsers.length === 0 ? 'poor' : adminUsers.length === 1 ? 'warning' : 'good',
    riskSummary,
  };
}

function buildPortfolioInsights(companyInsights, supportTickets, activePersona) {
  const atRiskCompanies = companyInsights.filter((company) => company.supportHealthTone !== 'good');
  const unresolvedTickets = supportTickets.filter((ticket) => UNRESOLVED_STATUSES.includes(ticket.status));
  const themeCounts = supportTickets.reduce((accumulator, ticket) => {
    const key = ticket.ltcArea || 'Support';
    accumulator[key] = (accumulator[key] || 0) + 1;
    return accumulator;
  }, {});

  const recurringThemes = Object.entries(themeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([theme, count]) => ({
      key: theme,
      label: themeLabel(theme),
      count,
      detail: `${count} tickets point to repeat friction around ${themeLabel(theme).toLowerCase()}.`,
    }));

  const personaCardConfig = {
    'tcs-admin': {
      themesTitle: 'Recurring LTC Issue Themes',
      themesSubtitle: 'Patterns showing where platform, content, or enablement work should be prioritized.',
      facilitiesTitle: 'Facilities Needing Follow-Up',
      facilitiesSubtitle: 'Accounts with the strongest intervention signals across the visible portfolio.',
      faqTitle: 'FAQ / Knowledge Opportunities',
      faqSubtitle: 'Topics that should become self-service content or guided workflows.',
      actionsTitle: 'Recommended Next Actions',
      actionsSubtitle: 'What TCS leadership, support, and customer success should do next.',
    },
    'tcs-employee': {
      themesTitle: 'Operational Trouble Spots',
      themesSubtitle: 'The issue clusters driving the most support effort right now.',
      facilitiesTitle: 'Accounts Requiring Operational Attention',
      facilitiesSubtitle: 'Facilities where support follow-up or enablement would likely reduce repeat tickets.',
      faqTitle: 'Support Content Candidates',
      faqSubtitle: 'Knowledge articles or quick guides that could reduce back-and-forth.',
      actionsTitle: 'Support Team Recommendations',
      actionsSubtitle: 'The highest-value next steps for support operations and enablement.',
    },
    'account-manager': {
      themesTitle: 'Customer Friction Themes',
      themesSubtitle: 'Patterns that matter for adoption, satisfaction, and renewal conversations.',
      facilitiesTitle: 'Accounts To Watch',
      facilitiesSubtitle: 'Assigned facilities where outreach or review may protect account health.',
      faqTitle: 'Customer Education Opportunities',
      faqSubtitle: 'Content topics that could improve self-service and reduce customer frustration.',
      actionsTitle: 'AM Next Best Actions',
      actionsSubtitle: 'Recommended account-manager follow-up based on support behavior.',
    },
    'customer-admin': {
      themesTitle: 'Your Facility’s Repeating Issues',
      themesSubtitle: 'The support themes most relevant to your team’s day-to-day workflows.',
      facilitiesTitle: 'Your Facility Follow-Up Signals',
      facilitiesSubtitle: 'Why your facility may need extra training, admin cleanup, or support follow-up.',
      faqTitle: 'Suggested Help Content',
      faqSubtitle: 'Topics that would likely reduce confusion for your staff and admins.',
      actionsTitle: 'Recommended Actions For Your Team',
      actionsSubtitle: 'Practical next steps to reduce repeat issues and improve readiness.',
    },
  };

  const selectedCardConfig = personaCardConfig[activePersona.id] || personaCardConfig['tcs-admin'];
  const companiesByRisk = companyInsights.slice().sort((a, b) => a.supportHealthScore - b.supportHealthScore);
  const companiesByReadinessGap = companyInsights
    .slice()
    .sort((a, b) => {
      if (a.adminUsers.length !== b.adminUsers.length) {
        return a.adminUsers.length - b.adminUsers.length;
      }
      return b.waitingCount - a.waitingCount;
    });
  const companiesByRenewalPressure = companyInsights
    .slice()
    .sort((a, b) => {
      const aTime = a.renewalDate ? new Date(a.renewalDate).getTime() : Number.MAX_SAFE_INTEGER;
      const bTime = b.renewalDate ? new Date(b.renewalDate).getTime() : Number.MAX_SAFE_INTEGER;
      return aTime - bTime;
    });

  let personaThemes = recurringThemes;
  let followUpCompanies = companiesByRisk.slice(0, 3);
  let faqCandidates = recurringThemes.slice(0, 3).map((theme) => ({
    title: FAQ_SUGGESTION_MAP[theme.key] || `How do we reduce repeat issues related to ${theme.label}?`,
    detail: `${theme.count} recent tickets suggest this should become self-service content or an in-product guide.`,
  }));
  let recommendedActions = [];

  if (activePersona.id === 'tcs-admin') {
    personaThemes = recurringThemes.map((theme) => ({
      ...theme,
      detail: `${theme.count} visible tickets are signaling portfolio-level drag in ${theme.label.toLowerCase()}, making this a candidate for cross-tenant product or enablement work.`,
    }));
    followUpCompanies = companiesByRisk.slice(0, 3);
    faqCandidates = recurringThemes.slice(0, 3).map((theme) => ({
      title: FAQ_SUGGESTION_MAP[theme.key] || `How should TCS address repeat issues in ${theme.label}?`,
      detail: `This theme is repeating across the portfolio, so converting it into shared guidance would reduce escalations and support effort.`,
    }));
    if (recurringThemes.some((theme) => theme.key === 'Compliance')) {
      recommendedActions.push({
        title: 'Standardize survey-readiness enablement',
        owner: 'Customer Success',
        detail: 'Compliance-content issues are appearing across multiple facilities, so a shared readiness playbook would create leverage.',
        tone: 'warning',
      });
    }
    if (atRiskCompanies.length > 0) {
      recommendedActions.push({
        title: 'Escalate top at-risk facilities for leadership review',
        owner: 'TCS Admin',
        detail: `${atRiskCompanies.length} visible ${atRiskCompanies.length === 1 ? 'account is' : 'accounts are'} showing enough friction to justify coordinated intervention.`,
        tone: 'critical',
      });
    }
    recommendedActions.push({
      title: 'Feed recurring themes into roadmap and knowledge planning',
      owner: 'Product + Knowledge',
      detail: 'Use these patterns to decide whether the right fix is content, process, or platform enhancement.',
      tone: 'info',
    });
  } else if (activePersona.id === 'tcs-employee') {
    personaThemes = recurringThemes.map((theme) => ({
      ...theme,
      detail: `${theme.count} tickets are driving operational effort in ${theme.label.toLowerCase()}, which points to where support playbooks should tighten.`,
    }));
    followUpCompanies = companiesByRisk
      .map((company) => ({
        ...company,
        riskSummary: `${company.name} needs support-ops attention because ${company.waitingCount > 0 ? `${company.waitingCount} case${company.waitingCount !== 1 ? 's are' : ' is'} waiting on customer follow-up` : `${company.unresolvedCount} unresolved tickets are still open`} and ${company.topThemes[0]?.label || 'support operations'} remains the strongest friction area.`,
      }))
      .slice(0, 3);
    faqCandidates = recurringThemes.slice(0, 3).map((theme) => ({
      title: `Draft support playbook: ${theme.label}`,
      detail: `Support is repeatedly handling ${theme.label.toLowerCase()} questions, so a quick guide or response template would reduce back-and-forth.`,
    }));
    recommendedActions = [
      {
        title: 'Prioritize backlog cleanup for waiting cases',
        owner: 'Support Ops',
        detail: 'Waiting-on-customer cases are consuming queue attention and should be actively nudged or closed.',
        tone: 'warning',
      },
      {
        title: 'Create reusable responder guidance for top issue themes',
        owner: 'Knowledge Management',
        detail: 'The highest-volume issue clusters should have standard handling notes for faster, more consistent triage.',
        tone: 'info',
      },
      {
        title: 'Pair with enablement on repeat training tickets',
        owner: 'Enablement',
        detail: 'Training-related friction is better solved with coached adoption than repeated reactive support.',
        tone: 'info',
      },
    ];
  } else if (activePersona.id === 'account-manager') {
    personaThemes = recurringThemes.map((theme) => ({
      ...theme,
      detail: `${theme.count} tickets are contributing to customer friction in ${theme.label.toLowerCase()}, which matters for adoption and renewal conversations.`,
    }));
    followUpCompanies = companiesByRenewalPressure
      .filter((company) => company.supportHealthTone !== 'good' || company.criticalCount > 0)
      .map((company) => ({
        ...company,
        riskSummary: `${company.name} merits AM follow-up because renewal is approaching, ${company.criticalCount > 0 ? `${company.criticalCount} high-severity issue${company.criticalCount !== 1 ? 's are' : ' is'} active` : `${company.unresolvedCount} unresolved tickets remain open`}, and ${company.topThemes[0]?.label || 'support demand'} is affecting account confidence.`,
      }))
      .slice(0, 3);
    faqCandidates = recurringThemes.slice(0, 3).map((theme) => ({
      title: `Customer education topic: ${theme.label}`,
      detail: `This issue theme is recurring enough that a customer-facing guide could improve adoption and reduce frustration before renewal discussions.`,
    }));
    recommendedActions = [
      {
        title: 'Schedule account check-ins for highest-friction facilities',
        owner: 'Account Manager',
        detail: 'Use current support patterns to proactively discuss risk, adoption blockers, and upcoming milestones.',
        tone: 'critical',
      },
      {
        title: 'Package top issue themes into success outreach',
        owner: 'Customer Success',
        detail: 'Targeted enablement tied to recurring friction gives outreach a stronger business story.',
        tone: 'warning',
      },
      {
        title: 'Convert repeated questions into renewal-supporting guidance',
        owner: 'Knowledge Management',
        detail: 'Clear help content can reduce ticket volume while improving customer confidence in the platform.',
        tone: 'info',
      },
    ];
  } else if (activePersona.id === 'customer-admin') {
    personaThemes = recurringThemes.map((theme) => ({
      ...theme,
      detail: `${theme.count} recent tickets from your facility suggest staff need more clarity around ${theme.label.toLowerCase()}.`,
    }));
    followUpCompanies = companiesByReadinessGap
      .map((company) => ({
        ...company,
        riskSummary: `${company.name} should focus on ${company.adminUsers.length <= 1 ? 'admin readiness and backup coverage' : 'staff follow-through'} because ${company.waitingCount > 0 ? `${company.waitingCount} requests are waiting on customer action` : `${company.unresolvedCount} issues are still open`} and ${company.topThemes[0]?.label || 'support activity'} is recurring.`,
      }))
      .slice(0, 3);
    faqCandidates = recurringThemes.slice(0, 3).map((theme) => ({
      title: `Staff help topic: ${theme.label}`,
      detail: `This is a good candidate for local training or a shared internal guide so your team can solve it faster next time.`,
    }));
    recommendedActions = [
      {
        title: 'Review open items waiting on your team',
        owner: 'Facility Admin',
        detail: 'Closing the loop on customer-side follow-up is the fastest way to reduce current support backlog.',
        tone: 'warning',
      },
      {
        title: 'Coach staff on the most repeated workflow issue',
        owner: 'Facility Admin',
        detail: 'A short targeted walkthrough for the top problem area will likely prevent repeat tickets.',
        tone: 'info',
      },
      {
        title: 'Confirm backup admin coverage before deadlines',
        owner: 'Facility Leadership',
        detail: 'Admin gaps create avoidable ticket volume when approvals, assignments, or access requests are time-sensitive.',
        tone: 'info',
      },
    ];
  }

  const healthScore = companyInsights.length === 0
    ? 0
    : Math.round(companyInsights.reduce((sum, company) => sum + company.supportHealthScore, 0) / companyInsights.length);

  return {
    healthScore,
    healthTone: getScoreClass(healthScore),
    atRiskCount: atRiskCompanies.length,
    unresolvedCount: unresolvedTickets.length,
    recurringThemes: personaThemes,
    followUpCompanies,
    faqCandidates,
    recommendedActions: recommendedActions.slice(0, 3),
    cardConfig: selectedCardConfig,
    intro: activePersona.id === 'customer-admin'
      ? 'This console turns your facility’s support activity into readiness, enablement, and intervention guidance.'
      : 'This console turns support activity into tenant-level insight, helping TCS spot risk, improve adoption, and guide customer success action.',
  };
}

function CompanyDetailDrawer({ company, onClose }) {
  if (!company) {
    return null;
  }

  return (
    <div className="ac-drawer-overlay" role="dialog" aria-modal="true" aria-labelledby="company-detail-title">
      <div className="ac-drawer-backdrop" onClick={onClose} />
      <aside className="ac-drawer-panel">
        <div className="ac-drawer-header">
          <div>
            <div className="ac-drawer-eyebrow">Account intelligence</div>
            <h2 id="company-detail-title">{company.name}</h2>
            <p>{company.facilityType} · {company.state} · {company.plan} plan</p>
          </div>
          <button type="button" className="ac-drawer-close" onClick={onClose} aria-label="Close account detail">
            <FiX size={18} />
          </button>
        </div>

        <div className="ac-drawer-body">
          <section className="ac-drawer-card">
            <p className="ac-risk-summary">{company.riskSummary}</p>
          </section>

          <section className="ac-drawer-grid">
            <div className="ac-drawer-card">
              <h3>Recommended Actions</h3>
              <div className="ac-action-list">
                {company.recommendedActions.map((action) => (
                  <div key={action.title} className={`ac-action-card ${action.tone}`}>
                    <strong>{action.title}</strong>
                    <p>{action.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="ac-drawer-card">
              <h3>Top Issue Themes</h3>
              <div className="ac-insight-list">
                {company.topThemes.map((theme) => (
                  <div key={theme.key} className="ac-insight-item">
                    <strong>{theme.label}</strong>
                    <span className="ac-insight-count">{theme.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="ac-drawer-card">
            <h3>Recommended FAQs</h3>
            <div className="ac-faq-list">
              {company.faqCandidates.map((faq) => (
                <div key={faq.question} className="ac-faq-item">
                  <strong>{faq.question}</strong>
                </div>
              ))}
            </div>
          </section>
        </div>
      </aside>
    </div>
  );
}

export default function AdminConsolePage() {
  const { activePersona } = usePersona();
  const [activeTab, setActiveTab] = useState('overview');
  const [userSearch, setUserSearch] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setUserSearch('');
    setSelectedCompanyId(null);
    if (activePersona.id === 'customer-employee') {
      setActiveTab('profile');
    } else {
      setActiveTab('overview');
    }
  }, [activePersona.id]);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }
    const timeout = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timeout);
  }, [toast]);

  const visibleUsers = useMemo(() => {
    switch (activePersona.id) {
      case 'tcs-admin':
      case 'tcs-employee':
        return MOCK_USERS;
      case 'customer-admin':
        return MOCK_USERS.filter((user) => user.companyId === activePersona.companyId);
      case 'customer-employee':
        return MOCK_USERS.filter((user) => user.id === activePersona.userId);
      case 'account-manager':
        return MOCK_USERS.filter((user) => user.companyId === null || (activePersona.assignedCompanies || []).includes(user.companyId));
      default:
        return [];
    }
  }, [activePersona]);

  const visibleCompanies = useMemo(() => {
    switch (activePersona.id) {
      case 'tcs-admin':
      case 'tcs-employee':
        return MOCK_COMPANIES;
      case 'customer-admin':
      case 'customer-employee':
        return MOCK_COMPANIES.filter((company) => company.id === activePersona.companyId);
      case 'account-manager':
        return MOCK_COMPANIES.filter((company) => (activePersona.assignedCompanies || []).includes(company.id));
      default:
        return [];
    }
  }, [activePersona]);

  const visibleAuditLog = useMemo(() => {
    switch (activePersona.id) {
      case 'tcs-admin':
      case 'tcs-employee':
        return MOCK_AUDIT_LOG;
      case 'account-manager':
        return MOCK_AUDIT_LOG.filter((entry) => entry.companyId === null || (activePersona.assignedCompanies || []).includes(entry.companyId));
      case 'customer-admin':
        return MOCK_AUDIT_LOG.filter((entry) => entry.companyId === activePersona.companyId);
      default:
        return [];
    }
  }, [activePersona]);

  const visibleSupportTickets = useMemo(
    () => getVisibleSupportTickets(MOCK_TICKETS, activePersona),
    [activePersona]
  );

  const companyInsights = useMemo(() => {
    return visibleCompanies.map((company) => {
      const companyTickets = visibleSupportTickets.filter((ticket) => ticket.companyId === company.id);
      return buildCompanyInsight(company, visibleUsers, companyTickets);
    });
  }, [visibleCompanies, visibleUsers, visibleSupportTickets]);

  const portfolioInsights = useMemo(
    () => buildPortfolioInsights(companyInsights, visibleSupportTickets, activePersona),
    [companyInsights, visibleSupportTickets, activePersona]
  );

  const selectedCompany = useMemo(
    () => companyInsights.find((company) => company.id === selectedCompanyId) || null,
    [companyInsights, selectedCompanyId]
  );

  const filteredUsers = useMemo(() => {
    if (!userSearch.trim()) {
      return visibleUsers;
    }
    const query = userSearch.toLowerCase();
    return visibleUsers.filter((user) =>
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query) ||
      user.company.toLowerCase().includes(query)
    );
  }, [visibleUsers, userSearch]);

  const canAddUser = activePersona.id === 'tcs-admin' || activePersona.id === 'customer-admin';
  const isReadOnly = activePersona.id === 'tcs-employee' || activePersona.id === 'account-manager';
  const showAuditTab = ['tcs-admin', 'tcs-employee', 'account-manager', 'customer-admin'].includes(activePersona.id);

  function handleAddUser() {
    setToast({
      message: 'Add User: this would open the scoped user creation workflow in a production implementation.',
      type: 'info',
    });
  }

  if (activePersona.id === 'customer-employee') {
    const myUser = MOCK_USERS.find((user) => user.id === activePersona.userId) || {};
    const myCompany = MOCK_COMPANIES.find((company) => company.id === activePersona.companyId) || {};
    return (
      <div className="ac-page">
        <div className="ac-header">
          <h1 className="ac-title">My Account</h1>
          <p className="ac-subtitle">{getPersonaSubtitle(activePersona)}</p>
        </div>

        <div className="ac-persona-banner">
          <span className={`ac-persona-banner-dot ${activePersona.colorClass}`} />
          <span>Viewing as <strong>{activePersona.label}</strong> — {activePersona.description}</span>
        </div>

        <div className="ac-readonly-banner">
          <FiLock size={13} />
          Read-only view. Contact your administrator to update account details.
        </div>

        <div className="ac-profile-card">
          <h2 className="ac-profile-title">User Profile</h2>
          <div className="ac-profile-field">
            <div className="ac-profile-label">Full Name</div>
            <div className="ac-profile-value">{myUser.name || '—'}</div>
          </div>
          <div className="ac-profile-field">
            <div className="ac-profile-label">Email</div>
            <div className="ac-profile-value">{myUser.email || '—'}</div>
          </div>
          <div className="ac-profile-field">
            <div className="ac-profile-label">Role</div>
            <div className="ac-profile-value">
              <span className={`ac-role-badge ${getRoleClass(myUser.role)}`}>{myUser.role}</span>
            </div>
          </div>
          <div className="ac-profile-field">
            <div className="ac-profile-label">Company</div>
            <div className="ac-profile-value">{myCompany.name || myUser.company || '—'}</div>
          </div>
          <div className="ac-profile-field">
            <div className="ac-profile-label">Subscription Plan</div>
            <div className="ac-profile-value">
              <span className={`ac-plan-badge ${getPlanClass(myCompany.plan)}`}>{myCompany.plan || '—'}</span>
            </div>
          </div>
          <div className="ac-profile-field">
            <div className="ac-profile-label">Account Status</div>
            <div className="ac-profile-value">
              <span className={`ac-status-badge ${(myUser.status || 'active').toLowerCase()}`}>
                <span className="ac-status-dot" />
                {myUser.status || 'Active'}
              </span>
            </div>
          </div>
          <div className="ac-profile-field">
            <div className="ac-profile-label">Last Login</div>
            <div className="ac-profile-value">{formatDateTime(myUser.lastLogin)}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ac-page">
      <div className="ac-header">
        <div className="ac-header-row">
          <div>
            <div className="ac-eyebrow">Support Operations Control Tower</div>
            <h1 className="ac-title">Admin Console</h1>
            <p className="ac-subtitle">{getPersonaSubtitle(activePersona)}</p>
          </div>
          <div className="ac-header-actions">
            {canAddUser && (
              <button className="ac-btn-primary" onClick={handleAddUser}>
                <FiPlus size={13} />
                Add User
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="ac-persona-banner">
        <span className={`ac-persona-banner-dot ${activePersona.colorClass}`} />
        <span>Viewing as <strong>{activePersona.label}</strong> — {activePersona.description}</span>
      </div>

      {isReadOnly && (
        <div className="ac-readonly-banner">
          <FiInfo size={13} />
          You have read-only access to this console. Use the insight layers to guide follow-up rather than making configuration changes.
        </div>
      )}

      <div className="ac-tab-bar">
        <button className={`ac-tab${activeTab === 'overview' ? ' active' : ''}`} onClick={() => setActiveTab('overview')}>
          <FiCpu size={14} />
          AI Insights
        </button>
        <button className={`ac-tab${activeTab === 'companies' ? ' active' : ''}`} onClick={() => setActiveTab('companies')}>
          <FiBriefcase size={14} />
          Companies
          <span className="ac-tab-count">{visibleCompanies.length}</span>
        </button>
        <button className={`ac-tab${activeTab === 'users' ? ' active' : ''}`} onClick={() => setActiveTab('users')}>
          <FiUsers size={14} />
          Users
          <span className="ac-tab-count">{visibleUsers.length}</span>
        </button>
        {showAuditTab && (
          <button className={`ac-tab${activeTab === 'audit' ? ' active' : ''}`} onClick={() => setActiveTab('audit')}>
            <FiActivity size={14} />
            Audit Log
            <span className="ac-tab-count">{visibleAuditLog.length}</span>
          </button>
        )}
      </div>

      {activeTab === 'overview' && (
        <div className="ac-overview">
          <div className="ac-intelligence-grid">
            <section className="ac-intelligence-card">
              <div className="ac-intelligence-card-header">
                <span className="ac-intelligence-icon"><FiTrendingUp size={16} /></span>
                <div>
                  <h3>{portfolioInsights.cardConfig.themesTitle}</h3>
                  <p>{portfolioInsights.cardConfig.themesSubtitle}</p>
                </div>
              </div>
              <div className="ac-insight-list">
                {portfolioInsights.recurringThemes.map((theme) => (
                  <div key={theme.key} className="ac-insight-item">
                    <div>
                      <strong>{theme.label}</strong>
                      <p>{theme.detail}</p>
                    </div>
                    <span className="ac-insight-count">{theme.count}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="ac-intelligence-card">
              <div className="ac-intelligence-card-header">
                <span className="ac-intelligence-icon"><FiAlertTriangle size={16} /></span>
                <div>
                  <h3>{portfolioInsights.cardConfig.facilitiesTitle}</h3>
                  <p>{portfolioInsights.cardConfig.facilitiesSubtitle}</p>
                </div>
              </div>
              <div className="ac-insight-list">
                {portfolioInsights.followUpCompanies.map((company) => (
                  <div key={company.id} className="ac-insight-item">
                    <div>
                      <strong>{company.name}</strong>
                      <p>{company.riskSummary}</p>
                    </div>
                    <span className={`ac-health-pill ${company.supportHealthTone}`}>{company.supportHealthTone === 'good' ? 'Healthy' : company.supportHealthTone === 'warning' ? 'Watch' : 'Risk'}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="ac-intelligence-card">
              <div className="ac-intelligence-card-header">
                <span className="ac-intelligence-icon"><FiBookOpen size={16} /></span>
                <div>
                  <h3>{portfolioInsights.cardConfig.faqTitle}</h3>
                  <p>{portfolioInsights.cardConfig.faqSubtitle}</p>
                </div>
              </div>
              <div className="ac-faq-list">
                {portfolioInsights.faqCandidates.map((faq) => (
                  <div key={faq.title} className="ac-faq-item">
                    <strong>{faq.title}</strong>
                    <p>{faq.detail}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="ac-intelligence-card">
              <div className="ac-intelligence-card-header">
                <span className="ac-intelligence-icon"><FiArrowRight size={16} /></span>
                <div>
                  <h3>{portfolioInsights.cardConfig.actionsTitle}</h3>
                  <p>{portfolioInsights.cardConfig.actionsSubtitle}</p>
                </div>
              </div>
              <div className="ac-action-list">
                {portfolioInsights.recommendedActions.map((action) => (
                  <div key={action.title} className={`ac-action-card ${action.tone}`}>
                    <div className="ac-action-top">
                      <strong>{action.title}</strong>
                      <span>{action.owner}</span>
                    </div>
                    <p>{action.detail}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}

      {activeTab === 'companies' && (
        <div className="ac-companies-grid">
          {companyInsights.map((company) => (
            <div key={company.id} className="ac-company-card ac-company-card-advanced">
              <div className="ac-company-card-header">
                <div>
                  <div className="ac-company-name">{company.name}</div>
                  <div className="ac-company-type">{company.facilityType} · {company.state}</div>
                </div>
                <span className={`ac-plan-badge ${getPlanClass(company.plan)}`}>{company.plan}</span>
              </div>

              <p className="ac-risk-summary">{company.riskSummary}</p>

              <button className="ac-btn-secondary" onClick={() => setSelectedCompanyId(company.id)}>
                <FiCpu size={13} />
                AI Powered Insights
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="ac-table-wrapper">
          <div className="ac-table-header">
            <span className="ac-table-title">
              {filteredUsers.length} User{filteredUsers.length !== 1 ? 's' : ''}
            </span>
            <div className="ac-table-search">
              <FiSearch size={13} style={{ color: 'var(--color-text-light)' }} />
              <input
                type="text"
                className="ac-search-input"
                placeholder="Search name, email, role…"
                value={userSearch}
                onChange={(event) => setUserSearch(event.target.value)}
                aria-label="Search users"
              />
            </div>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="ac-empty">
              <div className="ac-empty-title">No users found</div>
              <div className="ac-empty-desc">No users match your current search.</div>
            </div>
          ) : (
            <table className="ac-table" aria-label="Users table">
              <thead>
                <tr>
                  <th>Name / Email</th>
                  <th>Role</th>
                  <th>Company</th>
                  <th>Status</th>
                  <th>Last Login</th>
                  {canAddUser && !isReadOnly && <th></th>}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="ac-user-name">{user.name}</div>
                      <div className="ac-user-email">{user.email}</div>
                    </td>
                    <td><span className={`ac-role-badge ${getRoleClass(user.role)}`}>{user.role}</span></td>
                    <td>{user.company}</td>
                    <td>
                      <span className={`ac-status-badge ${user.status.toLowerCase()}`}>
                        <span className="ac-status-dot" />
                        {user.status}
                      </span>
                    </td>
                    <td className="ac-table-muted">{formatDateTime(user.lastLogin)}</td>
                    {canAddUser && !isReadOnly && (
                      <td>
                        <button
                          className="ac-inline-btn"
                          onClick={() => setToast({ message: `Edit user "${user.name}" — full edit form available in production.`, type: 'info' })}
                        >
                          Edit
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === 'audit' && showAuditTab && (
        <div className="ac-audit-list">
          <div className="ac-audit-list-header">
            <span className="ac-audit-list-title">Platform Audit Log</span>
            <span className="ac-audit-count">{visibleAuditLog.length} entries</span>
          </div>

          {visibleAuditLog.length === 0 ? (
            <div className="ac-empty">
              <div className="ac-empty-title">No audit log entries</div>
              <div className="ac-empty-desc">No audit events are available for your access level.</div>
            </div>
          ) : (
            visibleAuditLog.map((entry) => (
              <div key={entry.id} className="ac-audit-entry">
                <span className={`ac-audit-severity-dot ${entry.severity.toLowerCase()}`} />
                <div className="ac-audit-body">
                  <div className="ac-audit-action">{entry.action}</div>
                  <div className="ac-audit-target">{entry.target}</div>
                  <div className="ac-audit-actor">
                    by {entry.actor} ({entry.actorRole})
                    <span className="ac-audit-category-tag">{entry.category}</span>
                  </div>
                </div>
                <div className="ac-audit-timestamp">{formatDateTime(entry.timestamp)}</div>
              </div>
            ))
          )}
        </div>
      )}

      <CompanyDetailDrawer company={selectedCompany} onClose={() => setSelectedCompanyId(null)} />

      {toast && (
        <div className="ac-toast-container" role="status" aria-live="polite">
          <div className={`ac-toast ${toast.type}`}>
            {toast.type === 'success' ? <FiShield size={14} /> : <FiInfo size={14} />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
