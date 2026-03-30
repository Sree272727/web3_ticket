import { FiPaperclip, FiX } from 'react-icons/fi';

export default function FileUploadField({
  id,
  label,
  helperText,
  selectedFile,
  onChange,
  onClear,
  buttonLabel = 'Attach file',
}) {
  return (
    <div className="sp-upload-field">
      {label && <label className="sp-field-label" htmlFor={id}>{label}</label>}
      <div className="sp-upload-control">
        <label className="sp-upload-button" htmlFor={id}>
          <FiPaperclip size={14} />
          <span>{buttonLabel}</span>
        </label>
        <input
          id={id}
          className="sp-upload-input"
          type="file"
          onChange={onChange}
        />
        <div className="sp-upload-meta">
          {selectedFile ? (
            <div className="sp-upload-selected">
              <span className="sp-upload-filename">{selectedFile.name}</span>
              <button type="button" className="sp-upload-clear" onClick={onClear} aria-label="Remove file">
                <FiX size={14} />
              </button>
            </div>
          ) : (
            <span className="sp-upload-empty">{helperText || 'No file selected'}</span>
          )}
        </div>
      </div>
    </div>
  );
}
