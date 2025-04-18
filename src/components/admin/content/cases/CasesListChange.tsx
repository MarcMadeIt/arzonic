import React, { useState } from "react";
import { useTranslation } from "react-i18next";

interface NewsListChangeProps {
  onViewChange: (view: "cards" | "list") => void;
}

const CasesListChange = ({ onViewChange }: NewsListChangeProps) => {
  const { t } = useTranslation();
  const [activeView, setActiveView] = useState<"cards" | "list">("cards");

  const handleViewChange = (view: "cards" | "list") => {
    setActiveView(view);
    onViewChange(view);
  };

  return (
    <div role="tablist" className="tabs tabs-bordered">
      <a
        role="tab"
        className={`tab ${
          activeView === "cards" ? "tab-active bg-base-100 rounded-lg" : ""
        }`}
        onClick={() => handleViewChange("cards")}
      >
        {t("cards")}
      </a>
      <a
        role="tab"
        className={`tab ${
          activeView === "list"
            ? "tab-active tab-active bg-base-100 rounded-lg"
            : ""
        }`}
        onClick={() => handleViewChange("list")}
      >
        {t("list")}
      </a>
    </div>
  );
};

export default CasesListChange;
