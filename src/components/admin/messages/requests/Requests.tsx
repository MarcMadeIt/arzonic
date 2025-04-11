import React, { useState, useEffect } from "react";
import RequestsSearch from "./RequestsSearch";
import RequestsList, { Request } from "./RequestsList";
import RequestsDetails from "./RequestsDetails";
import { FaAngleLeft } from "react-icons/fa6";
import RequestsPagination from "./RequestsPagination";
import {
  getAllRequests,
  deleteRequest,
  updateRequest,
} from "@/lib/server/actions";

const Requests = () => {
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(
    null
  );
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequests, setSelectedRequests] = useState<number[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleDetailsClick = (requestId: number) => {
    setSelectedRequestId(requestId);
  };

  const handleBackClick = () => {
    setSelectedRequestId(null);
    setIsEditing(false);
  };

  const handleDeleteSelected = async () => {
    try {
      setRequests((prevRequests) =>
        prevRequests.filter((request) => !selectedRequests.includes(request.id))
      );
      setSelectedRequests([]);
      await Promise.all(
        selectedRequests.map((id) => deleteRequest(id.toString()))
      );
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error("Failed to delete selected requests:", error);
    }
  };

  const handleCheckboxChange = (requestId: number) => {
    setSelectedRequests((prevSelected) =>
      prevSelected.includes(requestId)
        ? prevSelected.filter((id) => id !== requestId)
        : [...prevSelected, requestId]
    );
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const { requests, total } = await getAllRequests(page);
        setRequests(requests);
        setTotal(total);
      } catch (error) {
        console.error("Failed to fetch requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [page]);

  const filteredRequests = requests.filter(
    (request) =>
      request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.mobile.toString().includes(searchTerm)
  );

  const selectedRequest = requests.find(
    (request) => request.id === selectedRequestId
  );

  const handleUpdateRequest = async (
    requestId: string,
    data: Partial<Request>
  ) => {
    try {
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === parseInt(requestId) ? { ...request, ...data } : request
        )
      );
      await updateRequest(requestId, data);
    } catch (error) {
      console.error("Failed to update request:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {selectedRequest ? (
        <div className="flex flex-col items-start gap-5">
          {!isEditing && (
            <div className="flex items-start gap-5">
              <button onClick={handleBackClick} className="btn btn-ghost">
                <FaAngleLeft />
                Tilbage
              </button>
            </div>
          )}
          <RequestsDetails
            name={selectedRequest.name}
            category={selectedRequest.category}
            created_at={selectedRequest.created_at}
            mobile={selectedRequest.mobile}
            mail={selectedRequest.mail}
            city={selectedRequest.city}
            address={selectedRequest.address}
            message={selectedRequest.message}
            consent={selectedRequest.consent}
            requestId={selectedRequest.id.toString()}
            setIsEditing={setIsEditing}
            onUpdateRequest={handleUpdateRequest}
          />
        </div>
      ) : (
        <>
          <RequestsSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedRequests={selectedRequests}
            onDeleteSelected={handleDeleteSelected}
          />
          {loading ? (
            <div className="flex justify-center gap-3 items-center">
              <span className="loading loading-spinner loading-md"></span>
              Indhenter data...
            </div>
          ) : (
            <>
              <RequestsList
                requests={filteredRequests}
                searchTerm={searchTerm}
                onDetailsClick={handleDetailsClick}
                selectedRequests={selectedRequests}
                setSelectedRequests={setSelectedRequests}
                handleCheckboxChange={handleCheckboxChange}
              />
              <div className="flex w-full justify-center">
                <RequestsPagination
                  page={page}
                  setPage={setPage}
                  total={total}
                />
              </div>
            </>
          )}
        </>
      )}
      {showToast && (
        <div className="toast bottom-20 md:bottom-0 toast-end">
          <div className="alert alert-success text-neutral-content">
            <span className="text-base md:text-lg">Henvendelse slettet</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Requests;
