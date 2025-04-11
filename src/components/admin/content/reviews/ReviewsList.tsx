import React, { useState, useEffect, useCallback } from "react";
import { FaLocationDot, FaPen, FaTrash } from "react-icons/fa6";
import { getAllReviews, deleteReview } from "@/lib/server/actions";
import ReviewsRating from "./ReviewsRating";

interface ReviewsListProps {
  view: "cards" | "list";
  page: number;
  setTotal: (total: number) => void;
  onEditReview: (reviewId: number) => void;
}

interface ReviewItem {
  id: number;
  name: string;
  city: string;
  desc: string;
  rate: number;
}

const ReviewsList = ({
  view,
  page,
  setTotal,
  onEditReview,
}: ReviewsListProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([]);
  const [deletingReviewId, setDeletingReviewId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const { reviews, total } = await getAllReviews(page);
      setReviewItems(reviews || []);
      setTotal(total);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  }, [page, setTotal]);

  const handleDelete = async () => {
    if (deletingReviewId !== null) {
      try {
        await deleteReview(deletingReviewId);
        setDeletingReviewId(null);
        setIsModalOpen(false);
        fetchReviews();
      } catch (error) {
        console.error("Failed to delete review:", error);
      }
    }
  };

  const closeModal = () => {
    setDeletingReviewId(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetchReviews();
  }, [page, setTotal, fetchReviews]);

  return (
    <div className="w-full">
      {loading ? (
        <div className="flex justify-center gap-3 items-center">
          <span className="loading loading-spinner loading-md"></span>
          Indhenter data...
        </div>
      ) : (
        <>
          {view === "cards" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {reviewItems.map((item) => (
                <div
                  key={item.id}
                  className="card card-compact shadow-lg rounded-md"
                >
                  <div className="card-body p-5">
                    <ReviewsRating rate={item.rate} />
                    <p className="text-sm">{item.desc}</p>
                    <h2 className="text-xs font-bold flex items-center gap-1">
                      {item.name}, {item.city} <FaLocationDot />
                    </h2>
                    <div className="card-actions justify-end">
                      <button
                        className="btn btn-sm"
                        onClick={() => onEditReview(item.id)}
                      >
                        <FaPen />
                        Rediger
                      </button>
                      <button
                        className="btn btn-sm"
                        onClick={() => {
                          setDeletingReviewId(item.id);
                          setIsModalOpen(true);
                        }}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {reviewItems.map((item) => (
                <React.Fragment key={item.id}>
                  <li>
                    <div className="flex gap-3 items-center">
                      <div className="flex gap-2 items-center flex-initial sm:flex-1 w-16 sm:w-auto truncate">
                        <h3 className="font-semibold text-xs hidden sm:block ">
                          {item.name}, {item.city}
                        </h3>
                        <h3 className="font-semibold text-xs block sm:hidden">
                          {item.name}
                        </h3>
                      </div>
                      <div className="flex-1">
                        <ReviewsRating rate={item.rate} />
                      </div>
                      <div className="flex gap-5 md:gap-2 flex-1 justify-end">
                        <button
                          className="btn btn-sm"
                          onClick={() => onEditReview(item.id)}
                        >
                          <FaPen />
                          <span className="md:flex hidden"> Rediger </span>
                        </button>
                        <button
                          className="btn btn-sm"
                          onClick={() => {
                            setDeletingReviewId(item.id);
                            setIsModalOpen(true);
                          }}
                        >
                          <FaTrash />
                          <span className="md:flex hidden"> Slet </span>
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
            <h3 className="font-bold text-lg">Bekræft sletning</h3>
            <p className="py-4">
              Er du sikker på, at du vil slette denne anmeldelse?
            </p>
            <div className="modal-action">
              <button className="btn" onClick={closeModal}>
                Annuller
              </button>
              <button className="btn btn-error" onClick={handleDelete}>
                Slet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsList;
