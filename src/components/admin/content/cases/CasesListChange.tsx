import React, { useState } from "react";

interface NewsListChangeProps {
  onViewChange: (view: "cards" | "list") => void;
}

const CasesListChange = ({ onViewChange }: NewsListChangeProps) => {
  const [activeView, setActiveView] = useState<"cards" | "list">("cards");

  const handleViewChange = (view: "cards" | "list") => {
    setActiveView(view);
    onViewChange(view);
  };

  return (
    <div role="tablist" className="tabs tabs-bordered">
      <a
        role="tab"
        className={`tab ${activeView === "cards" ? "tab-active" : ""}`}
        onClick={() => handleViewChange("cards")}
      >
        Cards
      </a>
      <a
        role="tab"
        className={`tab ${activeView === "list" ? "tab-active" : ""}`}
        onClick={() => handleViewChange("list")}
      >
        List
      </a>
    </div>
  );
};

export default CasesListChange;
