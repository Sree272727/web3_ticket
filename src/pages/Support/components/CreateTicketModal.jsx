import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { TICKET_CATEGORIES, TICKET_PRIORITIES } from '../../../data/supportMockData';
import FileUploadField from './FileUploadField';

const EMPTY_FORM = {
  category: '',
  priority: '',
  subject: '',
  description: '',
};

/**
 * CreateTicketModal — polished modal form for submitting a new support ticket.
 *
 * Props:
 *   isOpen      – boolean
 *   onClose     – callback
 *   onSubmit    – callback(formData) — parent handles adding to state
 *   companyName – string; pre-filled company for customer personas
 *   submittedBy – string; pre-filled submitter name
 */
export default function CreateTicketModal({ isOpen, onClose, onSubmit, companyName, submittedBy }) {
  const [form, setForm]     = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);

  if (!isOpen) { return null; }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }

  function validate() {
    const errs = {};
    if (!form.category)         { errs.category    = 'Please select a category.'; }
    if (!form.priority)         { errs.priority    = 'Please select a priority.'; }
    if (!form.subject.trim())   { errs.subject     = 'Subject is required.'; }
    if (!form.description.trim()) { errs.description = 'Description is required.'; }
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSubmit({ ...form, file: selectedFile });
    setForm(EMPTY_FORM);
    setErrors({});
    setSelectedFile(null);
  }

  function handleClose() {
    setForm(EMPTY_FORM);
    setErrors({});
    setSelectedFile(null);
    onClose();
  }

  return (
    <div
      className="sp-modal-backdrop"
      onClick={(e) => { if (e.target === e.currentTarget) { handleClose(); } }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-ticket-title"
    >
      <div className="sp-modal">
        {/* Header */}
        <div className="sp-modal-header">
          <h2 id="create-ticket-title">Submit a Support Request</h2>
          <button className="sp-modal-close" onClick={handleClose} aria-label="Close modal">
            <FiX />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="sp-modal-body">

            {/* Company / submitter context (read-only) */}
            {(companyName || submittedBy) && (
              <div
                style={{
                  background: '#f8f9fb',
                  border: '1px solid var(--color-border)',
                  borderRadius: 6,
                  padding: '10px 14px',
                  marginBottom: 18,
                  fontSize: 12,
                  color: 'var(--color-text-medium)',
                  display: 'flex',
                  gap: 20,
                  flexWrap: 'wrap',
                }}
              >
                {submittedBy && (
                  <span><strong>Submitting as:</strong> {submittedBy}</span>
                )}
                {companyName && (
                  <span><strong>Company:</strong> {companyName}</span>
                )}
              </div>
            )}

            {/* Category & Priority */}
            <div className="sp-field-row">
              <div className="sp-field-group">
                <label className="sp-field-label required" htmlFor="ct-category">Category</label>
                <select
                  id="ct-category"
                  name="category"
                  className="sp-field-select"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="">Select category…</option>
                  {TICKET_CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.category && <div className="sp-field-error">{errors.category}</div>}
              </div>

              <div className="sp-field-group">
                <label className="sp-field-label required" htmlFor="ct-priority">Priority</label>
                <select
                  id="ct-priority"
                  name="priority"
                  className="sp-field-select"
                  value={form.priority}
                  onChange={handleChange}
                >
                  <option value="">Select priority…</option>
                  {TICKET_PRIORITIES.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                {errors.priority && <div className="sp-field-error">{errors.priority}</div>}
              </div>
            </div>

            {/* Subject */}
            <div className="sp-field-group">
              <label className="sp-field-label required" htmlFor="ct-subject">Subject</label>
              <input
                id="ct-subject"
                name="subject"
                type="text"
                className="sp-field-input"
                placeholder="Briefly describe the issue or question…"
                value={form.subject}
                onChange={handleChange}
                maxLength={200}
              />
              {errors.subject && <div className="sp-field-error">{errors.subject}</div>}
            </div>

            {/* Description */}
            <div className="sp-field-group">
              <label className="sp-field-label required" htmlFor="ct-description">Description</label>
              <textarea
                id="ct-description"
                name="description"
                className="sp-field-textarea"
                placeholder="Provide details: what are you trying to do, what happened, steps to reproduce if applicable…"
                value={form.description}
                onChange={handleChange}
              />
              {errors.description && <div className="sp-field-error">{errors.description}</div>}
            </div>

            {/* Attachment placeholder */}
            <FileUploadField
              id="ct-attach"
              label="Attachments"
              selectedFile={selectedFile}
              onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
              onClear={() => setSelectedFile(null)}
              helperText="Optional file to support the request"
              buttonLabel="Choose file"
            />

          </div>

          {/* Footer */}
          <div className="sp-modal-footer">
            <button type="button" className="sp-btn-secondary" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="sp-btn-primary">
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
