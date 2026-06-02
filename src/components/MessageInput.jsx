import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function MessageInput({ onSend, disabled }) {
  const { t } = useLanguage();
  const [text, setText] = useState('');

  const handleSend = () => {
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = [
    { key: 'quickCheckStatus', icon: '🔍' },
    { key: 'quickPlanJourney', icon: '🗺️' },
    { key: 'quickFindAlternative', icon: '🔄' },
  ];

  return (
    <div className="message-input-wrapper">
      {/* Quick action chips */}
      <div className="quick-actions">
        {quickActions.map((action) => (
          <button
            key={action.key}
            className="quick-action-chip"
            onClick={() => onSend(t(action.key))}
            disabled={disabled}
            id={`quick-${action.key}`}
          >
            <span className="quick-action-icon">{action.icon}</span>
            {t(action.key)}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div className="message-input-bar">
        <input
          id="chat-input"
          type="text"
          className="message-input"
          placeholder={t('chatPlaceholder')}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          autoComplete="off"
        />
        <button
          className={`send-btn ${text.trim() ? 'send-btn-active' : ''}`}
          onClick={handleSend}
          disabled={!text.trim() || disabled}
          aria-label={t('sendButton')}
          id="send-message-btn"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* Add message input with quick actions */
