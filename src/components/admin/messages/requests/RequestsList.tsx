import React, { useState, useEffect } from "react";
import { FaAngleRight } from "react-icons/fa6";

export interface Request {
  id: number;
  name: string;
  category: string;
  created_at: string;
  mobile: string;
  mail: string;
  message: string;
  address: string;
  city: string;
  consent: boolean;
}

interface RequestsListProps {
  requests: Request[];
  searchTerm: string;
  onDetailsClick: (requestId: number) => void;
  selectedRequests: number[];
  setSelectedRequests: (selected: number[]) => void;
  handleCheckboxChange: (requestId: number) => void;
}

const RequestsList = ({
  requests,
  searchTerm,
  onDetailsClick,
  selectedRequests,
  setSelectedRequests,
  handleCheckboxChange,
}: RequestsListProps) => {
  const [localRequests, setLocalRequests] = useState<Request[]>(requests);

  useEffect(() => {
    setLocalRequests(
      requests.filter((request) => {
        const searchTermLower = searchTerm.toLowerCase();
        return (
          request.name?.toLowerCase().includes(searchTermLower) ||
          request.category?.toLowerCase().includes(searchTermLower) ||
          request.mobile?.toString().includes(searchTerm) ||
          request.address?.toLowerCase().includes(searchTermLower) ||
          request.city?.toLowerCase().includes(searchTermLower) ||
          request.mail?.toLowerCase().includes(searchTermLower)
        );
      })
    );
  }, [requests, searchTerm]);

  if (!localRequests.length) {
    return (
      <div className="h-52 flex items-center justify-center">
        Ingen henvendelser fundet
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="table md:table-md lg:table-lg">
        {/* head */}
        <thead>
          <tr>
            <th>
              <label>
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  onChange={(e) =>
                    setSelectedRequests(
                      e.target.checked ? localRequests.map((req) => req.id) : []
                    )
                  }
                  checked={selectedRequests.length === localRequests.length}
                />
              </label>
            </th>
            <th>Navn</th>
            <th className="hidden md:block">Opgave</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {localRequests.map((request) => (
            <tr key={request.id}>
              <th>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    checked={selectedRequests.includes(request.id)}
                    onChange={() => handleCheckboxChange(request.id)}
                  />
                </label>
              </th>
              <td
                onClick={() => onDetailsClick(request.id)}
                className="cursor-pointer"
              >
                <>
                  <div className="font-bold text-xs md:text-base">
                    {request.name}
                  </div>
                </>
              </td>
              <td
                className="hidden md:block cursor-pointer"
                onClick={() => onDetailsClick(request.id)}
              >
                {request.category}
                <br />
                <span className="badge badge-ghost badge-sm text-[10px] lg:badge-sm lg:text-sm">
                  {request.created_at
                    ? new Date(request.created_at).toLocaleDateString("da-DK")
                    : "Ugyldig dato"}
                </span>
              </td>
              <th className="">
                <button
                  className="btn btn-outline btn-primary btn-sm flex items-center"
                  onClick={() => onDetailsClick(request.id)}
                >
                  <span className="hidden lg:block">Detaljer</span>
                  <FaAngleRight />
                </button>
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RequestsList;
