import React, { useState, useEffect } from "react";
import { updateReview, getReviewById } from "@/lib/server/actions";
import CreateRating from "../createReview/CreateRating";

interface UpdateReviewProps {
  reviewId: number;
  onReviewUpdated: () => void;
}

const UpdateReview = ({ reviewId, onReviewUpdated }: UpdateReviewProps) => {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [desc, setDesc] = useState("");
  const [rate, setRate] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState({
    name: "",
    city: "",
    desc: "",
  });

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const review = await getReviewById(reviewId);
        setName(review.name);
        setCity(review.city);
        setDesc(review.desc);
        setRate(review.rate);
      } catch (error) {
        console.error("Failed to fetch review:", error);
      }
    };

    fetchReview();
  }, [reviewId]);

  const handleUpdateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!name || !desc || !city) {
      setErrors({
        name: !name ? "Navn er påkrævet" : "",
        city: !city ? "By er påkrævet" : "",
        desc: !desc ? "Beskrivelse er påkrævet" : "",
      });
      setLoading(false);
      return;
    }

    try {
      await updateReview(reviewId, name, city, desc, rate);
      onReviewUpdated();
    } catch (err) {
      console.error("Failed to update review:", err);
      setError("Failed to update review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 100) {
      setDesc(e.target.value);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full p-3">
      <span className="text-lg font-bold">Opdater anmeldelse</span>
      <form
        onSubmit={handleUpdateReview}
        className="flex flex-col items-start gap-5 w-full"
      >
        {error && <div className="alert alert-error">{error}</div>}
        <div className="form-control">
          <label className="label">Vurdering</label>
          <CreateRating rate={rate} setRate={(value) => setRate(value)} />
        </div>
        <div className="flex flex-col gap-2 relative w-full">
          <label className="form-control">
            <div className="label">
              <span className="label-text">Navn</span>
            </div>
            <input
              type="text"
              className="input input-bordered input-md"
              placeholder="Anmelderens navn"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          {errors.name && (
            <span className="absolute -bottom-4 text-xs text-red-500">
              {errors.name}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2 relative w-full">
          <label className="form-control">
            <div className="label">
              <span className="label-text">By</span>
            </div>
            <input
              type="text"
              className="input input-bordered input-md"
              placeholder="Anmelderens by"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </label>
          {errors.city && (
            <span className="absolute -bottom-4 text-xs text-red-500">
              {errors.city}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2 relative w-full">
          <label className="form-control">
            <div className="label">
              <span className="label-text">Beskrivelse</span>
            </div>
            <textarea
              name="desc"
              className="textarea textarea-bordered textarea-md text"
              value={desc}
              onChange={handleDescChange}
              required
              placeholder="Skriv en mindre anmeldelse..."
              style={{ resize: "none" }}
              cols={30}
              rows={8}
            ></textarea>
            <div className="text-right text-xs font-medium text-gray-500">
              {desc.length} / 100
            </div>
          </label>
          {errors.desc && (
            <span className="absolute -bottom-4 text-xs text-red-500">
              {errors.desc}
            </span>
          )}
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Opdaterer..." : "Opdater anmeldelse"}
        </button>
      </form>
    </div>
  );
};

export default UpdateReview;
