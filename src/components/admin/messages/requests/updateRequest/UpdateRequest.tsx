import React, { useState, useEffect } from "react";
import { FaAngleLeft } from "react-icons/fa6";
import { updateRequest, getRequestById } from "@/lib/server/actions";
import { Request } from "../RequestsList";

interface UpdateRequestProps {
  requestId: string;
  onBackClick: () => void;
  setShowToast: (show: boolean) => void;
  onUpdateRequest: (requestId: string, data: Partial<Request>) => void;
}

const UpdateRequest = ({
  requestId,
  onBackClick,
  setShowToast,
  onUpdateRequest,
}: UpdateRequestProps) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [mobile, setMobile] = useState("");
  const [mail, setMail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    const fetchRequestData = async () => {
      try {
        const requestData = await getRequestById(requestId);
        if (requestData) {
          setName(requestData.name || "");
          setCategory(requestData.category || "");
          setMobile(requestData.mobile?.toString() || "");
          setMail(requestData.mail || "");
          setAddress(requestData.address || "");
          setCity(requestData.city || "");
        }
      } catch (error) {
        console.error("Failed to fetch request data:", error);
      }
    };

    fetchRequestData();
  }, [requestId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedData: Partial<Request> = {
      name,
      category,
      mobile,
      mail,
      address,
      city,
    };
    onUpdateRequest(requestId, updatedData); // Optimistic update
    setShowToast(true);
    onBackClick();
    try {
      await updateRequest(requestId, updatedData);
    } catch (error) {
      console.error("Failed to update request:", error);
    }
  };

  return (
    <div className="flex flex-col w-full gap-5">
      <div className="flex items-start">
        <button onClick={onBackClick} className="btn btn-ghost">
          <FaAngleLeft />
          Tilbage
        </button>
      </div>
      <div className="flex flex-col gap-10 w-full p-3 ">
        <h2 className="text-lg font-bold">Opdater kundedetaljer</h2>
        <form className="flex flex-col gap-10 w-full" onSubmit={handleSubmit}>
          <div className="flex gap-10 flex-col md:flex-row">
            <div className="w-full md:w-1/3">
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Navn</span>
                </div>
                <input
                  type="text"
                  placeholder="Tilføj navn"
                  className="input input-bordered"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
            </div>
            <div className="w-full md:w-1/3">
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Valg af opgave</span>
                </div>
                <select
                  className="select select-bordered"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="" disabled>
                    Vælg opgave
                  </option>
                  <option value="Græsslåning">Græsslåning</option>
                  <option value="Hækkeklipning">Hækkeklipning</option>
                  <option value="Plantning">Plantning</option>
                  <option value="Specialopgaver">Specialopgaver</option>
                  <option value="Andet">Andet</option>
                </select>
              </label>
            </div>
          </div>
          <div className="flex gap-10 flex-col md:flex-row">
            <div className="w-full md:w-1/3">
              <label className="form-control max-w-xs">
                <div className="label">
                  <span className="label-text">Mobil nr.</span>
                </div>
                <input
                  type="text"
                  placeholder="Tilføj mobil nr."
                  className="input input-bordered"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </label>
            </div>
            <div className="w-full md:w-1/3">
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Mailadresse</span>
                </div>
                <input
                  type="text"
                  placeholder="Tilføj mail"
                  className="input input-bordered"
                  value={mail}
                  onChange={(e) => setMail(e.target.value)}
                />
              </label>
            </div>
          </div>
          <div className="flex gap-10 flex-col md:flex-row">
            <div className="w-full md:w-1/3">
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Adresse & husnr.</span>
                </div>
                <input
                  type="text"
                  placeholder="Tilføj addresse"
                  className="input input-bordered"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </label>
            </div>
            <div className="w-full md:w-1/3">
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Postnr. & By</span>
                </div>
                <input
                  type="text"
                  placeholder="Tilføj by"
                  className="input input-bordered"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </label>
            </div>
          </div>
          <div className="flex items-center justify-start gap-3 mt-5">
            <button className="btn btn-primary" type="submit">
              Opdater kunde
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateRequest;
