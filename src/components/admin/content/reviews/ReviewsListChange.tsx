import React, { useState } from "react";
import { t } from "i18next";

interface ReviewListChangeProps {
  onViewChange: (view: "cards" | "list") => void;
}

const ReviewsListChange = ({ onViewChange }: ReviewListChangeProps) => {
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
        {t("cards")}
      </a>
      <a
        role="tab"
        className={`tab ${activeView === "list" ? "tab-active" : ""}`}
        onClick={() => handleViewChange("list")}
      >
        {t("list")}
      </a>
    </div>
  );
};

export default ReviewsListChange;
