"use client";

import React, { useState } from "react";
import Requests from "./requests/Requests";
import { FaCalendarCheck, FaClipboardCheck } from "react-icons/fa6";
import Bookings from "./bookings/Bookings";

const NavMessages = () => {
  const [activeTab, setActiveTab] = useState("users");
  return (
    <div className="w-full">
      <div
        role="tablist"
        className="tabs sm:tabs-lg w-full md:w-96 text-[15px]"
      >
        <button
          role="tab"
          className={`tab gap-2  ${
            activeTab === "users"
              ? "tab-active bg-base-200 rounded-lg shadow-md"
              : ""
          }`}
          onClick={() => setActiveTab("users")}
        >
          <FaClipboardCheck />
          Kontaktformular
        </button>
        <button
          role="tab"
          className={`tab gap-2  ${
            activeTab === "extra"
              ? "tab-active bg-base-200 rounded-lg shadow-md"
              : ""
          }`}
          onClick={() => setActiveTab("extra")}
        >
          <FaCalendarCheck />
          Bookings
        </button>
      </div>

      <div className="mt-3 md:mt-5">
        {activeTab === "users" && (
          <div className="bg-base-200 rounded-lg shadow-md p-3 md:p-7">
            <Requests />
          </div>
        )}
        {activeTab === "extra" && (
          <div className="bg-base-200 rounded-lg shadow-md p-3 md:p-7">
            <Bookings />
          </div>
        )}
      </div>
    </div>
  );
};

export default NavMessages;
