import { FiPlus } from 'react-icons/fi';
import { usePersona } from '../../../context/PersonaContext';

export default function SupportPortalHeader({ onOpenCreate }) {
  const { activePersona } = usePersona();

  return (
    <section className="sp-page-header">
      <div className="sp-page-header-main">
        <div className="sp-page-header-copy">
          <div className="sp-header-eyebrow">Support Operations Workspace</div>
          <h1 className="sp-page-title">Support Portal</h1>
          <p className="sp-page-subtitle">{activePersona.subtitle}</p>
        </div>

        <button type="button" className="sp-btn-primary" onClick={onOpenCreate}>
          <FiPlus size={15} />
          Create Ticket
        </button>
      </div>
    </section>
  );
}
