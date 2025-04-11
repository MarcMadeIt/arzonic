"use client";

import React from "react";
import SetupUploadImages from "./SetupUploadImages";

const Setup = () => {
  return (
    <div className="flex flex-col gap-5">
      <SetupUploadImages />
      <hr className="border-1 border-gray-400 rounded-md" />
    </div>
  );
};

export default Setup;
