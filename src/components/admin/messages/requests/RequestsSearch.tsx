import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";

interface RequestsSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedRequests: number[];
  onDeleteSelected: () => void;
}

const RequestsSearch = ({
  searchTerm,
  setSearchTerm,
  selectedRequests,
  onDeleteSelected,
}: RequestsSearchProps) => {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleDelete = () => {
    onDeleteSelected();
    closeModal();
  };

  return (
    <div className="flex items-center justify-between">
      <label className="input input-bordered input-md flex items-center gap-2">
        <input
          type="text"
          className="grow"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FaSearch />
      </label>
      <div className="flex items-center gap-2">
        <button
          className="btn btn-danger"
          onClick={openModal}
          disabled={selectedRequests.length === 0}
        >
          <FaTrash />
          <span className="hidden md:block">Slet valgte</span>
        </button>
      </div>
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Bekræft sletning</h3>
            <p className="py-4">
              Er du sikker på, at du vil slette de valgte anmodninger?
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
    </div>
  );
};

export default RequestsSearch;
