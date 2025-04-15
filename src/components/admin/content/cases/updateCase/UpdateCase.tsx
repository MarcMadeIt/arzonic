import React, { useState, useEffect } from "react";
import { updateCase, getCaseById } from "@/lib/server/actions";
import Image from "next/image";

const UpdateCase = ({
  caseId,
  onNewsUpdated,
}: {
  caseId: number;
  onNewsUpdated: () => void;
}) => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [city, setCity] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const [existingImage, setExistingImage] = useState<string | null>(null);

  const [errors, setErrors] = useState({
    title: "",
    desc: "",
    city: "",
    image: "",
    created_at: "", // Add created_at to errors object
  });
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [createdAt, setCreatedAt] = useState<string>("");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const news = await getCaseById(caseId);
        if (!news) {
          console.error("News not found");
          return;
        }
        setTitle(news.title || "");
        setDesc(news.desc || "");
        setCity(news.city || "");
        setExistingImage(news.image || null);

        setCreatedAt(
          news.created_at
            ? new Date(news.created_at).toISOString().split("T")[0]
            : ""
        );
      } catch (error) {
        console.error("Failed to fetch news:", error);
      }
    };

    fetchNews();
  }, [caseId]);

  const handleUpdateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!title || !desc || !city) {
      setErrors({
        title: !title ? "Titel er påkrævet" : "",
        desc: !desc ? "Beskrivelse er påkrævet" : "",
        city: !city ? "By er påkrævet" : "",
        image: "",

        created_at: "",
      });
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("caseId", caseId.toString());
      formData.append("title", title);
      formData.append("desc", desc);
      formData.append("city", city);
      formData.append("createdAt", createdAt);

      if (image) formData.append("image", image);

      await updateCase(
        caseId,
        title,
        desc,
        city,
        image || undefined,
        createdAt
      );

      onNewsUpdated();
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          general: error.message,
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 250) {
      setDesc(e.target.value);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full p-3">
      <span className="text-lg font-bold">Update News</span>

      <form
        onSubmit={handleUpdateNews}
        className="flex flex-col items-start gap-5 w-full"
      >
        <fieldset className="flex flex-col lg:flex-row gap-5 lg:gap-14 w-full">
          <legend className="sr-only">News Details</legend>
          <div className="flex flex-col gap-5 items-center">
            <fieldset className="flex flex-col gap-2 relative w-full">
              <legend className="form-control">
                <div className="label">
                  <span className="label-text">Title</span>
                </div>
              </legend>
              <input
                name="title"
                type="text"
                className="input input-bordered input-md"
                placeholder="Enter a news title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              {errors.title && (
                <span className="absolute -bottom-4 text-xs text-red-500">
                  {errors.title}
                </span>
              )}
            </fieldset>
            <fieldset className="flex flex-col gap-2 relative w-full">
              <legend className="form-control">
                <div className="label">
                  <span className="label-text">Description</span>
                </div>
              </legend>
              <textarea
                name="desc"
                className="textarea textarea-bordered textarea-md text"
                value={desc}
                onChange={handleDescChange}
                required
                placeholder="Write a short news article..."
                style={{ resize: "none" }}
                cols={30}
                rows={8}
              ></textarea>
              <div className="text-right text-xs font-medium text-gray-500">
                {desc.length} / 250
              </div>
              {errors.desc && (
                <span className="absolute -bottom-4 text-xs text-red-500">
                  {errors.desc}
                </span>
              )}
            </fieldset>

            <fieldset className="flex flex-col gap-2 relative w-full">
              <legend className="form-control">
                <div className="label">
                  <span className="label-text">City/Area</span>
                </div>
              </legend>
              <input
                name="city"
                type="text"
                className="input input-bordered input-md"
                placeholder="Enter city or area..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
              {errors.city && (
                <span className="absolute -bottom-4 text-xs text-red-500">
                  {errors.city}
                </span>
              )}
            </fieldset>
            <fieldset className="flex flex-col gap-2 relative w-full">
              <legend className="form-control">
                <div className="label">
                  <span className="label-text">Creation Date</span>
                </div>
              </legend>
              <input
                name="createdAt"
                type="date"
                className="input input-bordered input-md"
                value={createdAt}
                onChange={(e) => setCreatedAt(e.target.value)}
                required
              />
              {errors.created_at && (
                <span className="absolute -bottom-4 text-xs text-red-500">
                  {errors.created_at}
                </span>
              )}
            </fieldset>
          </div>
          <div className="flex flex-col gap-3 relative">
            <fieldset className="flex flex-col gap-2 relative w-full">
              <legend className="form-control">
                <div className="label">
                  <span className="label-text">Update Image</span>
                </div>
              </legend>
              <input
                name="image"
                type="file"
                className="file-input file-input-bordered file-input-md w-full"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
              />
              {errors.image && (
                <span className="absolute -bottom-4 text-xs text-red-500">
                  {errors.image}
                </span>
              )}
              {existingImage && !image && (
                <div className="relative w-full overflow-hidden rounded-md h-0 pb-[56.25%]">
                  <Image
                    src={existingImage}
                    alt="Existing"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              )}
            </fieldset>
          </div>
        </fieldset>
        <button
          type="submit"
          className="btn btn-primary mt-2"
          disabled={loading}
        >
          {loading ? "Updating" : "Update News"}
        </button>
      </form>
      {showToast && (
        <div className="toast bottom-20 md:bottom-0 toast-end">
          <div className="alert alert-success text-neutral-content">
            <span className="text-base md:text-lg">News updated</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateCase;
