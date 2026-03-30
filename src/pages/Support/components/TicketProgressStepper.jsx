import { useMemo, useState } from 'react';
import { formatDateTime } from '../supportUtils';

export default function TicketProgressStepper({ stages }) {
  const defaultStage = useMemo(
    () => stages.find((stage) => stage.isCurrent) || stages.find((stage) => stage.reached) || stages[0],
    [stages]
  );
  const [activeStageId, setActiveStageId] = useState(defaultStage?.id);

  const activeStage = stages.find((stage) => stage.id === activeStageId) || defaultStage;

  return (
    <section className="sp-stepper">
      <div className="sp-stepper-track">
        {stages.map((stage, index) => (
          <div
            key={stage.id}
            className={`sp-stepper-stage${stage.reached ? ' reached' : ''}${stage.isCurrent ? ' current' : ''}`}
            onMouseEnter={() => setActiveStageId(stage.id)}
          >
            {index < stages.length - 1 && <span className="sp-stepper-line" />}
            <button
              type="button"
              className="sp-stepper-bullet"
              onClick={() => setActiveStageId(stage.id)}
              aria-pressed={activeStage?.id === stage.id}
            >
              <span />
            </button>
            <div className="sp-stepper-label">{stage.title}</div>
          </div>
        ))}
      </div>

      {activeStage && (
        <div className="sp-stepper-detail">
          <div className="sp-stepper-detail-top">
            <strong>{activeStage.title}</strong>
            <span>{activeStage.timestamp ? formatDateTime(activeStage.timestamp) : 'Not reached yet'}</span>
          </div>
          <p>{activeStage.description}</p>
          <div className="sp-stepper-meta">
            <span>{activeStage.eventSummary}</span>
            {activeStage.timestamp && <span>{activeStage.actor} · {activeStage.role}</span>}
          </div>
        </div>
      )}
    </section>
  );
}
