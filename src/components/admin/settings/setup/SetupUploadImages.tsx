"use client";
import { useState } from "react";
import Image from "next/image";

const SetupUploadImages = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [selectedType, setSelectedType] = useState("about");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);

    if (selectedFile) {
      const objectURL = URL.createObjectURL(selectedFile);
      setPreview(objectURL);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", selectedType);

    const res = await fetch("/admin/settings/uploads", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: "Bearer SECRET_ADMIN_KEY",
      },
    });

    const data = await res.json();
    if (res.ok) {
      console.log("Upload successful:", data);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setFile(null);
      setPreview(null);
    } else {
      console.error("Upload failed:", data);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const openModal = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const confirmUpload = () => {
    setIsModalOpen(false);
    handleUpload();
  };

  return (
    <div className="p-4 w-full">
      <h3 className="text-lg md:text-xl font-semibold ">Skift billede</h3>
      <div className="flex flex-col md:flex-row items-center md:justify-between lg:justify-start w-full gap-10 ">
        <div className="md:flex-1 flex flex-col gap-3 items-start w-full">
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Vælg billede type</span>
            </div>
            <select
              className="select select-bordered w-full max-w-xs"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="hero">Intro (startside)</option>
              <option value="about">Om os (startside)</option>
            </select>
          </label>
          <label className="form-control w-full max-w-xs">
            <input
              type="file"
              className="file-input file-input-bordered w-full max-w-xs"
              onChange={handleFileChange}
            />
          </label>
          <button
            onClick={openModal}
            className="btn btn-primary"
            disabled={!file}
          >
            Upload
          </button>
        </div>
        <div className="md:flex-1">
          {preview && (
            <div className="relative w-64 h-36 overflow-hidden rounded-md border">
              <Image
                src={preview}
                alt="Preview"
                layout="fill"
                objectFit="cover"
              />
            </div>
          )}
        </div>
      </div>
      {showToast && (
        <div className="toast bottom-20 md:bottom-0 toast-end">
          <div className="alert alert-success text-neutral-content">
            <span>Fil uploadet!</span>
          </div>
        </div>
      )}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Bekræft upload</h3>
            <p className="py-4">
              Er du sikker på, at du vil uploade dette billede?
            </p>
            <p className="text-sm text-secondary font-bold">
              Advarsel: Det gamle billede kan ikke genskabes
            </p>
            <div className="modal-action">
              <button className="btn" onClick={closeModal}>
                Annuller
              </button>
              <button className="btn btn-primary" onClick={confirmUpload}>
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SetupUploadImages;
