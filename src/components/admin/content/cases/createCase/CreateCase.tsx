import React, { useState } from "react";
import { createCase } from "@/lib/server/actions";

const CreateCase = ({ onCaseCreated }: { onCaseCreated: () => void }) => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [city, setCity] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imageBefore, setImageBefore] = useState<File | null>(null);
  const [imageAfter, setImageAfter] = useState<File | null>(null);
  const [errors, setErrors] = useState({
    title: "",
    desc: "",
    city: "",
    image: "",
    imageBefore: "",
    imageAfter: "",
  });
  const [loading, setLoading] = useState(false);
  const [formType, setFormType] = useState<"normal" | "beforeAfter">("normal");

  const handleCreateCase = async (e: React.FormEvent) => {
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
      });
      setLoading(false);
      return;
    }

    try {
      await createCase(
        title,
        desc,
        city,
        formType,
        image || undefined,
        imageBefore || undefined,
        imageAfter || undefined
      );

      setTitle("");
      setDesc("");
      setCity("");
      setImage(null);
      setImageBefore(null);
      setImageAfter(null);
      onCaseCreated();
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
      <span className="text-lg font-bold">Opret nyhed</span>
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
        onSubmit={handleCreateCase}
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
          </div>
          <div className="flex flex-col gap-3 relative">
            <div className="flex flex-col gap-2 relative w-full">
              <label className="form-control">
                <div className="label">
                  <span className="label-text">By/Område</span>
                </div>
                <input
                  name="city"
                  type="text"
                  className="input input-bordered input-md"
                  placeholder="Skriv en nyhedstitel..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </label>
              {errors.title && (
                <span className="absolute -bottom-4 text-xs text-red-500">
                  {errors.title}
                </span>
              )}
            </div>

            {formType === "normal" && (
              <div className="flex flex-col gap-2 relative w-full">
                <label className="form-control">
                  <div className="label">
                    <span className="label-text">Vælg billede</span>
                  </div>
                  <input
                    name="image"
                    type="file"
                    className="file-input file-input-bordered file-input-md w-full"
                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                    required
                  />
                </label>
                {errors.image && (
                  <span className="absolute -bottom-4 text-xs text-red-500">
                    {errors.image}
                  </span>
                )}
              </div>
            )}
            {formType === "beforeAfter" && (
              <>
                <div className="flex flex-col gap-2 relative w-full">
                  <label className="form-control">
                    <div className="label">
                      <span className="label-text">
                        Vælg &quot;før&quot; billede
                      </span>
                    </div>
                    <input
                      name="imageBefore"
                      type="file"
                      className="file-input file-input-bordered file-input-md w-full"
                      onChange={(e) =>
                        setImageBefore(e.target.files?.[0] || null)
                      }
                      required
                    />
                  </label>
                  {errors.imageBefore && (
                    <span className="absolute -bottom-4 text-xs text-red-500">
                      {errors.imageBefore}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-2 relative w-full">
                  <label className="form-control">
                    <div className="label">
                      <span className="label-text">
                        Vælg &quot;efter&quot; billede
                      </span>
                    </div>
                    <input
                      name="imageAfter"
                      type="file"
                      className="file-input file-input-bordered file-input-md w-full"
                      onChange={(e) =>
                        setImageAfter(e.target.files?.[0] || null)
                      }
                      required
                    />
                  </label>
                  {errors.imageAfter && (
                    <span className="absolute -bottom-4 text-xs text-red-500">
                      {errors.imageAfter}
                    </span>
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
          {loading ? "Opretter" : "Opret nyhed"}
        </button>
      </form>
    </div>
  );
};

export default CreateCase;
