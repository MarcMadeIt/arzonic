import React, { useState, useEffect } from "react";
import {
  createRequestNote,
  getNotesByRequestId,
  deleteRequestNote,
} from "@/lib/server/actions";
import { FaTrashAlt } from "react-icons/fa";

const RequestNote = ({ requestId }: { requestId: string }) => {
  const [desc, setDesc] = useState("");
  const [notes, setNotes] = useState<
    { id: string; desc: string; created_at: string }[]
  >([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [charCount, setCharCount] = useState(0);
  const maxCharLimit = 50;

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const fetchedNotes = await getNotesByRequestId(requestId);
        setNotes(
          fetchedNotes.map((note) => ({
            id: note.id,
            desc: note.desc,
            created_at: note.created_at,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch notes:", error);
      }
    };

    fetchNotes();
  }, [requestId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const currentTime = new Date().toISOString();
      const tempId = Math.random().toString();
      setNotes((prevNotes) => [
        ...prevNotes,
        { id: tempId, desc, created_at: currentTime },
      ]);

      setDesc("");
      setToastMessage("Kundenote tilføjet");
      setShowToast(true);

      const newNote = await createRequestNote(desc, requestId);

      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === tempId
            ? { ...note, id: newNote.id, created_at: newNote.created_at }
            : note
        )
      );
    } catch {
      setToastMessage("Fejl ved tilføjelse af kundenote");
      setShowToast(true);
    }
  };

  const handleDelete = async (noteId: string) => {
    try {
      await deleteRequestNote(noteId);
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
      setToastMessage("Kundenote slettet");
      setShowToast(true);
    } catch (error) {
      console.error("Failed to delete note:", error);
      setToastMessage("Failed to delete note");
      setShowToast(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDesc(e.target.value);
    setCharCount(e.target.value.length);
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  return (
    <div className="flex flex-col gap-2 w-full md:w-4/5 2xl:w-3/5">
      <span className="text-xs md:text-sm font-medium text-gray-400">
        Noter for kunde
      </span>
      <hr className="border-base-300 rounded-lg" />
      <div className="flex flex-col gap-2">
        {notes.map((note) => (
          <div
            key={note.id}
            className="flex justify-between items-center gap-4 bg-gray-100 p-2 rounded-lg"
          >
            <div className="flex flex-col gap-1 px-2">
              <p className="text-sm md:text-xl font-semibold">{note.desc}</p>
              <p className="text-xs text-gray-500">
                {note.created_at
                  ? new Date(note.created_at).toLocaleDateString("da-DK")
                  : "Ugyldig dato"}
              </p>
            </div>
            <div>
              <button
                className="btn btn-ghost"
                onClick={() => handleDelete(note.id)}
              >
                Slet
                <FaTrashAlt />
              </button>
            </div>
          </div>
        ))}
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col lg:flex-row items-start gap-4 relative"
      >
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            placeholder="Skriv en kundenote"
            className="input input-bordered w-full max-w-xs"
            value={desc}
            onChange={handleInputChange}
            maxLength={maxCharLimit}
          />
          <span className="text-xs text-gray-500 absolute -bottom-5 right-0">
            {charCount}/{maxCharLimit} tegn
          </span>
        </div>

        <button type="submit" className="btn">
          Tilføj note
        </button>
      </form>
      {showToast && (
        <div className="hidden lg:block toast toast-end">
          <div
            className={`alert text-neutral-content ${
              toastMessage.includes("tilføjet") ||
              toastMessage.includes("slettet")
                ? "alert-success"
                : "alert-error"
            }`}
          >
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestNote;
