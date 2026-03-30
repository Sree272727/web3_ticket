import { useMemo, useState } from 'react';
import { FiFilter } from 'react-icons/fi';
import { usePersona } from '../../context/PersonaContext';
import { MOCK_COMPANIES } from '../../data/adminMockData';
import { MOCK_TICKETS } from '../../data/supportMockData';
import {
  AI_DEFLECTION_BASE,
  LTC_AREA_TO_THEME,
  PLATFORM_MODULES,
  REPORTING_TIME_PERIODS,
  TICKET_THEME_CATEGORIES,
} from '../../data/reportingMockData';
import './ReportingDashboard.css';

// ─── helpers ────────────────────────────────────────────────────────────────

function getVisibleCompanies(persona) {
  switch (persona.id) {
    case 'tcs-admin':
    case 'tcs-employee':
      return MOCK_COMPANIES;
    case 'account-manager':
      return MOCK_COMPANIES.filter(c => (persona.assignedCompanies || []).includes(c.id));
    case 'customer-admin':
    case 'customer-employee':
      return MOCK_COMPANIES.filter(c => c.id === persona.companyId);
    default:
      return [];
  }
}

function getVisibleTickets(persona) {
  switch (persona.id) {
    case 'tcs-admin':
    case 'tcs-employee':
      return MOCK_TICKETS;
    case 'account-manager':
      return MOCK_TICKETS.filter(t => (persona.assignedCompanies || []).includes(t.companyId));
    case 'customer-admin':
    case 'customer-employee':
      return MOCK_TICKETS.filter(t => t.companyId === persona.companyId);
    default:
      return [];
  }
}

function getPersonaSubtitle(persona) {
  switch (persona.id) {
    case 'tcs-admin':       return 'Platform-wide metrics across support performance, AI resolution impact, and facility health.';
    case 'tcs-employee':    return 'Support operations metrics — workload, resolution speed, and AI deflection across all accounts.';
    case 'account-manager': return 'Assigned-account metrics — support health, unresolved volume, and business-risk signals.';
    case 'customer-admin':  return 'Facility-scoped metrics — your support activity, training completion, and resolution trends.';
    case 'customer-employee': return 'A summary of support activity and resolution status for your facility.';
    default:                return 'Operational and business metrics across support, AI resolution, and facility health.';
  }
}

function formatHours(h) {
  if (!h) return '0h';
  if (h >= 24) return `${(h / 24).toFixed(h >= 72 ? 0 : 1)}d`;
  return `${Math.round(h)}h`;
}

// ─── chart components ────────────────────────────────────────────────────────

function DonutChart({ segments, centerLabel, centerValue }) {
  const r = 78, cx = 100, cy = 100, sw = 26;
  const circ = 2 * Math.PI * r;
  let cumAngle = -90;
  const circles = segments.map((seg, i) => {
    const len = (seg.value / 100) * circ;
    const angle = cumAngle;
    cumAngle += (seg.value / 100) * 360;
    return (
      <circle
        key={i}
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke={seg.color}
        strokeWidth={sw}
        strokeDasharray={`${len} ${circ - len}`}
        transform={`rotate(${angle} ${cx} ${cy})`}
        strokeLinecap="butt"
      />
    );
  });
  return (
    <div className="rd-donut-wrap">
      <svg viewBox="0 0 200 200" className="rd-donut-svg">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth={sw} />
        {circles}
        <text x={cx} y={cy - 8} textAnchor="middle" fontSize="30" fontWeight="800" fill="#17223b">{centerValue}</text>
        <text x={cx} y={cy + 14} textAnchor="middle" fontSize="11" fill="#6b7488" letterSpacing="0.05em">{centerLabel}</text>
      </svg>
      <div className="rd-donut-legend">
        {segments.map(seg => (
          <div key={seg.label} className="rd-legend-row">
            <span className="rd-legend-dot" style={{ background: seg.color }} />
            <span className="rd-legend-name">{seg.label}</span>
            <span className="rd-legend-val">{seg.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PieChart({ data }) {
  const total = data.reduce((s, d) => s + d.count, 0) || 1;
  const [hovered, setHovered] = useState(null);
  const cx = 100, cy = 100, r = 90;
  let cumAngle = -90;

  const slices = data.map((d, i) => {
    const pct = d.count / total;
    const startAngle = cumAngle;
    cumAngle += pct * 360;
    const endAngle = cumAngle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);
    const largeArc = pct > 0.5 ? 1 : 0;

    const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;

    // Label position: midpoint of the arc, pushed outward
    const midAngle = ((startAngle + endAngle) / 2) * Math.PI / 180;
    const labelR = r * 0.6;
    const labelX = cx + labelR * Math.cos(midAngle);
    const labelY = cy + labelR * Math.sin(midAngle);

    return (
      <g key={i}
        onMouseEnter={() => setHovered(i)}
        onMouseLeave={() => setHovered(null)}
        style={{ cursor: 'default' }}
      >
        <path
          d={path}
          fill={d.color}
          stroke="#fff"
          strokeWidth={1.5}
          opacity={hovered !== null && hovered !== i ? 0.5 : 1}
          style={{ transition: 'opacity 0.2s' }}
        />
        {hovered === i && (
          <text
            x={labelX} y={labelY}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="12"
            fontWeight="800"
            fill="#fff"
            style={{ pointerEvents: 'none', textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}
          >
            {Math.round(pct * 100)}%
          </text>
        )}
      </g>
    );
  });

  return (
    <div className="rd-pie-wrap">
      <svg viewBox="0 0 200 200" className="rd-pie-svg">
        {slices}
      </svg>
      <div className="rd-pie-legend">
        {data.map(d => (
          <div key={d.label} className="rd-pie-legend-row">
            <span className="rd-pie-dot" style={{ background: d.color }} />
            <span className="rd-pie-name">{d.label}</span>
            <span className="rd-pie-count">{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FacilityTrendChart({ data, granularity }) {
  if (!data || data.length === 0) return <div className="rd-empty-state">No ticket data for this facility in the selected period.</div>;

  const W = 760, H = 200;
  const padL = 40, padT = 14, padR = 10, padB = 32;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const n = data.length;
  const maxVal = Math.max(...data.map(d => d.count), 1) * 1.2;

  const gx = i => padL + (i / Math.max(n - 1, 1)) * plotW;
  const gy = v => padT + (1 - v / maxVal) * plotH;

  const points = data.map((d, i) => `${gx(i)},${gy(d.count)}`).join(' ');
  const areaPath = `M ${data.map((d, i) => `${gx(i)},${gy(d.count)}`).join(' L ')} L ${gx(n - 1)},${padT + plotH} L ${gx(0)},${padT + plotH} Z`;

  const gridLines = [0, 0.25, 0.5, 0.75, 1];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: H, display: 'block', overflow: 'visible' }}>
      {gridLines.map(t => {
        const y = padT + t * plotH;
        const val = Math.round(maxVal * (1 - t));
        return (
          <g key={t}>
            <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#e9eef5" strokeWidth="1" />
            <text x={padL - 6} y={y + 4} textAnchor="end" fontSize="10" fill="#8494a8">{val}</text>
          </g>
        );
      })}
      <path d={areaPath} fill="rgba(37, 99, 235, 0.08)" />
      <polyline points={points} fill="none" stroke="#2563eb" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
      {(() => {
        // Show max ~12 labels to avoid overlap; always show first and last
        const maxLabels = 12;
        const step = n <= maxLabels ? 1 : Math.ceil(n / maxLabels);
        return data.map((d, i) => {
          const showLabel = i === 0 || i === n - 1 || i % step === 0;
          // Format label based on granularity
          let displayLabel = d.label;
          if (granularity === 'daily') {
            displayLabel = d.label.slice(5); // MM-DD
          } else if (granularity === 'weekly') {
            // Show as short date like "Jan 5" instead of "W01-05"
            const parts = d.label.replace('W', '').split('-');
            const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const monthNum = parseInt(parts[0], 10);
            displayLabel = `${monthNames[monthNum] || parts[0]} ${parseInt(parts[1], 10)}`;
          }
          return (
            <g key={i}>
              <circle cx={gx(i)} cy={gy(d.count)} r={n > 30 ? 2 : 3.5} fill="#2563eb" stroke="#fff" strokeWidth={n > 30 ? 1 : 2} />
              {showLabel && (
                <text x={gx(i)} y={H - 6} textAnchor="middle" fontSize="9" fill="#8494a8">
                  {displayLabel}
                </text>
              )}
            </g>
          );
        });
      })()}
    </svg>
  );
}

function VerticalBarChart({ data, maxVal }) {
  return (
    <div className="rd-vbar-chart">
      <div className="rd-vbar-bars">
        {data.map((d) => (
          <div key={d.label} className="rd-vbar-col">
            <div className="rd-vbar-value">{d.count}</div>
            <div className="rd-vbar-track">
              <div
                className="rd-vbar-fill"
                style={{ height: `${(d.count / maxVal) * 100}%` }}
              />
            </div>
            <div className="rd-vbar-label">{d.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StackedStatusChart({ segments }) {
  const total = segments.reduce((s, seg) => s + seg.count, 0) || 1;
  return (
    <div className="rd-stacked-chart">
      <div className="rd-stacked-bar-container">
        {segments.map(seg => {
          const pct = (seg.count / total) * 100;
          if (pct < 1) return null;
          return (
            <div
              key={seg.label}
              className="rd-stacked-segment"
              style={{ width: `${pct}%`, background: seg.color }}
              title={`${seg.label}: ${seg.count} (${Math.round(pct)}%)`}
            />
          );
        })}
      </div>
      <div className="rd-stacked-legend">
        {segments.map(seg => {
          const pct = Math.round((seg.count / total) * 100);
          return (
            <div key={seg.label} className="rd-stacked-legend-item">
              <span className="rd-stacked-dot" style={{ background: seg.color }} />
              <span className="rd-stacked-name">{seg.label}</span>
              <span className="rd-stacked-val">{seg.count}</span>
              <span className="rd-stacked-pct">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ResolutionBarChart({ data, maxVal, unit }) {
  return (
    <div className="rd-res-chart">
      {data.map(d => (
        <div key={d.label} className="rd-res-row">
          <div className="rd-res-label">{d.label}</div>
          <div className="rd-res-track">
            <div
              className="rd-res-fill"
              style={{ width: `${(d.value / maxVal) * 100}%`, background: d.color || '#2563eb' }}
            />
          </div>
          <div className="rd-res-value">{d.value}{unit}</div>
        </div>
      ))}
    </div>
  );
}

function ToggleSwitch({ options, active, onChange }) {
  return (
    <div className="rd-toggle-group">
      {options.map(opt => (
        <button
          key={opt.value}
          className={`rd-toggle-btn ${active === opt.value ? 'active' : ''}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ─── main page ───────────────────────────────────────────────────────────────

export default function ReportingDashboardPage() {
  const { activePersona } = usePersona();
  const visibleCompanies = useMemo(() => getVisibleCompanies(activePersona), [activePersona]);
  const scopedTickets    = useMemo(() => getVisibleTickets(activePersona), [activePersona]);

  const [filters, setFilters] = useState({ timePeriod: '90', companyId: 'all', priority: 'all' });
  const [trendGranularity, setTrendGranularity] = useState('weekly');
  const [chart3View, setChart3View] = useState('themes');
  const [chart5View, setChart5View] = useState('module');

  const timePeriod = REPORTING_TIME_PERIODS.find(p => p.value === filters.timePeriod) || REPORTING_TIME_PERIODS[1];

  const filteredTickets = useMemo(() => {
    const now   = new Date('2026-03-27T23:59:59Z');
    const start = new Date(now.getTime() - timePeriod.days * 86400000);
    return scopedTickets.filter(t => {
      const created = new Date(t.createdAt);
      if (created < start || created > now) return false;
      if (filters.companyId !== 'all' && t.companyId !== filters.companyId) return false;
      if (filters.priority  !== 'all' && t.priority  !== filters.priority)  return false;
      return true;
    });
  }, [filters, scopedTickets, timePeriod.days]);

  const totalTickets = filteredTickets.length;

  // ── AI Resolution donut (dynamic) ───────────────────────────────
  const aiStats = useMemo(() => {
    // Each module has a different AI deflection rate — what % of total support
    // interactions for that module get resolved by AI before a human ticket is created.
    const MODULE_AI_DEFLECTION_RATE = {
      'Account Access': 0.72,
      'Notifications': 0.55,
      'LMS': 0.48,
      'AI Search': 0.35,
      'Document Café': 0.30,
      'Chat': 0.25,
      'Survey Readiness': 0.20,
      'Plan of Correction': 0.12,
    };

    // Facility-level AI maturity — some facilities adopt AI features more
    const FACILITY_AI_MATURITY = {
      'green-valley': 1.3,    // tech-savvy staff, high AI adoption
      'oakridge': 0.7,        // slower adoption, prefer human support
      'sunrise': 1.1,         // moderate AI adoption
      'meadowbrook': 0.5,     // low adoption, complex patient cases
      'silver-pines': 0.9,    // average
    };

    // Priority-level AI suitability — high priority issues less likely AI-resolved
    const PRIORITY_AI_FACTOR = {
      'Low': 1.4,
      'Medium': 1.1,
      'High': 0.7,
      'Critical': 0.4,
    };

    const resolved = filteredTickets.filter(t => ['Resolved', 'Closed'].includes(t.status));
    const stillOpenList = filteredTickets.filter(t => ['Open', 'In Progress', 'Waiting for Customer'].includes(t.status));

    // Compute AI deflection per ticket (not just per module) for meaningful variation
    let totalAiResolved = 0;
    filteredTickets.forEach(t => {
      const mod = t.module || 'Other';
      const baseRate = MODULE_AI_DEFLECTION_RATE[mod] || 0.30;
      const facilityFactor = FACILITY_AI_MATURITY[t.companyId] || 1.0;
      const priorityFactor = PRIORITY_AI_FACTOR[t.priority] || 1.0;
      // Effective rate clamped between 0.05 and 0.85
      const effectiveRate = Math.min(Math.max(baseRate * facilityFactor * priorityFactor, 0.05), 0.85);
      // For this one human ticket, how many AI interactions preceded it?
      const aiDeflected = Math.round(effectiveRate / (1 - effectiveRate) * 10) / 10;
      totalAiResolved += aiDeflected;
    });
    totalAiResolved = Math.round(totalAiResolved);

    const humanResolved = resolved.length;
    const stillOpen = stillOpenList.length;
    const escalated = Math.round(humanResolved * 0.35);
    const humanDirect = humanResolved - escalated;

    const totalInteractions = totalAiResolved + humanDirect + escalated + stillOpen;
    const total = totalInteractions || 1;

    const aiPct = Math.round((totalAiResolved / total) * 100);
    const humanPct = Math.round((humanDirect / total) * 100);
    const escPct = Math.round((escalated / total) * 100);
    const openPct = Math.max(100 - aiPct - humanPct - escPct, 0);

    return {
      totalInteractions,
      aiResolved: totalAiResolved,
      humanResolved: humanDirect,
      escalated,
      stillOpen,
      aiPct,
      segments: [
        { label: 'AI Resolved',    value: aiPct,   color: '#2563eb' },
        { label: 'Human Resolved', value: humanPct, color: '#10b981' },
        { label: 'Escalated',      value: escPct,   color: '#f59e0b' },
        { label: 'Still Open',     value: openPct,  color: '#e2e8f0' },
      ],
    };
  }, [filteredTickets]);

  // ── Chart 6: AI Deflection (dynamic) ────────────────────────────
  const deflectionData = useMemo(() => {
    // Count tickets by module in current filter
    const moduleCounts = {};
    filteredTickets.forEach(t => {
      const mod = t.module || 'Other';
      moduleCounts[mod] = (moduleCounts[mod] || 0) + 1;
    });

    // Also compute repeat rate from actual ticket data: how many tickets
    // in the same module share a similar status pattern (indicates repetition)
    const moduleResolved = {};
    filteredTickets.forEach(t => {
      if (['Resolved', 'Closed'].includes(t.status)) {
        const mod = t.module || 'Other';
        moduleResolved[mod] = (moduleResolved[mod] || 0) + 1;
      }
    });

    // Total tickets in view affects scale of weekly volume
    const totalInView = filteredTickets.length || 1;
    const baselineTotal = 76; // full unfiltered count

    return AI_DEFLECTION_BASE
      .map(opp => {
        const moduleTickets = moduleCounts[opp.module] || 0;
        if (moduleTickets === 0) return null;

        // Scale weekly volume proportional to filtered ticket count
        const volumeScale = totalInView / baselineTotal;
        const scaledWeekly = Math.max(Math.round(opp.baseWeeklyVolume * volumeScale), 1);

        // Avg resolution time scales with facility/priority context
        const resolvedInModule = moduleResolved[opp.module] || 0;
        const resolutionRatio = resolvedInModule / Math.max(moduleTickets, 1);
        // Faster resolution when most tickets are resolved → lower avg time
        const scaledAvgMin = Math.round(opp.baseAvgResolutionMin * (0.7 + (1 - resolutionRatio) * 0.6));

        // Deflection score: base score adjusted by sample confidence
        // More tickets from this module in view = higher confidence = higher score
        // Fewer tickets = lower confidence = lower score
        const sampleConfidence = Math.min(moduleTickets / 8, 1); // 8+ tickets = full confidence
        const adjustedScore = Math.round(opp.baseDeflectionScore * (0.6 + sampleConfidence * 0.4));

        // Repeat rate adjusts based on resolution ratio — high resolution = proven pattern
        const adjustedRepeatRate = Math.round(opp.repeatRate * (0.75 + resolutionRatio * 0.25));

        return {
          ...opp,
          weeklyVolume: scaledWeekly,
          avgResolutionMin: scaledAvgMin,
          deflectionScore: adjustedScore,
          repeatRate: adjustedRepeatRate,
          ticketCount: moduleTickets,
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.deflectionScore - a.deflectionScore);
  }, [filteredTickets]);

  // ── Chart 1: Tickets by Category (pie chart) ─────────────────────
  const CATEGORY_COLORS = {
    'Bug': '#ef4444',
    'How Do I': '#2563eb',
    'Do You Have': '#8b5cf6',
    'General': '#10b981',
    'Access & Login': '#f59e0b',
    'Billing & Renewal': '#f97316',
  };
  const categoryPieData = useMemo(() => {
    const counts = {};
    filteredTickets.forEach(t => {
      const cat = t.category || 'Other';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([cat, count]) => ({ label: cat, count, color: CATEGORY_COLORS[cat] || '#64748b' }))
      .sort((a, b) => b.count - a.count);
  }, [filteredTickets]);

  // ── Chart 2: Facility Ticket Trend Over Time ────────────────────
  const trendData = useMemo(() => {
    const facilityTickets = filters.companyId !== 'all'
      ? filteredTickets
      : filteredTickets;

    if (facilityTickets.length === 0) return [];

    const now = new Date('2026-03-27T23:59:59Z');
    const start = new Date(now.getTime() - timePeriod.days * 86400000);

    const buckets = {};

    if (trendGranularity === 'daily') {
      for (let d = new Date(start); d <= now; d.setDate(d.getDate() + 1)) {
        const key = d.toISOString().slice(0, 10);
        buckets[key] = { label: key, count: 0 };
      }
    } else if (trendGranularity === 'weekly') {
      const weekStart = new Date(start);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      for (let d = new Date(weekStart); d <= now; d.setDate(d.getDate() + 7)) {
        const key = `W${d.toISOString().slice(5, 10)}`;
        buckets[key] = { label: key, count: 0, date: new Date(d) };
      }
    } else {
      for (let d = new Date(start); d <= now; d.setMonth(d.getMonth() + 1)) {
        const key = d.toISOString().slice(0, 7);
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        buckets[key] = { label: monthNames[d.getMonth()], count: 0 };
      }
    }

    facilityTickets.forEach(t => {
      const created = new Date(t.createdAt);
      if (trendGranularity === 'daily') {
        const key = created.toISOString().slice(0, 10);
        if (buckets[key]) buckets[key].count++;
      } else if (trendGranularity === 'weekly') {
        const entries = Object.entries(buckets);
        for (let i = entries.length - 1; i >= 0; i--) {
          if (entries[i][1].date && created >= entries[i][1].date) {
            entries[i][1].count++;
            break;
          }
        }
      } else {
        const key = created.toISOString().slice(0, 7);
        if (buckets[key]) buckets[key].count++;
      }
    });

    return Object.values(buckets);
  }, [filteredTickets, filters.companyId, trendGranularity, timePeriod.days]);

  // ── Chart 3a: Ticket Themes by Category ─────────────────────────
  const themeData = useMemo(() => {
    const counts = {};
    filteredTickets.forEach(t => {
      const theme = LTC_AREA_TO_THEME[t.ltcArea] || 'Other';
      counts[theme] = (counts[theme] || 0) + 1;
    });
    return TICKET_THEME_CATEGORIES
      .map(tc => ({ label: tc.key, count: counts[tc.key] || 0, color: tc.color }))
      .filter(d => d.count > 0)
      .sort((a, b) => b.count - a.count);
  }, [filteredTickets]);

  // ── Chart 3b: Tickets by User Type ──────────────────────────────
  const userTypeData = useMemo(() => {
    const counts = {};
    filteredTickets.forEach(t => {
      const role = t.submittedByRole || 'Unknown';
      counts[role] = (counts[role] || 0) + 1;
    });
    const ROLE_COLORS = {
      'Customer Admin': '#2563eb',
      'Customer Employee': '#10b981',
      'Facility Administrator': '#8b5cf6',
      'Director of Nursing': '#f59e0b',
      'MDS Coordinator': '#ef4444',
      'Staff Educator': '#0ea5e9',
    };
    return Object.entries(counts)
      .map(([role, count]) => ({ label: role, count, color: ROLE_COLORS[role] || '#64748b' }))
      .sort((a, b) => b.count - a.count);
  }, [filteredTickets]);

  // ── Chart 4: Open vs Resolved vs Waiting ────────────────────────
  const statusData = useMemo(() => {
    const STATUS_CONFIG = [
      { key: 'Open',                   label: 'Open',                color: '#f59e0b' },
      { key: 'In Progress',            label: 'In Progress',         color: '#2563eb' },
      { key: 'Waiting for Customer',   label: 'Waiting on Customer', color: '#f97316' },
      { key: 'Resolved',               label: 'Resolved',            color: '#10b981' },
      { key: 'Closed',                 label: 'Closed',              color: '#64748b' },
    ];
    const counts = {};
    filteredTickets.forEach(t => { counts[t.status] = (counts[t.status] || 0) + 1; });
    return STATUS_CONFIG.map(s => ({ ...s, count: counts[s.key] || 0 })).filter(s => s.count > 0);
  }, [filteredTickets]);

  // ── Chart 5a: Avg Resolution Time by Module ─────────────────────
  const resTimeByModule = useMemo(() => {
    const resolved = filteredTickets.filter(t => ['Resolved', 'Closed'].includes(t.status));
    const moduleHours = {};
    const moduleCounts = {};
    resolved.forEach(t => {
      const mod = t.module || 'Other';
      const hours = (new Date(t.updatedAt) - new Date(t.createdAt)) / 3600000;
      moduleHours[mod] = (moduleHours[mod] || 0) + hours;
      moduleCounts[mod] = (moduleCounts[mod] || 0) + 1;
    });
    return PLATFORM_MODULES
      .filter(m => moduleCounts[m.key])
      .map(m => ({
        label: m.key,
        value: Math.round(moduleHours[m.key] / moduleCounts[m.key]),
        color: m.color,
      }))
      .sort((a, b) => b.value - a.value);
  }, [filteredTickets]);

  // ── Chart 5b: Avg Resolution Time by Facility ──────────────────
  const resTimeByFacility = useMemo(() => {
    const resolved = filteredTickets.filter(t => ['Resolved', 'Closed'].includes(t.status));
    const facHours = {};
    const facCounts = {};
    resolved.forEach(t => {
      const hours = (new Date(t.updatedAt) - new Date(t.createdAt)) / 3600000;
      facHours[t.companyId] = (facHours[t.companyId] || 0) + hours;
      facCounts[t.companyId] = (facCounts[t.companyId] || 0) + 1;
    });
    const FACILITY_COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];
    return visibleCompanies
      .filter(c => facCounts[c.id])
      .map((c, i) => ({
        label: c.name,
        value: Math.round(facHours[c.id] / facCounts[c.id]),
        color: FACILITY_COLORS[i % FACILITY_COLORS.length],
      }))
      .sort((a, b) => b.value - a.value);
  }, [filteredTickets, visibleCompanies]);

  const resTimeMax5 = useMemo(() => {
    const items = chart5View === 'module' ? resTimeByModule : resTimeByFacility;
    return Math.max(...items.map(d => d.value), 1);
  }, [chart5View, resTimeByModule, resTimeByFacility]);

  // ── Chart 3 max ─────────────────────────────────────────────────
  const chart3Data = chart3View === 'themes' ? themeData : userTypeData;
  const chart3Max = Math.max(...chart3Data.map(d => d.count), 1);

  return (
    <div className="rd-page">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="rd-page-header">
        <div className="rd-header-copy">
          <div className="rd-eyebrow">Support Intelligence Dashboard</div>
          <h1 className="rd-title">Reporting Dashboard</h1>
          <p className="rd-subtitle">{getPersonaSubtitle(activePersona)}</p>
        </div>
      </div>

      <div className="rd-body">

        {/* ── Persona banner ─────────────────────────────────────────── */}
        <div className="rd-persona-banner">
          <span className={`rd-persona-dot ${activePersona.colorClass}`} />
          <span>Viewing as <strong>{activePersona.label}</strong> — {activePersona.description}</span>
        </div>

        {/* ── Filters ────────────────────────────────────────────────── */}
        <div className="rd-filters-bar">
          <label className="rd-filter-field">
            <span>Time Period</span>
            <select value={filters.timePeriod} onChange={e => setFilters(f => ({ ...f, timePeriod: e.target.value }))}>
              {REPORTING_TIME_PERIODS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </label>
          <label className="rd-filter-field">
            <span>Facility</span>
            <select value={filters.companyId} onChange={e => setFilters(f => ({ ...f, companyId: e.target.value }))}>
              <option value="all">All Visible Facilities</option>
              {visibleCompanies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          <label className="rd-filter-field">
            <span>Priority</span>
            <select value={filters.priority} onChange={e => setFilters(f => ({ ...f, priority: e.target.value }))}>
              <option value="all">All Priorities</option>
              {['Low', 'Medium', 'High', 'Critical'].map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </label>
          <div className="rd-filter-pill">
            <FiFilter size={12} />
            {totalTickets} tickets in view
          </div>
        </div>

        {/* ── Row 1: AI Resolution Donut + Tickets by Module ──────── */}
        <div className="rd-row-2col">
          <div className="rd-panel">
            <div className="rd-panel-header">
              <div className="rd-panel-title">AI vs Human Resolution Split</div>
              <div className="rd-panel-sub">Based on {aiStats.totalInteractions.toLocaleString()} interactions · {timePeriod.label}</div>
            </div>
            <DonutChart segments={aiStats.segments} centerValue={`${aiStats.aiPct}%`} centerLabel="AI RESOLVED" />
            <div className="rd-donut-stats">
              <div className="rd-donut-stat">
                <span className="rd-ds-val">{aiStats.aiResolved}</span>
                <span className="rd-ds-label">AI Resolved</span>
              </div>
              <div className="rd-donut-stat">
                <span className="rd-ds-val">{aiStats.humanResolved}</span>
                <span className="rd-ds-label">Human Resolved</span>
              </div>
              <div className="rd-donut-stat">
                <span className="rd-ds-val">{aiStats.escalated}</span>
                <span className="rd-ds-label">Escalated</span>
              </div>
              <div className="rd-donut-stat">
                <span className="rd-ds-val">{aiStats.stillOpen}</span>
                <span className="rd-ds-label">Still Open</span>
              </div>
            </div>
          </div>

          {/* Chart 1: Tickets by Category */}
          <div className="rd-panel">
            <div className="rd-panel-header">
              <div className="rd-panel-title">Tickets by Category</div>
              <div className="rd-panel-sub">Distribution of tickets by issue type · {timePeriod.label}</div>
            </div>
            <PieChart data={categoryPieData} />
          </div>
        </div>

        {/* ── Row 2: Facility Ticket Trend ───────────────────────────── */}
        <div className="rd-panel rd-panel-full">
          <div className="rd-panel-header rd-panel-header-flex">
            <div>
              <div className="rd-panel-title">Facility Ticket Trend Over Time</div>
              <div className="rd-panel-sub">
                {filters.companyId !== 'all'
                  ? `Ticket volume for ${visibleCompanies.find(c => c.id === filters.companyId)?.name || 'selected facility'}`
                  : 'Ticket volume across all visible facilities'
                } · {timePeriod.label}
              </div>
            </div>
            <ToggleSwitch
              options={[
                { value: 'daily', label: 'Daily' },
                { value: 'weekly', label: 'Weekly' },
                { value: 'monthly', label: 'Monthly' },
              ]}
              active={trendGranularity}
              onChange={setTrendGranularity}
            />
          </div>
          <FacilityTrendChart data={trendData} granularity={trendGranularity} />
        </div>

        {/* ── Row 3: Themes/UserType + Status Mix ────────────────────── */}
        <div className="rd-row-2col">
          {/* Chart 3: Ticket Themes */}
          <div className="rd-panel">
            <div className="rd-panel-header">
              <div className="rd-panel-title">Ticket Themes by Category</div>
              <div className="rd-panel-sub">Most common issue themes · {timePeriod.label}</div>
            </div>
            <VerticalBarChart data={themeData} maxVal={Math.max(...themeData.map(d => d.count), 1)} />
          </div>

          {/* Chart 4: Open vs Resolved vs Waiting */}
          <div className="rd-panel rd-panel-flex">
            <div className="rd-panel-header">
              <div className="rd-panel-title">Ticket Status Breakdown</div>
              <div className="rd-panel-sub">Current mix of open, in-progress, waiting, and resolved tickets</div>
            </div>
            <StackedStatusChart segments={statusData} />
          </div>
        </div>

        {/* ── Row 4: Resolution Time + AI Deflection ─────────────────── */}
        <div className="rd-row-2col">
          {/* Chart 5: Avg Resolution Time toggle */}
          <div className="rd-panel rd-panel-flex">
            <div className="rd-panel-header rd-panel-header-flex">
              <div>
                <div className="rd-panel-title">
                  {chart5View === 'module' ? 'Avg Resolution Time by Module' : 'Avg Resolution Time by Facility'}
                </div>
                <div className="rd-panel-sub">
                  {chart5View === 'module'
                    ? 'How long each module takes to resolve on average'
                    : 'Which facilities take longest to resolve'
                  }
                </div>
              </div>
              <ToggleSwitch
                options={[
                  { value: 'module', label: 'By Module' },
                  { value: 'facility', label: 'By Facility' },
                ]}
                active={chart5View}
                onChange={setChart5View}
              />
            </div>
            <ResolutionBarChart
              data={chart5View === 'module' ? resTimeByModule : resTimeByFacility}
              maxVal={resTimeMax5}
              unit="h"
            />
          </div>

          {/* Chart 6: AI Deflection Opportunity */}
          <div className="rd-panel">
            <div className="rd-panel-header">
              <div className="rd-panel-title">Self-Service Candidates</div>
              <div className="rd-panel-sub">Issues most suited for AI or chatbot resolution</div>
            </div>
            <div className="rd-deflection-table">
              {deflectionData.length === 0 && (
                <div className="rd-empty-state">No self-service candidates for the current filter selection.</div>
              )}
              {deflectionData.map((opp, i) => {
                const score10 = opp.deflectionScore / 10;
                const fullDots = Math.round(score10);
                const emptyDots = 10 - fullDots;
                return (
                  <div key={opp.id} className="rd-deflection-row">
                    <div className="rd-deflection-rank">{i + 1}</div>
                    <div className="rd-deflection-name">{opp.issueType}</div>
                    <div className="rd-deflection-dots">
                      {Array.from({ length: fullDots }, (_, j) => (
                        <span key={`f${j}`} className="rd-dot filled" />
                      ))}
                      {Array.from({ length: emptyDots }, (_, j) => (
                        <span key={`e${j}`} className="rd-dot empty" />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
