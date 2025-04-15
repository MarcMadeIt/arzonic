import React, { useState } from "react";
import { createCase } from "@/lib/server/actions";

const CreateCase = ({ onCaseCreated }: { onCaseCreated: () => void }) => {
  const [company_name, setCompanyName] = useState("");
  const [desc, setDesc] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [contact_person, setContactPerson] = useState("");

  const [errors, setErrors] = useState({
    company_name: "",
    desc: "",
    city: "",
    country: "",
    image: "",
    contact_person: "",
  });
  const [loading, setLoading] = useState(false);

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!company_name || !desc || !city || !contact_person) {
      setErrors({
        company_name: !company_name ? "Titel er påkrævet" : "",
        desc: !desc ? "Beskrivelse er påkrævet" : "",
        city: !city ? "By er påkrævet" : "",
        country: !country ? "Land er påkrævet" : "",
        image: "",
        contact_person: !contact_person ? "Kontaktperson er påkrævet" : "",
      });
      setLoading(false);
      return;
    }

    try {
      await createCase({
        company_name,
        desc,
        city,
        country,
        contact_person,
        image,
      });

      setCompanyName("");
      setDesc("");
      setCity("");
      setCountry("");
      setContactPerson("");
      setImage(null);
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
      <span className="text-lg font-bold">Create Case</span>
      <form
        onSubmit={handleCreateCase}
        className="flex flex-col items-start gap-5 w-full"
      >
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-14 w-full">
          <div className="flex flex-col gap-5 items-center">
            <div className="flex flex-col gap-2 relative w-full">
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Company Name</legend>
                <input
                  name="title"
                  type="text"
                  className="input input-bordered input-md"
                  placeholder="Write the company name..."
                  value={company_name}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </fieldset>
              {errors.company_name && (
                <span className="absolute -bottom-4 text-xs text-red-500">
                  {errors.company_name}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2 relative w-full">
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Description</legend>
                <textarea
                  name="desc"
                  className="textarea textarea-bordered textarea-md text"
                  value={desc}
                  onChange={handleDescChange}
                  required
                  placeholder="Write a small description..."
                  style={{ resize: "none" }}
                  cols={30}
                  rows={8}
                ></textarea>
                <div className="text-right text-xs font-medium text-gray-500">
                  {desc.length} / 250
                </div>
              </fieldset>
              {errors.desc && (
                <span className="absolute -bottom-4 text-xs text-red-500">
                  {errors.desc}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2 relative w-full">
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Contact Person</legend>
                <input
                  name="contact_person"
                  type="text"
                  className="input input-bordered input-md"
                  placeholder="Write the contact person's name..."
                  value={contact_person}
                  onChange={(e) => setContactPerson(e.target.value)}
                  required
                />
              </fieldset>
              {errors.contact_person && (
                <span className="absolute -bottom-4 text-xs text-red-500">
                  {errors.contact_person}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-3 relative">
            <div className="flex flex-col gap-2 relative w-full">
              <fieldset className="fieldset">
                <legend className="fieldset-legend">City</legend>
                <input
                  name="city"
                  type="text"
                  className="input input-bordered input-md"
                  placeholder="Write the city..."
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
                <legend className="fieldset-legend">Country</legend>
                <input
                  name="city"
                  type="text"
                  className="input input-bordered input-md"
                  placeholder="Write the country..."
                  value={city}
                  onChange={(e) => setCountry(e.target.value)}
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
                <legend className="fieldset-legend">Choose images</legend>
                <input
                  name="image"
                  type="file"
                  className="file-input file-input-bordered file-input-md w-full"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                  required
                />
              </fieldset>
              {errors.image && (
                <span className="absolute -bottom-4 text-xs text-red-500">
                  {errors.image}
                </span>
              )}
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-primary mt-2"
          disabled={loading}
        >
          {loading ? "Creating" : "Create Case"}
        </button>
      </form>
    </div>
  );
};

export default CreateCase;
