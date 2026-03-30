import { formatDateTime } from '../supportUtils';

function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

export default function TicketConversationThread({ comments }) {
  return (
    <div className="sp-conversation-thread">
      {comments.map((comment) => (
        <div key={comment.id} className={`sp-chat-row ${comment.side}`}>
          <div className={`sp-chat-avatar ${comment.side}`} title={comment.author}>
            {getInitials(comment.author)}
          </div>
          <div className={`sp-chat-bubble ${comment.side}`}>
            <p className="sp-chat-text">{comment.message}</p>
            {comment.attachments?.length > 0 && (
              <div className="sp-chat-attachments">
                {comment.attachments.map((attachment) => (
                  <span key={attachment.id} className="sp-chat-file">{attachment.name}</span>
                ))}
              </div>
            )}
            <time className="sp-chat-time">{formatDateTime(comment.timestamp)}</time>
          </div>
        </div>
      ))}
    </div>
  );
}
