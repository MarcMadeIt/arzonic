import React, { useState, useEffect } from "react";
import { updateCase, getCaseById } from "@/lib/server/actions";
import Image from "next/image";

const UpdateCase = ({
  newsId,
  onNewsUpdated,
}: {
  newsId: number;
  onNewsUpdated: () => void;
}) => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [city, setCity] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imageBefore, setImageBefore] = useState<File | null>(null);
  const [imageAfter, setImageAfter] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [existingImageBefore, setExistingImageBefore] = useState<string | null>(
    null
  );
  const [existingImageAfter, setExistingImageAfter] = useState<string | null>(
    null
  );
  const [errors, setErrors] = useState({
    title: "",
    desc: "",
    city: "",
    image: "",
    imageBefore: "",
    imageAfter: "",
    created_at: "", // Add created_at to errors object
  });
  const [loading, setLoading] = useState(false);
  const [formType, setFormType] = useState<"normal" | "beforeAfter">("normal");
  const [showToast, setShowToast] = useState(false);
  const [createdAt, setCreatedAt] = useState<string>("");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const news = await getCaseById(newsId);
        if (!news) {
          console.error("News not found");
          return;
        }
        setTitle(news.title || "");
        setDesc(news.desc || "");
        setCity(news.city || "");
        setFormType(news.formType || "normal");
        setExistingImage(news.image || null);
        setExistingImageBefore(news.imageBefore || null);
        setExistingImageAfter(news.imageAfter || null);
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
  }, [newsId]);

  const handleUpdateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!title || !desc || !city) {
      setErrors({
        title: !title ? "Titel er påkrævet" : "",
        desc: !desc ? "Beskrivelse er påkrævet" : "",
        city: !city ? "By er påkrævet" : "",
        image: "",
        imageBefore: "",
        imageAfter: "",
        created_at: "",
      });
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("newsId", newsId.toString());
      formData.append("title", title);
      formData.append("desc", desc);
      formData.append("city", city);
      formData.append("formType", formType);
      formData.append("createdAt", createdAt);

      if (image) formData.append("image", image);
      if (imageBefore) formData.append("imageBefore", imageBefore);
      if (imageAfter) formData.append("imageAfter", imageAfter);

      await updateCase(
        newsId,
        title,
        desc,
        city,
        formType,
        image || undefined,
        imageBefore || undefined,
        imageAfter || undefined,
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
      <span className="text-lg font-bold">Opdater nyhed</span>
      <div className="flex gap-5">
        <div className="form-control">
          <label className="label cursor-pointer flex items-center gap-2">
            <input
              type="radio"
              name="formType"
              className="radio radio-primary radio-sm"
              checked={formType === "normal"}
              onChange={() => setFormType("normal")}
            />
            <span className="label-text">Almindelig nyhed</span>
          </label>
        </div>
        <div className="form-control">
          <label className="label cursor-pointer flex items-center gap-2">
            <input
              type="radio"
              name="formType"
              className="radio radio-primary radio-sm"
              checked={formType === "beforeAfter"}
              onChange={() => setFormType("beforeAfter")}
            />
            <span className="label-text">Før/Efter</span>
          </label>
        </div>
      </div>

      <form
        onSubmit={handleUpdateNews}
        className="flex flex-col items-start gap-5 w-full"
      >
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-14 w-full">
          <div className="flex flex-col gap-5 items-center">
            <div className="flex flex-col gap-2 relative w-full">
              <label className="form-control">
                <div className="label">
                  <span className="label-text">Titel</span>
                </div>
                <input
                  name="title"
                  type="text"
                  className="input input-bordered input-md"
                  placeholder="Skriv en nyhedstitel..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </label>
              {errors.title && (
                <span className="absolute -bottom-4 text-xs text-red-500">
                  {errors.title}
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
                  placeholder="Skriv en mindre nyhedsartikel..."
                  style={{ resize: "none" }}
                  cols={30}
                  rows={8}
                ></textarea>
                <div className="text-right text-xs font-medium text-gray-500">
                  {desc.length} / 250
                </div>
              </label>
              {errors.desc && (
                <span className="absolute -bottom-4 text-xs text-red-500">
                  {errors.desc}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2 relative w-full">
              <label className="form-control">
                <div className="label">
                  <span className="label-text">By/Område</span>
                </div>
                <input
                  name="city"
                  type="text"
                  className="input input-bordered input-md"
                  placeholder="Skriv by eller område..."
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
                  <span className="label-text">Oprettelsesdato</span>
                </div>
                <input
                  name="createdAt"
                  type="date"
                  className="input input-bordered input-md"
                  value={createdAt}
                  onChange={(e) => setCreatedAt(e.target.value)}
                  required
                />
              </label>
              {errors.created_at && (
                <span className="absolute -bottom-4 text-xs text-red-500">
                  {errors.created_at}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-3 relative">
            {formType === "normal" && (
              <div className="flex flex-col gap-2 relative w-full">
                <label className="form-control">
                  <div className="label">
                    <span className="label-text">Opdater billede</span>
                  </div>
                  <input
                    name="image"
                    type="file"
                    className="file-input file-input-bordered file-input-md w-full"
                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                  />
                </label>
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
              </div>
            )}
            {formType === "beforeAfter" && (
              <>
                <div className="flex flex-col gap-2 relative w-full">
                  <label className="form-control">
                    <div className="label">
                      <span className="label-text">
                        Opdater &quot;før&quot; billede
                      </span>
                    </div>
                    <input
                      name="imageBefore"
                      type="file"
                      className="file-input file-input-bordered file-input-md w-full"
                      onChange={(e) =>
                        setImageBefore(e.target.files?.[0] || null)
                      }
                    />
                  </label>
                  {errors.imageBefore && (
                    <span className="absolute -bottom-4 text-xs text-red-500">
                      {errors.imageBefore}
                    </span>
                  )}
                  {existingImageBefore && !imageBefore && (
                    <div className="relative w-full overflow-hidden rounded-md h-0 pb-[56.25%]">
                      <Image
                        src={existingImageBefore}
                        alt="Existing Before"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2 relative w-full">
                  <label className="form-control">
                    <div className="label">
                      <span className="label-text">
                        Opdater &quot;efter&quot; billede
                      </span>
                    </div>
                    <input
                      name="imageAfter"
                      type="file"
                      className="file-input file-input-bordered file-input-md w-full"
                      onChange={(e) =>
                        setImageAfter(e.target.files?.[0] || null)
                      }
                    />
                  </label>
                  {errors.imageAfter && (
                    <span className="absolute -bottom-4 text-xs text-red-500">
                      {errors.imageAfter}
                    </span>
                  )}
                  {existingImageAfter && !imageAfter && (
                    <div className="relative w-full overflow-hidden rounded-md h-0 pb-[56.25%]">
                      <Image
                        src={existingImageAfter}
                        alt="Existing After"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-primary mt-2"
          disabled={loading}
        >
          {loading ? "Opdaterer" : "Opdater nyhed"}
        </button>
      </form>
      {showToast && (
        <div className="toast bottom-20 md:bottom-0 toast-end">
          <div className="alert alert-success text-neutral-content">
            <span className="text-base md:text-lg">Nyhed opdateret</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateCase;
