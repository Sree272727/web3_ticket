import { useState } from 'react';
import { FiSend } from 'react-icons/fi';
import FileUploadField from './FileUploadField';

export default function TicketMessageComposer({ onSubmit }) {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);

  function handleSend(event) {
    event.preventDefault();
    if (!message.trim() && !file) {
      return;
    }

    onSubmit({
      message: message.trim(),
      file,
    });
    setMessage('');
    setFile(null);
  }

  return (
    <form className="sp-comment-composer" onSubmit={handleSend}>
      <div className="sp-comment-composer-header">
        <h4>Ticket Conversation</h4>
        <p>Add context, clarify next steps, or attach supporting evidence for this ticket.</p>
      </div>

      <textarea
        className="sp-comment-textarea"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Add a ticket comment or follow-up update..."
      />

      <div className="sp-comment-composer-footer">
        <FileUploadField
          id="ticket-comment-file"
          selectedFile={file}
          onChange={(event) => setFile(event.target.files?.[0] || null)}
          onClear={() => setFile(null)}
          buttonLabel="Attach support file"
          helperText="Optional attachment for this ticket comment"
        />

        <button type="submit" className="sp-btn-primary">
          <FiSend size={14} />
          Post Update
        </button>
      </div>
    </form>
  );
}
