import React, { useState } from "react";
import { createReview } from "@/lib/server/actions";
import CreateRating from "./CreateRating";
import { t } from "i18next";

interface CreateReviewProps {
  onReviewCreated: () => void;
}

const CreateReview = ({ onReviewCreated }: CreateReviewProps) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!name || !desc || !city) {
      setErrors({
        name: !name ? t("company_name_required") : "",
        city: !city ? t("city_required") : "",
        desc: !desc ? t("desc_required") : "",
      });
      setLoading(false);
      return;
    }

    try {
      await createReview(name, city, desc, rate);
      onReviewCreated();
    } catch {
      setError("Failed to create review. Please try again.");
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
      <span className="text-lg font-bold">{t("review_creation")}</span>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-start gap-5 w-full"
      >
        {error && <div className="alert alert-error">{error}</div>}
        <div className="form-control">
          <label className="label">Rating</label>
          <CreateRating rate={rate} setRate={(value) => setRate(value)} />
        </div>
        <div className="flex flex-col gap-2 relative w-full">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">{t("company_name")}</legend>
            <input
              type="text"
              className="input input-bordered input-md"
              placeholder="Reviewer name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </fieldset>
          {errors.name && (
            <span className="absolute -bottom-4 text-xs text-red-500">
              {errors.name}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2 relative w-full">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">{t("city")}</legend>
            <input
              type="text"
              className="input input-bordered input-md"
              placeholder="Reviewer company"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </fieldset>
          {errors.city && (
            <span className="absolute -bottom-4 text-xs text-red-500">
              {errors.city}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2 relative w-full">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">{t("description")}</legend>
            <textarea
              name="desc"
              className="textarea textarea-bordered textarea-md text"
              value={desc}
              onChange={handleDescChange}
              required
              placeholder={t("write_desc")}
              style={{ resize: "none" }}
              cols={30}
              rows={5}
            ></textarea>
            <div className="text-right text-xs font-medium text-gray-500">
              {desc.length} / 100
            </div>
          </fieldset>
          {errors.desc && (
            <span className="absolute -bottom-4 text-xs text-red-500">
              {errors.desc}
            </span>
          )}
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? t("creating") : t("create")}
        </button>
      </form>
    </div>
  );
};

export default CreateReview;
