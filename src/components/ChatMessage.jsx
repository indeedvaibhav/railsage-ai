import { useLanguage } from '../contexts/LanguageContext';

export default function ChatMessage({ message, isLatest }) {
  const { language } = useLanguage();
  const isUser = message.role === 'user';

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString(
      language === 'hi' ? 'hi-IN' : language === 'ja' ? 'ja-JP' : 'en-IN',
      { hour: '2-digit', minute: '2-digit', hour12: true }
    );
  };

  return (
    <div className={`chat-message ${isUser ? 'chat-message-user' : 'chat-message-ai'} ${isLatest ? 'chat-message-latest' : ''}`}>
      {/* AI Avatar */}
      {!isUser && (
        <div className="chat-avatar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
      )}

      <div className={`chat-bubble ${isUser ? 'chat-bubble-user' : 'chat-bubble-ai'}`}>
        <div className="chat-bubble-content">
          {message.content.split('\n').map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
        <span className="chat-timestamp">{formatTime(message.timestamp)}</span>
      </div>
    </div>
  );
}

/* Add chat message component */
