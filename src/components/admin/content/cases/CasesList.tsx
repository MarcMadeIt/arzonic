import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { FaPen, FaTrash } from "react-icons/fa6";
import { getAllCases, deleteCase } from "@/lib/server/actions";
import UpdateCase from "./updateCase/UpdateCase";
import ReactCompareImage from "react-compare-image";
import { useTranslation } from "react-i18next";

interface CasesListProps {
  view: "cards" | "list";
  page: number;
  setTotal: (total: number) => void;
  onEditCase: (caseId: number) => void;
}

interface CaseItem {
  id: number;
  company_name: string;
  desc: string | null;
  formType: "normal" | "beforeAfter";
  image: string | null;
  imageBefore: string | null;
  imageAfter: string | null;
}

const FALLBACK_IMAGE = "/demo.jpg";

const CasesList = ({ view, page, setTotal, onEditCase }: CasesListProps) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(true);
  const [caseItems, setCaseItems] = useState<CaseItem[]>([]);
  const [editingCaseId, setEditingCaseId] = useState<number | null>(null);
  const [deletingCaseId, setDeletingCaseId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const fetchCases = useCallback(async () => {
    try {
      setLoading(true);
      const { cases, total } = await getAllCases(page);
      setCaseItems(cases || []);
      setTotal(total || 0);
    } catch (error) {
      console.error("Failed to fetch cases:", error);
      setCaseItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, setTotal]);

  useEffect(() => {
    fetchCases();
  }, [page, setTotal, fetchCases]);

  const truncateDescription = (
    description: string | null,
    maxLength: number
  ) => {
    if (!description || description.length <= maxLength)
      return description || "";
    return description.substring(0, maxLength) + "...";
  };

  const truncateTitle = (title: string, maxLength: number) => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + "...";
  };

  const handleCaseUpdated = () => {
    setEditingCaseId(null);
    fetchCases();
  };

  const handleDelete = async () => {
    if (deletingCaseId !== null) {
      try {
        await deleteCase(deletingCaseId);
        setDeletingCaseId(null);
        setIsModalOpen(false);
        fetchCases();
      } catch (error) {
        console.error("Failed to delete case:", error);
      }
    }
  };

  const closeModal = () => {
    setDeletingCaseId(null);
    setIsModalOpen(false);
  };

  return (
    <div className="w-full">
      {loading ? (
        <div className="flex justify-center gap-3 items-center">
          <span className="loading loading-spinner loading-md"></span>
          {t("loading_cases")}
        </div>
      ) : caseItems.length === 0 ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-lg text-gray-500">{t("no_cases")}</p>
        </div>
      ) : editingCaseId ? (
        <UpdateCase caseId={editingCaseId} onNewsUpdated={handleCaseUpdated} />
      ) : (
        <>
          {view === "cards" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {caseItems.map((item) => (
                <div
                  key={item.id}
                  className="card card-compact shadow- ring-2 ring-base-100 rounded-md"
                >
                  <figure className="relative w-full aspect-[4/3] h-56 md:h-40 xl:h-56 overflow-hidden">
                    <div className="relative w-full h-full">
                      <Image
                        src={item.image || FALLBACK_IMAGE}
                        alt={item.company_name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  </figure>
                  <div className="card-body">
                    <h2 className="card-title text-lg">{item.company_name}</h2>
                    <p className="text-xs">
                      {truncateDescription(item.desc, 100)}
                    </p>
                    <div className="card-actions justify-end mt-2">
                      <button
                        className="btn btn-sm"
                        onClick={() => onEditCase(item.id)}
                      >
                        <FaPen />
                        {t("edit")}
                      </button>
                      <button
                        className="btn btn-sm"
                        onClick={() => {
                          setDeletingCaseId(item.id);
                          setIsModalOpen(true);
                        }}
                      >
                        <FaTrash />
                        {t("delete")}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {caseItems.map((item) => (
                <React.Fragment key={item.id}>
                  <li>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2 items-center">
                        <div className="relative w-12 h-10 rounded-md overflow-hidden">
                          <Image
                            src={item.image || FALLBACK_IMAGE}
                            alt={item.company_name}
                            fill
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                        <h3 className="font-semibold text-xs hidden sm:block">
                          {item.company_name}
                        </h3>
                        <h3 className="font-semibold text-xs block sm:hidden">
                          {truncateTitle(item.company_name, 20)}
                        </h3>
                      </div>
                      <div className="flex gap-5 md:gap-2">
                        <button
                          className="btn btn-sm"
                          onClick={() => onEditCase(item.id)}
                        >
                          <FaPen />
                          <span className="md:flex hidden"> {t("edit")} </span>
                        </button>
                        <button
                          className="btn btn-sm"
                          onClick={() => {
                            setDeletingCaseId(item.id);
                            setIsModalOpen(true);
                          }}
                        >
                          <FaTrash />
                          <span className="md:flex hidden">
                            {" "}
                            {t("delete")}{" "}
                          </span>
                        </button>
                      </div>
                    </div>
                  </li>
                  <hr className="border-[1px] rounded-lg border-base-200" />
                </React.Fragment>
              ))}
            </ul>
          )}
        </>
      )}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">{t("delete_confirmation")}</h3>
            <p className="py-4">{t("delete_case_prompt")}</p>
            <div className="modal-action">
              <button className="btn" onClick={closeModal}>
                {t("cancel")}
              </button>
              <button className="btn btn-error" onClick={handleDelete}>
                {t("delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CasesList;
