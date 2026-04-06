import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { PanchangaContext } from '../context/PanchangaContext';
import { AuthContext } from '../context/AuthContext';
import { PD } from '../data/panchanga';
import { moonIcon, extractName } from '../utils/helpers';
import { RITU_MAP, HINDU_MONTHS } from '../utils/constants';

const MOODS = [
  '😊 Happy',
  '🙏 Grateful',
  '😔 Reflective',
  '⚡ Energetic',
  '😌 Peaceful',
  '🤔 Thoughtful',
  '💪 Motivated',
  '❤️ Loving',
];

const Journal = () => {
  const { dvDate } = useContext(PanchangaContext);
  const { user } = useContext(AuthContext);

  const [view, setView] = useState('list'); // 'list', 'write', 'read'
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const [filterMonth, setFilterMonth] = useState('');

  // Current active entry for reading/writing
  const [currentEntry, setCurrentEntry] = useState(null);

  const editorRef = useRef(null);

  // Fetch entries from Backend API
  const fetchEntries = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/journal');
      setEntries(res.data);
    } catch (err) {
      console.error('Failed to fetch journal entries', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEntries();
  }, [user, view]); // Refetch when returning to list or logging in

  // --- HANDLERS ---
  const handleNewEntry = () => {
    setCurrentEntry({ dateKey: dvDate, title: '', body: '', mood: '' });
    setView('write');
  };

  const handleEdit = (entry) => {
    setCurrentEntry(entry);
    setView('write');
  };

  const handleRead = (entry) => {
    setCurrentEntry(entry);
    setView('read');
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this journal entry?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/journal/${id}`);
      setEntries(entries.filter((en) => en._id !== id));
      if (view === 'read') setView('list');
    } catch (err) {
      alert('Could not delete entry.');
    }
  };

  const handleSave = async () => {
    const bodyText = editorRef.current?.innerHTML || '';
    if (!currentEntry.title && !bodyText.replace(/<[^>]*>?/gm, '').trim()) {
      alert('Please write something before saving.');
      return;
    }

    const payload = { ...currentEntry, body: bodyText };

    try {
      if (currentEntry._id) {
        await axios.put(`http://localhost:5000/api/journal/${currentEntry._id}`, payload);
      } else {
        await axios.post('http://localhost:5000/api/journal', payload);
      }
      setView('list');
    } catch (err) {
      alert('Could not save. Please try again.');
    }
  };

  const execCommand = (cmd) => {
    document.execCommand(cmd, false, null);
    editorRef.current?.focus();
  };

  // --- RENDER HELPERS ---
  const formatGregDate = (dk) => {
    if (!dk) return '';
    const date = new Date(
      parseInt(dk.slice(0, 4), 10),
      parseInt(dk.slice(4, 6), 10) - 1,
      parseInt(dk.slice(6, 8), 10)
    );
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (!user) {
    return (
      <div className="jl-empty" style={{ paddingTop: '60px' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔒</div>
        <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--ink)' }}>
          Sign in to use the Journal
        </div>
        <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '8px' }}>
          Save your memories and reflections securely.
        </div>
      </div>
    );
  }

  // 1. LIST VIEW
  if (view === 'list') {
    const filtered = entries.filter((e) => {
      if (filterMonth) {
        const pd = PD[e.dateKey];
        if (!pd || !pd.month || !pd.month.startsWith(filterMonth)) return false;
      }
      if (searchQ) {
        const q = searchQ.toLowerCase();
        if (!(e.title || '').toLowerCase().includes(q) && !(e.body || '').toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });

    return (
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '24px 16px' }}>
        <div className="jl-header">
          <div>
            <div className="jl-title">Journal</div>
            <div className="jl-sub">
              {entries.length} entr{entries.length === 1 ? 'y' : 'ies'} · your personal panchanga diary
            </div>
          </div>
          <button className="j-btn-new" onClick={handleNewEntry}>
            + New Entry
          </button>
        </div>

        <div className="jl-toolbar">
          <input
            className="j-search"
            placeholder="🔍 Search entries..."
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
          />
          <select className="j-select" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
            <option value="">All months</option>
            {HINDU_MONTHS.map((hm) => (
              <option key={hm.k} value={hm.label.split(' ')[0]}>
                {hm.label}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="jl-loading">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="jl-empty">
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📔</div>
            <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ink)' }}>
              {entries.length === 0 ? 'Start your panchanga journal' : 'No entries found'}
            </div>
            {entries.length === 0 && (
              <button className="j-btn-new" style={{ marginTop: '16px' }} onClick={handleNewEntry}>
                Write first entry
              </button>
            )}
          </div>
        ) : (
          <div className="jl-grid">
            {filtered.map((e) => {
              const pd = PD[e.dateKey];
              const ritu = pd ? RITU_MAP[pd.month] : { icon: '' };
              const preview = (e.body || '').replace(/<[^>]+>/g, '').slice(0, 120);

              return (
                <div key={e._id} className="jl-card" onClick={() => handleRead(e)}>
                  <div className="jlc-top">
                    <div className="jlc-moon">
                      {pd ? moonIcon(pd.tithi, pd.paksha) : ''}
                      {ritu?.icon}
                    </div>
                    <div className="jlc-date">{formatGregDate(e.dateKey)}</div>
                    <div style={{ display: 'flex', gap: '5px', marginLeft: 'auto' }}>
                      <button
                        className="jlc-edit"
                        onClick={(ev) => {
                          ev.stopPropagation();
                          handleEdit(e);
                        }}
                      >
                        ✏️
                      </button>
                      <button className="jlc-del" onClick={(ev) => handleDelete(e._id, ev)}>
                        🗑️
                      </button>
                    </div>
                  </div>
                  <div className="jlc-title">{e.title || 'Untitled'}</div>
                  {pd && <div className="jlc-meta">{extractName(pd.tithi)} · {extractName(pd.nakshatra)}</div>}
                  <div className="jlc-preview">
                    {preview}
                    {preview.length === 120 ? '...' : ''}
                  </div>
                  <div className="jlc-mood">{e.mood}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // 2. WRITE VIEW
  if (view === 'write' && currentEntry) {
    const dk = currentEntry.dateKey;
    const pd = PD[dk];
    const ritu = pd ? RITU_MAP[pd.month] : { icon: '🌸', name: '' };

    // Convert YYYYMMDD to YYYY-MM-DD for date input
    const dateInputValue = `${dk.slice(0, 4)}-${dk.slice(4, 6)}-${dk.slice(6, 8)}`;

    return (
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '24px 16px' }}>
        <div className="jw-header">
          <button className="j-back" onClick={() => setView('list')}>
            ← Journal
          </button>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div className="jw-date">
              {pd ? moonIcon(pd.tithi, pd.paksha) : ''} {formatGregDate(dk)}
            </div>
            {pd && (
              <div className="jw-panchanga">
                {ritu?.icon} {ritu?.name} · {extractName(pd.nakshatra)}
              </div>
            )}
          </div>
          <button className="j-btn-save" onClick={handleSave}>
            Save
          </button>
        </div>

        <div className="jw-body">
          <div className="jw-field">
            <label className="jw-label">Date</label>
            <input
              type="date"
              className="j-date-input"
              value={dateInputValue}
              onChange={(e) => {
                const newDk = e.target.value.replace(/-/g, '');
                setCurrentEntry({ ...currentEntry, dateKey: newDk });
              }}
            />
          </div>

          <div className="jw-field">
            <input
              className="jw-title-input"
              placeholder="Give this memory a title..."
              value={currentEntry.title}
              onChange={(e) => setCurrentEntry({ ...currentEntry, title: e.target.value })}
            />
          </div>

          <div className="jw-field">
            <label className="jw-label">Mood</label>
            <div className="mood-grid">
              {MOODS.map((m) => (
                <button
                  key={m}
                  className={`mood-btn ${currentEntry.mood === m ? 'mood-sel' : ''}`}
                  onClick={() => setCurrentEntry({ ...currentEntry, mood: m })}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="jw-field" style={{ flex: 1 }}>
            <label className="jw-label">Your entry</label>
            <div className="jw-toolbar">
              <button onClick={() => execCommand('bold')}>
                <b>B</b>
              </button>
              <button onClick={() => execCommand('italic')}>
                <i>I</i>
              </button>
              <button onClick={() => execCommand('underline')}>
                <u>U</u>
              </button>
              <span className="jwtb-sep" />
              <button onClick={() => execCommand('insertUnorderedList')}>≡</button>
              <button onClick={() => execCommand('insertHorizontalRule')}>—</button>
            </div>
            <div
              ref={editorRef}
              className="jw-editor"
              contentEditable="true"
              dangerouslySetInnerHTML={{ __html: currentEntry.body }}
              data-placeholder="Write your thoughts, reflections, memories..."
            />
          </div>
        </div>
      </div>
    );
  }

  // 3. READ VIEW
  if (view === 'read' && currentEntry) {
    const pd = PD[currentEntry.dateKey];
    const ritu = pd ? RITU_MAP[pd.month] : { icon: '🌸', name: '' };

    return (
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '24px 16px' }}>
        <div className="jr-header">
          <button className="j-back" onClick={() => setView('list')}>
            ← Journal
          </button>
          <button className="j-btn-edit" onClick={() => setView('write')}>
            ✏️ Edit
          </button>
        </div>
        <div className="jr-body">
          <div className="jr-date">
            {pd ? moonIcon(pd.tithi, pd.paksha) : ''} {formatGregDate(currentEntry.dateKey)}
          </div>
          {pd && (
            <div className="jr-panchanga">
              {ritu?.icon} {ritu?.name} · {extractName(pd.nakshatra)}
            </div>
          )}
          {currentEntry.mood && <div className="jr-mood">{currentEntry.mood}</div>}
          <div className="jr-title">{currentEntry.title}</div>
          <div className="jr-text" dangerouslySetInnerHTML={{ __html: currentEntry.body }} />
          <div className="jr-saved">
            Saved{' '}
            {new Date(currentEntry.updatedAt || currentEntry.createdAt).toLocaleString('en-IN', {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Journal;
