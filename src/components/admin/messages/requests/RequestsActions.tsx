import React, { useState } from "react";
import { FaEllipsis, FaPen, FaTrash } from "react-icons/fa6";
import { deleteRequest } from "@/lib/server/actions"; // Import delete action

const RequestsActions = ({
  requestId,
  onEditClick,
  onDeleteSuccess,
}: {
  requestId: string;
  onEditClick: () => void;
  onDeleteSuccess: () => void;
}) => {
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async () => {
    if (!requestId) {
      console.error("Invalid requestId:", requestId);
      return;
    }
    try {
      await deleteRequest(requestId);
      setShowModal(false);
      onDeleteSuccess();
    } catch (error) {
      console.error("Failed to delete request:", error);
    }
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <>
      <div className="dropdown dropdown-bottom dropdown-end">
        <div tabIndex={0} role="button" className="btn">
          <FaEllipsis size={20} />
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box z-[1] w-56 gap-2 p-2 shadow"
        >
          <li>
            <button className="md:text-lg" onClick={onEditClick}>
              <FaPen /> Opdater kunde
            </button>
          </li>
          <li>
            <button className="md:text-lg" onClick={openModal}>
              <FaTrash /> Slet kunde
            </button>
          </li>
        </ul>
      </div>
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Bekræft sletning</h3>
            <p className="py-4">
              Er du sikker på, at du vil slette denne kunde?
            </p>
            <div className="modal-action">
              <button className="btn" onClick={closeModal}>
                Annuller
              </button>
              <button className="btn btn-error" onClick={handleDelete}>
                Slet
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RequestsActions;
