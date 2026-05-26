import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTrain } from '../contexts/TrainContext';

export default function TopBar({ onToggleSidebar, sidebarOpen }) {
  const { language, setLanguage, t } = useLanguage();
  const { search, selectTrain, loading, error } = useTrain();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
          searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const onSearch = (value) => {
    setQuery(value);
    clearTimeout(debounceRef.current);
    if (value.trim().length < 2) { setShowDropdown(false); setResults([]); return; }
    debounceRef.current = setTimeout(async () => {
      const r = await search(value);
      setResults(r || []);
      setShowDropdown(true);
    }, 300);
  };

  const onSelectResult = (train) => {
    selectTrain(train);
    setQuery('');
    setShowDropdown(false);
    setResults([]);
  };

  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'hi', label: 'हि' },
    { code: 'ja', label: 'JA' },
  ];

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="topbar-left">
          <button className="sidebar-toggle" onClick={onToggleSidebar} aria-label="Toggle sidebar" id="sidebar-toggle-btn">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {sidebarOpen ? (
                <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
              ) : (
                <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>
              )}
            </svg>
          </button>
          <div className="topbar-brand">
            <div className="brand-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                <line x1="4" y1="22" x2="4" y2="15" />
              </svg>
            </div>
            <div>
              <h1 className="brand-name">{t('appName')}</h1>
              <p className="brand-tagline">{t('appTagline')}</p>
              <span className="brand-version">v1.0</span>
            </div>
          </div>
        </div>

        <div className="topbar-center">
          <div className="search-wrapper" ref={searchRef}>
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              id="train-search-input"
              type="text"
              className="search-input"
              placeholder={t('searchPlaceholder')}
              value={query}
              onChange={(e) => onSearch(e.target.value)}
              onFocus={() => { if (results.length > 0) setShowDropdown(true); }}
              autoComplete="off"
            />
            {query && (
              <button className="search-clear" onClick={() => { setQuery(''); setShowDropdown(false); setResults([]); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}

            {showDropdown && results.length > 0 && (
              <div className="search-dropdown" ref={dropdownRef}>
                {results.map((train, idx) => (
                  <button key={train.trainNumber || idx} className="search-result-item" onClick={() => onSelectResult(train)}>
                    <div className="search-result-info">
                      <span className="search-result-number">{train.trainNumber}</span>
                      <span className="search-result-name">{train.trainName}</span>
                    </div>
                    {(train.from || train.to) && (
                      <div className="search-result-route">{train.from} → {train.to}</div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {showDropdown && query.trim().length >= 2 && results.length === 0 && !loading && !error && (
              <div className="search-dropdown">
                <div className="search-no-results">{t('noTrainsFound')}</div>
              </div>
            )}

            {showDropdown && error && !loading && (
              <div className="search-dropdown">
                <div className="search-no-results text-red-400 p-3">{error}</div>
              </div>
            )}
          </div>
        </div>

        <div className="topbar-right">
          <div className="lang-toggle" role="radiogroup" aria-label="Language selection">
            {languages.map((lang) => (
              <button
                key={lang.code}
                className={`lang-btn ${language === lang.code ? 'lang-btn-active' : ''}`}
                onClick={() => setLanguage(lang.code)}
                role="radio"
                aria-checked={language === lang.code}
                id={`lang-toggle-${lang.code}`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

/* Create TopBar component */
