import { PERSONAS } from '../../../data/supportMockData';

/**
 * PersonaSwitcher — tab row for demo persona selection.
 * Immediately changes data visibility and UI behavior when switched.
 */
export default function PersonaSwitcher({ activePersonaId, onSwitch }) {
  return (
    <div className="persona-switcher">
      <span className="persona-switcher-label">Demo Persona</span>
      <div className="persona-tabs" role="tablist" aria-label="Demo Persona Switcher">
        {PERSONAS.map((persona) => (
          <button
            key={persona.id}
            role="tab"
            aria-selected={persona.id === activePersonaId}
            className={`persona-tab${persona.id === activePersonaId ? ' active' : ''}`}
            onClick={() => onSwitch(persona.id)}
            title={persona.description}
          >
            <span className={`persona-dot ${persona.colorClass}`} />
            {persona.label}
          </button>
        ))}
      </div>
    </div>
  );
}
