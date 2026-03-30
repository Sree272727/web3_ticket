import { FiBook, FiFileText, FiHelpCircle, FiPlay, FiX } from 'react-icons/fi';

const SECTION_ICONS = {
  articles: FiFileText,
  guides: FiBook,
  videos: FiPlay,
  faqs: FiHelpCircle,
};

const SECTION_TITLES = {
  articles: 'Top Help Articles',
  guides: 'Quick Guides',
  videos: 'Training Videos',
  faqs: 'Suggested FAQs',
};

export default function HelpResourcesModal({ isOpen, onClose, resources, personaLabel }) {
  if (!isOpen || !resources) {
    return null;
  }

  return (
    <div
      className="sp-modal-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="support-help-title"
    >
      <div className="sp-modal sp-help-modal">
        <div className="sp-modal-header">
          <div>
            <h2 id="support-help-title">Help &amp; Resources</h2>
            <p className="sp-modal-subtitle">{personaLabel} resources tailored to the current support workflow.</p>
          </div>
          <button type="button" className="sp-modal-close" onClick={onClose} aria-label="Close help resources">
            <FiX />
          </button>
        </div>

        <div className="sp-modal-body sp-help-modal-body">
          <div className="sp-help-intro-card">
            <div className="sp-help-intro-eyebrow">Persona-specific guidance</div>
            <p>{resources.intro}</p>
          </div>

          <div className="sp-help-grid">
            {Object.entries(SECTION_TITLES).map(([key, title]) => {
              const Icon = SECTION_ICONS[key];
              const items = resources[key] || [];

              return (
                <section key={key} className="sp-help-section">
                  <div className="sp-help-section-header">
                    <span className="sp-help-section-icon"><Icon size={15} /></span>
                    <div>
                      <h3>{title}</h3>
                      <p>{items.length} curated resources</p>
                    </div>
                  </div>

                  <div className="sp-help-list">
                    {items.map((item) => (
                      <div key={item.id} className="sp-help-list-item">
                        <div>
                          <div className="sp-help-item-title">{item.title}</div>
                          {item.tag && <div className="sp-help-item-tag">{item.tag}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
