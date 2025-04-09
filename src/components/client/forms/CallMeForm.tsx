"use client";

import React, { useState } from "react";
import emailjs from "emailjs-com";
import { createRequest } from "@/lib/client/actions";
import TaskSelect from "./TaskSelect";
import ConsentModal from "../modal/ConsentModal";

const CallMeForm = () => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validatePhoneNumber = (phoneNumber: string) => {
    const danishPhoneRegex = /^(?:\+45\d{8}|\d{8})$/;
    return danishPhoneRegex.test(phoneNumber);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validatePhoneNumber(mobile)) {
      setMessage("Ugyldigt telefonnummer");
      return;
    }

    if (!isChecked) {
      setMessage("Du skal acceptere opbevaring af dine oplysninger.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      // 1. Gem kundehenvendelsen i databasen
      await createRequest(name, mobile, "", category, isChecked, "");

      // 2. Send e-mail til virksomheden via EmailJS
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: name,
        },
        publicKey
      );

      setIsSuccess(true);
      setMessage("Henvendelsen er sendt.");
    } catch (error) {
      console.error("Failed to send email:", error);
      setMessage("Noget gik galt. Prøv igen senere.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setMessage("");
    setName("");
    setMobile("");
    setCategory("");
    setIsChecked(false);
  };

  return (
    <div>
      {isSuccess ? (
        <div className="flex flex-col gap-4 bg-base-100 p-8 md:p-10">
          <h2 className="text-xl font-bold">Tak for din henvendelse!</h2>
          <p>Vi vender tilbage til dig hurtigst muligt.</p>
          <button onClick={handleClose} className="btn btn-primary mt-5">
            Luk
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 bg-base-100 p-8 md:p-10 rounded-lg  relative"
        >
          <h2 className="text-2xl font-bold">Bliv ringet op</h2>
          <TaskSelect
            onChange={(value) => setCategory(value)}
            isCallForm={true}
          />
          <label htmlFor="name" className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text md:text-base">Navn</span>
            </div>
            <input
              id="name"
              name="name"
              autoComplete="name"
              type="text"
              placeholder="Skriv dit navn"
              className="input input-bordered input-md md:input-lg w-full max-w-xs"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label htmlFor="phone" className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text md:text-base">Mobilnummer</span>
            </div>
            <input
              autoComplete="tel"
              id="phone"
              type="tel"
              placeholder="Skriv dit mobilnummer"
              className="input input-bordered input-md md:input-lg w-full"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
          </label>
          <div className="flex items-center justify-start gap-3">
            <label className="cursor-pointer flex items-center justify-start gap-3">
              <input
                type="checkbox"
                className="checkbox checkbox-md md:checkbox-lg checkbox-primary"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                required
              />
            </label>
            <span className="label-text text-xs md:text-sm max-w-60">
              Jeg giver samtykke til opbevaring af mine oplysninger. &nbsp;
              <ConsentModal buttonText="Læs mere" variant="primary" />
            </span>
          </div>
          <div className="absolute bottom-28">
            {message && (
              <p className={`text-${isSuccess ? "green" : "red"}-500`}>
                {message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="btn btn-primary mt-10"
            disabled={isLoading}
          >
            {isLoading ? "Sender..." : "Bliv kontaktet"}
          </button>
        </form>
      )}
    </div>
  );
};

export default CallMeForm;
