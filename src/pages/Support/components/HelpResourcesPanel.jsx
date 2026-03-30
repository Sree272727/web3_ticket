import { FiFileText, FiBook, FiPlay, FiHelpCircle, FiArrowRight } from 'react-icons/fi';
import { HELP_RESOURCES } from '../../../data/supportMockData';

/**
 * HelpResourcesPanel — shown in the right sidebar when no ticket is selected.
 * Contains top help articles, quick guides, training videos, and FAQs.
 */
export default function HelpResourcesPanel() {
  return (
    <div className="sp-help-panel">
      <div className="sp-help-header">
        <h3>Help &amp; Resources</h3>
        <p>Quick access to guides, articles, and FAQs</p>
      </div>

      <div className="sp-help-body">

        {/* Top Help Articles */}
        <div className="sp-help-category">
          <p className="sp-help-cat-title">
            <FiFileText size={11} />
            Top Help Articles
          </p>
          <ul className="sp-help-items">
            {HELP_RESOURCES.articles.map(item => (
              <li key={item.id} className="sp-help-item">
                <div className="sp-help-item-left">
                  <FiArrowRight className="sp-help-item-icon" size={12} />
                  <span className="sp-help-item-text">{item.title}</span>
                </div>
                <span className="sp-help-tag">{item.tag}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Guides */}
        <div className="sp-help-category">
          <p className="sp-help-cat-title">
            <FiBook size={11} />
            Quick Guides
          </p>
          <ul className="sp-help-items">
            {HELP_RESOURCES.guides.map(item => (
              <li key={item.id} className="sp-help-item">
                <div className="sp-help-item-left">
                  <FiArrowRight className="sp-help-item-icon" size={12} />
                  <span className="sp-help-item-text">{item.title}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Training Videos */}
        <div className="sp-help-category">
          <p className="sp-help-cat-title">
            <FiPlay size={11} />
            Training Videos
          </p>
          <ul className="sp-help-items">
            {HELP_RESOURCES.videos.map(item => (
              <li key={item.id} className="sp-help-item">
                <div className="sp-help-item-left">
                  <FiPlay className="sp-help-item-icon" size={12} style={{ color: '#d97706' }} />
                  <span className="sp-help-item-text">{item.title}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* FAQs */}
        <div className="sp-help-category">
          <p className="sp-help-cat-title">
            <FiHelpCircle size={11} />
            Frequently Asked Questions
          </p>
          <ul className="sp-help-items">
            {HELP_RESOURCES.faqs.map(item => (
              <li key={item.id} className="sp-help-item">
                <div className="sp-help-item-left">
                  <FiHelpCircle className="sp-help-item-icon" size={12} />
                  <span className="sp-help-item-text">{item.title}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}
