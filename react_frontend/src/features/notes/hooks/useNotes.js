import { useState } from "react";
import {
  getNotes,
  addNote,
  updateNote,
  deleteNote,
} from "../../../services/notesService";

/**
 * PUBLIC_INTERFACE
 * Custom hook for managing notes business logic & data.
 */
export function useNotes() {
  const [notes, setNotes] = useState(getNotes());

  const handleAdd = note => {
    const updated = addNote(note);
    setNotes([...updated]);
  };

  const handleUpdate = (id, patch) => {
    const updated = updateNote(id, patch);
    setNotes([...updated]);
  };

  const handleDelete = id => {
    const updated = deleteNote(id);
    setNotes([...updated]);
  };

  return { notes, add: handleAdd, update: handleUpdate, remove: handleDelete };
}
