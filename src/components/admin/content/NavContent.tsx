"use client";

import React, { useState } from "react";
import { FaRegNewspaper, FaStar } from "react-icons/fa6";
import Cases from "./cases/Cases";
import Reviews from "./reviews/Reviews";

const NavContent = () => {
  const [activeTab, setActiveTab] = useState("cases");
  return (
    <div className="w-full">
      <div
        role="tablist"
        className="tabs sm:tabs-lg w-full md:w-96 text-[15px]"
      >
        <button
          role="tab"
          className={`tab gap-2  ${
            activeTab === "cases"
              ? "tab-active bg-base-200 rounded-lg shadow-md"
              : ""
          }`}
          onClick={() => setActiveTab("cases")}
        >
          <FaRegNewspaper />
          Cases
        </button>
        <button
          role="tab"
          className={`tab gap-2  ${
            activeTab === "reviews"
              ? "tab-active bg-base-200 rounded-lg shadow-md"
              : ""
          }`}
          onClick={() => setActiveTab("reviews")}
        >
          <FaStar />
          Reviews
        </button>
      </div>

      <div className="mt-3 md:mt-5">
        {activeTab === "cases" && (
          <div className="bg-base-200 rounded-lg shadow-md p-5 md:p-7">
            <Cases />
          </div>
        )}
        {activeTab === "reviews" && (
          <div className="bg-base-200  rounded-lg shadow-md p-5 md:p-7">
            <Reviews />
          </div>
        )}
      </div>
    </div>
  );
};

export default NavContent;
