"use client";

import React, { useState } from "react";
import UserList from "./UserList";
import Register from "./register/Register";
import UpdateUser from "./update/UpdateUser"; // Import UpdateUser component
import { FaAngleLeft } from "react-icons/fa6";

const Users = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false); // New state for showing UpdateUser
  const [showToast, setShowToast] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null); // State for selected user ID

  const handleUserCreated = () => {
    setShowRegister(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleUserUpdated = () => {
    setShowUpdate(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleUpdateUserClick = (userId: string) => {
    setSelectedUserId(userId);
    setShowUpdate(true);
  };

  return (
    <div className="flex flex-col gap-8">
      {showRegister ? (
        <div className="flex flex-col items-start gap-5">
          <button
            onClick={() => setShowRegister(false)}
            className="btn btn-ghost "
          >
            <FaAngleLeft />
            Tilbage
          </button>
          <Register onUserCreated={handleUserCreated} />
        </div>
      ) : showUpdate && selectedUserId ? (
        <div className="flex flex-col items-start gap-5">
          <button
            onClick={() => setShowUpdate(false)}
            className="btn btn-ghost "
          >
            <FaAngleLeft />
            Tilbage
          </button>
          <UpdateUser
            userId={selectedUserId}
            onUserUpdated={handleUserUpdated}
          />
        </div>
      ) : (
        <>
          <div>
            <button
              onClick={() => setShowRegister(true)}
              className="btn btn-primary "
            >
              Opret bruger
            </button>
          </div>

          <div>
            <UserList onUpdateUserClick={handleUpdateUserClick} />
          </div>
        </>
      )}
      {showToast && (
        <div className="toast bottom-20 md:bottom-0 toast-end">
          <div className="alert alert-success text-neutral-content">
            <span className="text-base md:text-lg">
              {showRegister ? "Bruger oprettet" : "Bruger opdateret"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
