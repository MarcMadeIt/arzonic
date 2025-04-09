"use client";

import React, { useState } from "react";

interface ContactSelectProps {
  onChange: (value: string) => void;
  isCallForm?: boolean;
}

const TaskSelect = ({ onChange, isCallForm = false }: ContactSelectProps) => {
  const [selectedOption, setSelectedOption] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedOption(value);
    onChange(value);
  };

  return (
    <label className="form-control w-full max-w-xs">
      <div className="label">
        <span className="label-text md:text-base">
          Which task are you interested in?
        </span>
      </div>
      <select
        className={`select select-bordered ${
          isCallForm ? "md:select-lg" : "select-md"
        }`}
        value={selectedOption}
        onChange={handleChange}
        required
      >
        <option value="" disabled>
          Choose Task
        </option>
        <option value="Website">Website</option>
        <option value="Web App">Web App</option>
        <option value="3D Visualization">3D Visualization</option>
        <option value="Branding">Branding</option>
        <option value="Social Media Content">Social Media Content</option>
        <option value="Other">Other</option>
      </select>
    </label>
  );
};

export default TaskSelect;
