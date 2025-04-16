import React, { useState } from "react";
import { createCase } from "@/lib/server/actions";
import { useTranslation } from "react-i18next";

const CreateCase = ({ onCaseCreated }: { onCaseCreated: () => void }) => {
  const { t } = useTranslation();
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
        company_name: !company_name ? t("company_name_required") : "",
        desc: !desc ? t("desc_required") : "",
        city: !city ? t("city_required") : "",
        country: !country ? t("country_required") : "",
        image: "",
        contact_person: !contact_person ? t("contact_person_required") : "",
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
      <span className="text-lg font-bold">{t("case_creation")}</span>
      <form
        onSubmit={handleCreateCase}
        className="flex flex-col items-start gap-5 w-full"
      >
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-14 w-full">
          <div className="flex flex-col gap-5 items-center">
            <fieldset className="flex flex-col gap-2 relative w-full fieldset">
              <legend className="fieldset-legend">{t("company_name")}</legend>
              <input
                name="title"
                type="text"
                className="input input-bordered input-md"
                placeholder={t("write_company_name")}
                value={company_name}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
              {errors.company_name && (
                <span className="absolute -bottom-4 text-xs text-red-500">
                  {errors.company_name}
                </span>
              )}
            </fieldset>

            <fieldset className="flex flex-col gap-2 relative w-full fieldset">
              <legend className="fieldset-legend">{t("contact_person")}</legend>
              <input
                name="contact_person"
                type="text"
                className="input input-bordered input-md"
                placeholder={t("write_contact_person")}
                value={contact_person}
                onChange={(e) => setContactPerson(e.target.value)}
                required
              />
              {errors.contact_person && (
                <span className="absolute -bottom-4 text-xs text-red-500">
                  {errors.contact_person}
                </span>
              )}
            </fieldset>

            <fieldset className="flex flex-col gap-2 relative w-full fieldset">
              <legend className="fieldset-legend">{t("desc")}</legend>
              <textarea
                name="desc"
                className="textarea textarea-bordered textarea-md text"
                value={desc}
                onChange={handleDescChange}
                required
                placeholder={t("write_desc")}
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
          </div>
          <div className="flex flex-col gap-3 relative">
            <fieldset className="flex flex-col gap-2 relative w-full fieldset">
              <legend className="fieldset-legend">{t("city")}</legend>
              <input
                name="city"
                type="text"
                className="input input-bordered input-md"
                placeholder={t("write_city")}
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

            <fieldset className="flex flex-col gap-2 relative w-full fieldset">
              <legend className="fieldset-legend">{t("country")}</legend>
              <input
                name="country"
                type="text"
                className="input input-bordered input-md"
                placeholder={t("write_country")}
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              />
              {errors.country && (
                <span className="absolute -bottom-4 text-xs text-red-500">
                  {errors.country}
                </span>
              )}
            </fieldset>

            <fieldset className="flex flex-col gap-2 relative w-full fieldset">
              <legend className="fieldset-legend">{t("choose_images")}</legend>
              <input
                name="image"
                type="file"
                className="file-input file-input-bordered file-input-md w-full"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                required
              />
              {errors.image && (
                <span className="absolute -bottom-4 text-xs text-red-500">
                  {errors.image}
                </span>
              )}
            </fieldset>
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-primary mt-2"
          disabled={loading}
        >
          {loading ? t("creating") : t("create")}
        </button>
      </form>
    </div>
  );
};

export default CreateCase;
