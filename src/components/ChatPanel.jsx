import { useState, useRef, useEffect, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTrain } from '../contexts/TrainContext';
import { sendMessage } from '../services/chatService';
import ChatMessage from './ChatMessage';
import MessageInput from './MessageInput';

export default function ChatPanel() {
  const { language, t } = useLanguage();
  const { buildTrainContext, search, selectTrain } = useTrain();
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const initialized = useRef(false);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, isTyping, scrollToBottom]);

  // Greeting on mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    setMessages([{
      role: 'assistant',
      content: t('greeting'),
      timestamp: new Date().toISOString(),
    }]);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Detect train number in message, auto-search and select
  const detectAndSelect = async (text) => {
    const match = text.match(/\b(\d{4,5})\b/);
    if (match) {
      const results = await search(match[1]);
      if (results?.length > 0) {
        selectTrain(results[0]);
      }
    }
  };

  const handleSend = async (text) => {
    const userMsg = { role: 'user', content: text, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);

    // Auto-detect train numbers
    detectAndSelect(text);

    setIsTyping(true);

    const apiMessages = [...messages, userMsg]
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .slice(-10)
      .map(m => ({ role: m.role, content: m.content }));

    const trainContext = buildTrainContext();
    const response = await sendMessage(apiMessages, { trainContext, language });

    if (response) {
      setMessages(prev => [...prev, {
        role: 'assistant', content: response, timestamp: new Date().toISOString(),
      }]);
    } else {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: language === 'hi' ? 'क्षमा करें, कुछ गड़बड़ हो गई।'
          : language === 'ja' ? '問題が発生しました。もう一度お試しください。'
          : 'Sorry, I couldn\'t process that. Please try again.',
        timestamp: new Date().toISOString(),
      }]);
    }

    setIsTyping(false);
  };

  return (
    <div className="chat-panel">
      <div className="chat-messages" id="chat-messages">
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} message={msg} isLatest={idx === messages.length - 1} />
        ))}

        {isTyping && (
          <div className="chat-message chat-message-ai">
            <div className="chat-avatar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="chat-bubble chat-bubble-ai">
              <div className="typing-indicator">
                <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
              </div>
              <span className="typing-text">{t('typing')}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <MessageInput onSend={handleSend} disabled={isTyping} />
    </div>
  );
}

/* Implement chat panel UI */
