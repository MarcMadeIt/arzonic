import React, { useState, useEffect } from "react";
import { format, differenceInDays, addDays } from "date-fns";
import { da } from "date-fns/locale";
import RequestNote from "./createNote/RequestNote";
import {
  FaCircleCheck,
  FaCircleXmark,
  FaLocationArrow,
  FaPhoneVolume,
} from "react-icons/fa6";
import RequestsActions from "./RequestsActions";
import UpdateRequest from "./updateRequest/UpdateRequest";
import { Request } from "./RequestsList";

interface RequestsDetailsProps {
  name: string;
  category: string;
  created_at: string;
  mobile: string;
  mail: string;
  address: string;
  city: string;
  message: string;
  consent: boolean;
  requestId: string;
  setIsEditing: (isEditing: boolean) => void;
  onUpdateRequest: (requestId: string, data: Partial<Request>) => void;
}

const RequestsDetails = ({
  name,
  category,
  created_at,
  mobile,
  mail,
  address,
  city,
  message,
  consent,
  requestId,
  setIsEditing,
  onUpdateRequest,
}: RequestsDetailsProps) => {
  console.log("Message prop:", message); // Add this line to log the message prop

  const [isEditing, setLocalIsEditing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [requestDetails, setRequestDetails] = useState({
    name,
    category,
    mobile,
    message,
    mail,
    address,
    city,
  });

  useEffect(() => {
    console.log("Request details message:", requestDetails.message); // Add this line to log the message in requestDetails
  }, [requestDetails]);

  const handleUpdateRequest = (requestId: string, data: Partial<Request>) => {
    setRequestDetails((prevDetails) => ({ ...prevDetails, ...data }));
    onUpdateRequest(requestId, data);

    setShowToast(true);
  };

  const handleDeleteSuccess = () => {
    // Handle the success of the delete action
    console.log("Request deleted successfully");
  };

  const endDate = created_at ? addDays(new Date(created_at), 30) : null;
  const daysLeft = endDate ? differenceInDays(endDate, new Date()) : null;

  const handleEditClick = () => {
    setLocalIsEditing(true);
    setIsEditing(true);
  };

  const handleBackClick = () => {
    setLocalIsEditing(false);
    setIsEditing(false);
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  if (isEditing) {
    return (
      <UpdateRequest
        requestId={requestId}
        onBackClick={handleBackClick}
        setShowToast={setShowToast}
        onUpdateRequest={handleUpdateRequest} // Use local handler
      />
    );
  }

  return (
    <div className="flex flex-col gap-10 w-full p-3 ">
      <h2 className="text-lg font-bold">Detaljer for henvendelse</h2>
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-5">
          <a
            href={`tel:+45${mobile}`}
            className={`btn btn-primary flex items-center gap-2 ${
              !mobile ? "btn-disabled" : ""
            }`}
          >
            <FaPhoneVolume /> Kontakt kunde
          </a>

          <div
            className="tooltip tooltip-bottom"
            data-tip={!requestDetails.address ? "Ingen adresse" : undefined}
          >
            <a
              href={`https://www.google.com/maps?q=${encodeURIComponent(
                requestDetails.address
              )}%20${encodeURIComponent(requestDetails.city)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-lg font-semibold btn btn-neutral ${
                !requestDetails.address ? "btn-disabled" : ""
              }`}
            >
              <span className="hidden md:block">Vis vej</span>
              <FaLocationArrow />
            </a>
          </div>
        </div>
        <RequestsActions
          requestId={requestId}
          onEditClick={handleEditClick}
          onDeleteSuccess={handleDeleteSuccess} // Add this line
        />
      </div>
      <div className="flex flex-col gap-10">
        <div className="flex flex-col md:flex-row gap-10 md:gap-0">
          <div className="flex flex-col gap-2 w-full md:w-1/2 2xl:w-1/3">
            <span className="text-sm font-medium text-gray-400">
              Antal dage tilbage
            </span>
            <span
              className={`text-lg font-bold ${
                daysLeft !== null
                  ? daysLeft > 20
                    ? ""
                    : daysLeft > 10
                    ? "text-warning"
                    : daysLeft > 0
                    ? "text-error"
                    : "text-gray-500"
                  : "text-gray-500"
              }`}
            >
              {daysLeft !== null
                ? daysLeft > 0
                  ? `${daysLeft} dage`
                  : "Tiden er udløbet"
                : "Ugyldigt antal dage"}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-400">
              Tidspunkt for henvendelse
            </span>
            <span className="text-lg font-semibold">
              {created_at
                ? format(new Date(created_at), "d. MMMM yyyy 'kl.' HH:mm", {
                    locale: da,
                  })
                : "Ugyldig dato"}
            </span>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-10 md:gap-0">
          <div className="flex flex-col gap-2 w-full md:w-1/2 2xl:w-1/3">
            <p className="text-sm font-medium text-gray-400">Kundenavn</p>
            <span className="text-lg font-semibold">{requestDetails.name}</span>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-gray-400">
              Opgave interesse
            </p>
            <span className="text-lg font-semibold">
              {requestDetails.category}
            </span>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-10 md:gap-0">
          <div className="flex flex-col gap-2 w-full md:w-1/2 2xl:w-1/3">
            <p className="text-sm font-medium text-gray-400">Mobil nr.</p>
            <span className="text-lg font-semibold">
              {requestDetails.mobile || "Ukendt"}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-gray-400">Mailadresse</p>
            <span className="text-lg font-semibold">
              {requestDetails.mail || "Ukendt"}
            </span>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-10 md:gap-0">
          <div className="flex flex-col gap-2 w-full md:w-1/2 2xl:w-1/3">
            <p className="text-sm font-medium text-gray-400">
              Adresse & husnr.
            </p>
            <span className="text-lg font-semibold">
              {requestDetails.address || "Ukendt"}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-gray-400">Postnr. & By</p>
            <span className="text-lg font-semibold">
              {requestDetails.city || "Ukendt"}
            </span>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-10 md:gap-0">
          <div className="flex flex-col gap-2 w-full md:w-1/2 2xl:w-1/3">
            <p className="text-sm font-medium text-gray-400">
              Status for samtykke
            </p>
            <div>
              {consent ? (
                <span className="text-lg font-semibold text-success flex items-center gap-2">
                  <FaCircleCheck /> Samtykke givet
                </span>
              ) : (
                <span className="text-lg font-semibold text-error flex items-center gap-2">
                  <FaCircleXmark /> Samtykke mangler
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2 md:w-1/2">
            <p className="text-sm font-medium text-gray-400">Besked</p>
            <div className="max-h-32 overflow-y-auto flex flex-col gap-5 width-full">
              <span className="text-base font-semibold">
                {requestDetails.message || "Ingen besked"}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div>
        <RequestNote requestId={requestId} />
      </div>
      {showToast && (
        <div className="toast bottom-20 md:bottom-0 toast-end">
          <div className="alert alert-success text-neutral-content">
            <span>Kundedetaljer opdateret</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestsDetails;
