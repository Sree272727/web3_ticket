import { FiActivity, FiAlertTriangle, FiBookOpen, FiTrendingUp } from 'react-icons/fi';

export default function SupportIntelligencePanel({ insights }) {
  if (!insights) {
    return null;
  }

  return (
    <section className="sp-intelligence">
      <div className="sp-intelligence-header">
        <div className="sp-header-eyebrow">AI Support Intelligence</div>
        <h2>Support plus LTC-specific insight</h2>
        <p>{insights.intro}</p>
      </div>

      <div className="sp-intelligence-hero">
        <div className="sp-intelligence-hero-copy">
          <span className={`sp-health-pill ${insights.healthTone}`}>{insights.healthLabel}</span>
          <h3>{insights.heroTitle}</h3>
          <p>{insights.heroDescription}</p>
        </div>
      </div>

      <div className="sp-intelligence-grid">
        <div className="sp-intelligence-card">
          <div className="sp-intelligence-card-header">
            <span className="sp-intelligence-icon"><FiTrendingUp size={16} /></span>
            <div>
              <h3>Recurring LTC Issue Themes</h3>
              <p>Patterns showing where facilities repeatedly need help.</p>
            </div>
          </div>
          <div className="sp-intelligence-list">
            {insights.themeClusters.map((theme) => (
              <div key={theme.name} className="sp-intelligence-list-item">
                <div>
                  <strong>{theme.name}</strong>
                  <p>{theme.detail}</p>
                </div>
                <span className="sp-intelligence-badge">{theme.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="sp-intelligence-card">
          <div className="sp-intelligence-card-header">
            <span className="sp-intelligence-icon"><FiAlertTriangle size={16} /></span>
            <div>
              <h3>Facility Follow-Up Signals</h3>
              <p>Where intervention, training, or outreach may be needed.</p>
            </div>
          </div>
          <div className="sp-intelligence-list">
            {insights.facilitySignals.map((signal) => (
              <div key={signal.companyName} className="sp-intelligence-list-item">
                <div>
                  <strong>{signal.companyName}</strong>
                  <p>{signal.detail}</p>
                </div>
                <span className={`sp-health-pill ${signal.tone}`}>{signal.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="sp-intelligence-card">
          <div className="sp-intelligence-card-header">
            <span className="sp-intelligence-icon"><FiBookOpen size={16} /></span>
            <div>
              <h3>FAQ Candidates</h3>
              <p>Topics that can be turned into self-service content.</p>
            </div>
          </div>
          <div className="sp-intelligence-list">
            {insights.faqCandidates.map((faq) => (
              <div key={faq.question} className="sp-intelligence-list-item">
                <div>
                  <strong>{faq.question}</strong>
                  <p>{faq.rationale}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="sp-intelligence-card">
          <div className="sp-intelligence-card-header">
            <span className="sp-intelligence-icon"><FiActivity size={16} /></span>
            <div>
              <h3>Recommended Next Actions</h3>
              <p>How ticket data can drive retention and enablement value.</p>
            </div>
          </div>
          <div className="sp-intelligence-actions">
            {insights.recommendedActions.map((action) => (
              <div key={action.title} className={`sp-intelligence-action ${action.tone}`}>
                <div className="sp-intelligence-action-top">
                  <strong>{action.title}</strong>
                  <span>{action.owner}</span>
                </div>
                <p>{action.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
