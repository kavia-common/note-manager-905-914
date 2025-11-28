import React, { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";

// ---- THEME COLORS: Ocean Professional ----
const theme = {
  primary: "#2563EB",
  secondary: "#F59E0B",
  success: "#F59E0B",
  error: "#EF4444",
  background: "#f9fafb",
  surface: "#ffffff",
  text: "#111827",
  gradient:
    "linear-gradient(135deg, rgba(37,99,235,0.08) 0%, #f9fafb 100%)",
};

const NOTES_KEY = "notes";

// ---- Define Note model ----
function createEmptyNote() {
  const now = Date.now();
  return {
    id: "note-" + now + "-" + Math.random().toString(36).slice(2),
    title: "",
    content: "",
    createdAt: now,
    updatedAt: now,
  };
}

function formatDateTime(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  const hour = d.getHours().toString().padStart(2, "0");
  const min = d.getMinutes().toString().padStart(2, "0");
  return `${y}-${m}-${day} ${hour}:${min}`;
}

// ---- Notes Context ----
const NotesContext = React.createContext();

export function useNotes() {
  return React.useContext(NotesContext);
}

// PUBLIC_INTERFACE
function NotesProvider({ children }) {
  const [notes, setNotes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  // Load notes from localStorage
  useEffect(() => {
    const local = localStorage.getItem(NOTES_KEY);
    if (local) {
      try {
        const arr = JSON.parse(local);
        setNotes(
          Array.isArray(arr)
            ? arr.map((n) => ({
                ...n,
                createdAt: typeof n.createdAt === "number" ? n.createdAt : Date.now(),
                updatedAt: typeof n.updatedAt === "number" ? n.updatedAt : Date.now(),
              }))
            : []
        );
      } catch {
        setNotes([]);
      }
    }
  }, []);

  // Save notes to localStorage
  useEffect(() => {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  }, [notes]);

  // PUBLIC_INTERFACE
  const createNote = useCallback(() => {
    const newNote = createEmptyNote();
    setNotes((prev) => [newNote, ...prev]);
    setSelectedId(newNote.id);
    return newNote.id;
  }, []);

  // PUBLIC_INTERFACE
  const updateNote = useCallback(
    (id, fields) => {
      setNotes((prev) =>
        prev.map((note) =>
          note.id === id ? { ...note, ...fields, updatedAt: Date.now() } : note
        )
      );
    },
    [setNotes]
  );

  // PUBLIC_INTERFACE
  const deleteNote = useCallback(
    (id) => {
      setNotes((prev) => prev.filter((note) => note.id !== id));
      // Select the next note or first in list if any
      setTimeout(() => {
        setSelectedId((oldId) => {
          if (oldId === id) {
            const rest = notes.filter((note) => note.id !== id);
            return rest.length > 0 ? rest[0].id : null;
          }
          return oldId;
        });
      }, 100);
    },
    [notes]
  );

  // PUBLIC_INTERFACE
  const selectNote = useCallback((id) => {
    setSelectedId(id);
  }, []);

  const value = {
    notes,
    selectedId,
    createNote,
    updateNote,
    deleteNote,
    selectNote,
  };
  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}

// ---- Header ----
function Header() {
  return (
    <header
      style={{
        width: "100%",
        background:
          theme.gradient,
        boxShadow: "0 2px 8px rgba(37,99,235,0.08)",
        color: theme.primary,
        padding: "1.5rem 2rem",
        fontWeight: 700,
        fontSize: "1.7rem",
        letterSpacing: "0.02em",
        borderBottom: `1.5px solid ${theme.primary}20`,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
      }}
    >
      <span style={{ color: theme.primary, marginRight: 10 }}>📝</span>
      Notes
    </header>
  );
}

// ---- NoteList Left Panel ----
function NoteList({ search, onSetSearch }) {
  const { notes, selectedId, selectNote } = useNotes();

  const filtered =
    search.trim() === ""
      ? notes
      : notes.filter(
          (n) =>
            n.title?.toLowerCase().includes(search.toLowerCase()) ||
            n.content?.toLowerCase().includes(search.toLowerCase())
        );

  return (
    <aside
      className="notelist"
      style={{
        background: theme.surface,
        borderRight: `1px solid ${theme.primary}16`,
        boxShadow: "1px 0 6px 0 rgba(37,99,235,0.04)",
        minWidth: 250,
        maxWidth: 320,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "0.5rem 0",
        position: "relative",
        zIndex: 1,
      }}
    >
      <input
        className="notelist-search"
        type="text"
        value={search}
        onChange={(e) => onSetSearch(e.target.value)}
        placeholder="Search notes"
        style={{
          margin: "0 1rem 0.7rem 1rem",
          padding: "0.55rem 1rem",
          borderRadius: "12px",
          border: `1.5px solid ${theme.primary}33`,
          fontSize: "1rem",
          color: theme.text,
          background: theme.background,
          outline: "none",
        }}
        spellCheck={false}
      />
      <ul
        className="notelist-list"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 0,
          margin: 0,
          listStyle: "none",
        }}
      >
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", color: "#9ca3af", marginTop: 32, fontWeight: 400 }}>
            {notes.length === 0
              ? (
                  <div>
                    <span style={{fontSize: "2rem"}}>🗒️</span>
                    <div style={{margin: "10px 0 0"}}>Start by creating a note!</div>
                  </div>
                )
              : "No notes match your search."}
          </div>
        ) : (
          filtered.map((note) => (
            <li
              key={note.id}
              onClick={() => selectNote(note.id)}
              style={{
                cursor: "pointer",
                padding: "0.7rem 1.3rem 0.6rem 1.3rem",
                marginBottom: "2px",
                borderLeft: `4px solid ${
                  selectedId === note.id ? theme.primary : "transparent"
                }`,
                background:
                  selectedId === note.id
                    ? "#2563eb10"
                    : "transparent",
                borderRadius: "0 12px 12px 0",
                fontWeight: selectedId === note.id ? 600 : 450,
                boxShadow:
                  selectedId === note.id
                    ? "0 2px 8px rgba(37,99,235,.07)"
                    : "none",
                transition: "box-shadow 0.2s, border .19s",
                minHeight: "4.5rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                color: theme.text,
              }}
              tabIndex={0}
            >
              <div
                title={note.title || "(Untitled)"}
                style={{
                  emoji: "📑",
                  fontSize: "1.15rem",
                  marginBottom: "2px",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                {note.title ? note.title : <span style={{opacity: 0.6, fontStyle: "italic"}}>(Untitled)</span>}
              </div>
              <div
                style={{
                  color: "#6b7280",
                  fontSize: "0.89rem",
                  fontWeight: 400,
                  marginTop: 3,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                {note.content &&
                  (note.content.length > 50
                    ? note.content.slice(0, 50) + "…"
                    : note.content)}
              </div>
              <div
                style={{
                  color: "#b6b9be",
                  fontSize: "0.76rem",
                  fontWeight: 400,
                  marginTop: 2,
                  alignSelf: "flex-end",
                }}
              >
                {formatDateTime(note.updatedAt)}
              </div>
            </li>
          ))
        )}
      </ul>
    </aside>
  );
}

// ---- NoteEditor ----
function NoteEditor() {
  const { notes, selectedId, updateNote, deleteNote } = useNotes();
  const note = notes.find((n) => n.id === selectedId);
  const [title, setTitle] = useState(note?.title ?? "");
  const [content, setContent] = useState(note?.content ?? "");
  const [dirty, setDirty] = useState(false);
  const autosaveTimeout = useRef(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setTitle(note?.title ?? "");
    setContent(note?.content ?? "");
    setDirty(false);
    setSaved(false);
  }, [selectedId, note?.title, note?.content]);

  // Autosave on change with 1200ms debounce
  useEffect(() => {
    if (!note) return;
    if (!dirty) return;
    clearTimeout(autosaveTimeout.current);
    autosaveTimeout.current = setTimeout(() => {
      updateNote(note.id, { title, content });
      setDirty(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 800);
    }, 1200);
    return () => clearTimeout(autosaveTimeout.current);
    // eslint-disable-next-line
  }, [title, content, note?.id, dirty]);

  // Keyboard shortcut for save (Ctrl/Cmd+S)
  useEffect(() => {
    function handler(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        if (note && (title !== note.title || content !== note.content)) {
          e.preventDefault();
          updateNote(note.id, { title, content });
          setDirty(false);
          setSaved(true);
          setTimeout(() => setSaved(false), 900);
        }
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line
  }, [title, content, note, updateNote]);

  if (!note) {
    return (
      <main
        className="noteeditor"
        style={{
          flex: 1,
          background: theme.background,
          padding: "2rem 2.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100%",
        }}
      >
        <div style={{
          textAlign: "center",
          color: "#9ca3af",
        }}>
          {"← Select a note or "}
          <span style={{color: theme.primary, fontWeight: 500}}>create a new one</span>
          .
        </div>
      </main>
    );
  }

  return (
    <main
      className="noteeditor"
      style={{
        flex: 1,
        minWidth: 0,
        background: theme.background,
        padding: "2rem 2.5rem",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 18 }}>
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setDirty(true);
          }}
          placeholder="Title"
          style={{
            fontSize: "1.35rem",
            fontWeight: 600,
            border: "none",
            borderBottom: `2px solid ${theme.primary}30`,
            background: "transparent",
            color: theme.text,
            outline: "none",
            flex: 1,
            padding: "3px 2px",
            marginRight: 4,
            borderRadius: "2.5px 2.5px 0 0",
            boxShadow: dirty ? `0 2px 8px ${theme.primary}11` : "none",
            transition: "box-shadow 0.2s",
          }}
          maxLength={120}
          autoFocus
        />
        <button
          title="Delete note"
          style={{
            background: theme.error,
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "7px 14px",
            fontWeight: 600,
            cursor: "pointer",
            marginLeft: "auto",
            fontSize: "1rem",
            boxShadow: "0 1px 5px rgba(239, 68, 68, 0.13)",
            transition: "background 0.18s",
          }}
          onClick={() => {
            if (window.confirm("Delete this note? This cannot be undone.")) {
              deleteNote(note.id);
            }
          }}
        >
          Delete
        </button>
      </div>
      <textarea
        value={content}
        placeholder="Start writing your note..."
        maxLength={7000}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={true}
        onChange={(e) => {
          setContent(e.target.value);
          setDirty(true);
        }}
        style={{
          resize: "vertical",
          minHeight: 200,
          flex: 1,
          fontSize: "1.10rem",
          border: `1.4px solid ${theme.primary}30`,
          borderRadius: "12px",
          padding: "1.2rem",
          marginBottom: "1.6rem",
          background: theme.surface,
          color: theme.text,
          boxShadow: dirty
            ? `0 2px 12px ${theme.primary}18, 0 1.5px 6px #bcd1ef26`
            : "0 1.5px 6px #bcd1ef09",
          outline: "none",
          transition: "box-shadow 0.25s, border 0.12s",
          fontFamily: "inherit",
        }}
      />
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <button
          title="Save note"
          style={{
            background: theme.primary,
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "9px 25px",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: "1.05rem",
            boxShadow: "0 2px 10px rgba(37, 99, 235, 0.14)",
            transition: "background 0.18s",
            opacity: dirty ? 1 : 0.68,
          }}
          disabled={!dirty}
          onClick={() => {
            updateNote(note.id, { title, content });
            setDirty(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 1000);
          }}
        >
          Save
        </button>
        <div style={{ color: "#10b981", fontWeight: 500, minWidth: 90, opacity: saved ? 1 : 0, transition: "opacity 0.25s" }}>
          {saved ? "Saved!" : ""}
        </div>
        <span style={{ color: "#6b7280", marginLeft: "auto", fontSize: "0.92rem", minWidth: 60 }}>
          {note.updatedAt !== note.createdAt
            ? `Updated: ${formatDateTime(note.updatedAt)}`
            : `Created: ${formatDateTime(note.createdAt)}`}
        </span>
      </div>
    </main>
  );
}

// ---- Floating Action Button ----
function FloatingActionButton() {
  const { createNote } = useNotes();
  return (
    <button
      title="New note"
      aria-label="Add Note"
      onClick={createNote}
      style={{
        position: "fixed",
        bottom: "2.2rem",
        right: "2.2rem",
        zIndex: 99,
        width: 68,
        height: 68,
        background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.success} 90%)`,
        color: "#fff",
        border: "none",
        borderRadius: "50%",
        fontSize: "2.4rem",
        boxShadow:
          "0 10px 32px 0 rgba(37,99,235,0.24), 0 1.5px 5px #bcd1ef21",
        cursor: "pointer",
        outline: "none",
        transition: "background 0.17s, box-shadow 0.2s",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span style={{fontWeight: 600, fontSize: 33, marginTop: -3, marginLeft: 1}}>+</span>
    </button>
  );
}

// ---- Main Layout ----
function Layout() {
  const [search, setSearch] = useState("");
  return (
    <div
      className="layout"
      style={{
        display: "flex",
        flexDirection: "row",
        height: "calc(100vh - 70px)",
        background: theme.background,
        minHeight: 0,
      }}
    >
      <NoteList search={search} onSetSearch={setSearch} />
      <div style={{flex: 1, minWidth: 0, background: theme.background, position: 'relative', display: "flex"}}>
        <NoteEditor />
      </div>
      <FloatingActionButton />
    </div>
  );
}

// ---- App Component ----
// PUBLIC_INTERFACE
function App() {
  // Respect theme toggle from template (retain for header contrast)
  // Style overrides applied here for new color scheme per Ocean Professional
  useEffect(() => {
    // Apply Ocean Professional colors as css vars
    const root = document.documentElement;
    root.style.setProperty("--bg-primary", theme.background);
    root.style.setProperty("--bg-secondary", theme.surface);
    root.style.setProperty("--text-primary", theme.text);
    root.style.setProperty("--text-secondary", theme.primary);
    root.style.setProperty("--border-color", theme.primary + "1A");
    root.style.setProperty("--button-bg", theme.primary);
    root.style.setProperty("--button-text", "#fff");
    // Remove default template logo etc
    if (document.querySelector(".App-logo")) {
      document.querySelector(".App-logo").style.display = "none";
    }
  }, []);
  return (
    <NotesProvider>
      <div
        className="App"
        style={{
          background: theme.background,
          color: theme.text,
          minHeight: "100vh",
          transition: "background 0.3s, color 0.2s",
        }}
      >
        <Header />
        <Layout />
      </div>
    </NotesProvider>
  );
}

export default App;
