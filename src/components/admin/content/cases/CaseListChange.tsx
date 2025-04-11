import React, { useState } from "react";

interface NewsListChangeProps {
  onViewChange: (view: "cards" | "list") => void;
}

const NewsListChange = ({ onViewChange }: NewsListChangeProps) => {
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
        Kort
      </a>
      <a
        role="tab"
        className={`tab ${activeView === "list" ? "tab-active" : ""}`}
        onClick={() => handleViewChange("list")}
      >
        Liste
      </a>
    </div>
  );
};

export default NewsListChange;
