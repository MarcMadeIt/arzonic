"use client";

import React, { useState } from "react";
import ReviewsList from "./ReviewsList";
import ReviewsListChange from "./ReviewsListChange";
import ReviewsPagination from "./ReviewsPagination";
import CreateReview from "./createReview/CreateReview";
import UpdateReview from "./updateReview/UpdateReview";
import { FaAngleLeft } from "react-icons/fa6";

const Reviews = () => {
  const [view, setView] = useState<"cards" | "list">("cards");
  const [showCreateReview, setShowCreateReview] = useState(false);
  const [showUpdateReview, setShowUpdateReview] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const handleViewChange = (view: "cards" | "list") => {
    setView(view);
  };

  const handleReviewCreated = () => {
    setShowCreateReview(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleReviewUpdated = () => {
    setShowUpdateReview(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="flex flex-col md:items-start gap-7">
      {showCreateReview ? (
        <div className="flex flex-col items-start gap-5">
          <button
            onClick={() => setShowCreateReview(false)}
            className="btn btn-ghost"
          >
            <FaAngleLeft />
            Tilbage
          </button>
          <CreateReview onReviewCreated={handleReviewCreated} />
        </div>
      ) : showUpdateReview && selectedReviewId !== null ? (
        <div className="flex flex-col items-start gap-5">
          <button
            onClick={() => setShowUpdateReview(false)}
            className="btn btn-ghost"
          >
            <FaAngleLeft />
            Tilbage
          </button>
          <UpdateReview
            reviewId={selectedReviewId}
            onReviewUpdated={handleReviewUpdated}
          />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center w-full">
            <button
              onClick={() => setShowCreateReview(true)}
              className="btn btn-primary"
            >
              Opret anmeldelse
            </button>
            <ReviewsListChange onViewChange={handleViewChange} />
          </div>
          <ReviewsList
            view={view}
            page={page}
            setTotal={setTotal}
            onEditReview={(reviewId: number) => {
              setSelectedReviewId(reviewId);
              setShowUpdateReview(true);
            }}
          />
          <div className="flex w-full justify-center">
            <ReviewsPagination page={page} setPage={setPage} total={total} />
          </div>
        </>
      )}
      {showToast && (
        <div className="toast toast-end">
          <div className="alert alert-success">
            <span className="text-base md:text-lg">
              {showCreateReview
                ? "Anmeldelse oprettet"
                : "Anmeldelse opdateret"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;
