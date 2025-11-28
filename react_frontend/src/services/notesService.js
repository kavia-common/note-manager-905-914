/**
 * PUBLIC_INTERFACE
 * Notes Service: provides CRUD operations for notes.
 * (Currently uses localStorage, easy to swap for API.)
 */

const STORAGE_KEY = "notes";

/**
 * Get all notes.
 */
export function getNotes() {
  const data = localStorage.getItem(STORAGE_KEY);
  try {
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Save all notes.
 * @param {Array} notes
 */
export function saveNotes(notes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

/**
 * Add a new note and return the note list.
 * @param {object} note
 */
export function addNote(note) {
  const notes = getNotes();
  notes.push(note);
  saveNotes(notes);
  return notes;
}

/**
 * Update a note by id.
 * @param {string} id
 * @param {object} updated
 */
export function updateNote(id, updated) {
  let notes = getNotes();
  notes = notes.map(note => (note.id === id ? { ...note, ...updated } : note));
  saveNotes(notes);
  return notes;
}

/**
 * Delete a note by id.
 * @param {string} id
 */
export function deleteNote(id) {
  let notes = getNotes();
  notes = notes.filter(note => note.id !== id);
  saveNotes(notes);
  return notes;
}
