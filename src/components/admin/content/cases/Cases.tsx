"use client";

import React, { useState } from "react";
import { FaAngleLeft } from "react-icons/fa6";
import CasesPagination from "./CasesPagination";
import CreateCase from "./createCase/CreateCase";
import UpdateCase from "./updateCase/UpdateCase";
import CasesListChange from "./CasesListChange";
import CasesList from "./CasesList";
import { useTranslation } from "react-i18next";

const Cases = () => {
  const { t } = useTranslation();
  const [view, setView] = useState<"cards" | "list">("cards");
  const [showCreateCase, setShowCreateCase] = useState(false);
  const [showUpdateCase, setShowUpdateCase] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const handleViewChange = (view: "cards" | "list") => {
    setView(view);
  };

  const handleCaseCreated = () => {
    setShowCreateCase(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleCaseUpdated = () => {
    setShowUpdateCase(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="flex flex-col md:items-start gap-7">
      {showCreateCase ? (
        <div className="flex flex-col items-start gap-5">
          <button
            onClick={() => setShowCreateCase(false)}
            className="btn btn-ghost"
          >
            <FaAngleLeft />
            {t("back")}
          </button>
          <CreateCase onCaseCreated={handleCaseCreated} />
        </div>
      ) : showUpdateCase && selectedCaseId !== null ? (
        <div className="flex flex-col items-start gap-5">
          <button
            onClick={() => setShowUpdateCase(false)}
            className="btn btn-ghost"
          >
            <FaAngleLeft />
            {t("back")}
          </button>
          <UpdateCase
            caseId={selectedCaseId}
            onCaseUpdated={handleCaseUpdated}
          />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center w-full">
            <button
              onClick={() => setShowCreateCase(true)}
              className="btn btn-primary"
            >
              {t("create")} Case
            </button>
            <CasesListChange onViewChange={handleViewChange} />
          </div>
          <CasesList
            view={view}
            page={page}
            setTotal={setTotal}
            onEditCase={(caseId: number) => {
              setSelectedCaseId(caseId);
              setShowUpdateCase(true);
            }}
          />
          <div className="flex w-full justify-center">
            {total > 6 && (
              <CasesPagination page={page} setPage={setPage} total={total} />
            )}
          </div>
        </>
      )}
      {showToast && (
        <div className="toast bottom-20 md:bottom-0 toast-end">
          <div className="alert alert-success text-neutral-content">
            <span className="text-base md:text-lg">
              {showCreateCase ? t("case_created") : t("case_updated")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cases;
