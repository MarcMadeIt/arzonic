"use client";

import React, { useState } from "react";
import emailjs from "emailjs-com";

import { createRequest } from "@/lib/client/actions";
import TaskSelect from "./TaskSelect";
import ConsentModal from "../modal/ConsentModal";

const OfferForm = () => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [mail, setMail] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [hasTyped, setHasTyped] = useState(false);
  const charLimit = 200;
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [successText, setSuccessText] = useState("");

  const validatePhoneNumber = (phoneNumber: string) => {
    const danishPhoneRegex = /^(?:\+45\d{8}|\d{8})$/;
    return danishPhoneRegex.test(phoneNumber);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validatePhoneNumber(mobile)) {
      setErrorText("Invalid phone number.");
      return;
    }

    if (!isChecked) {
      setErrorText("You must accept storage of your information.");
      return;
    }

    setIsLoading(true);
    setErrorText("");
    setSuccessText("");

    try {
      await createRequest(name, mobile, mail, category, isChecked, message);

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
      setSuccessText("Your request has been sent.");
    } catch (error) {
      console.error("Failed to send email:", error);
      setErrorText("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= charLimit) {
      setMessage(value);
      setCharCount(value.length);
      if (!hasTyped) {
        setHasTyped(true);
      }
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setSuccessText("");
    setErrorText("");
    setName("");
    setMail("");
    setMobile("");
    setCategory("");
    setMessage("");
    setIsChecked(false);
  };

  return (
    <div className="lg:max-w-2xl max-w-md w-full">
      {isSuccess ? (
        <div className="flex flex-col gap-4 bg-base-100 p-10 h-[600px]">
          <h2 className="text-xl font-bold">Thank you for your request!</h2>
          <p>We will get back to you as soon as possible.</p>
          <button onClick={handleClose} className="btn btn-primary mt-5">
            Close
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 bg-base-100 rounded-lg shadow-md p-8 md:p-10"
        >
          <h2 className="text-xl font-bold">Request a Quote</h2>
          <div className="flex flex-col lg:flex-row gap-3 lg:gap-10">
            <div className="flex-1 flex flex-col gap-3">
              <label htmlFor="name" className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text md:text-base">Name</span>
                </div>
                <input
                  id="name"
                  name="name"
                  autoComplete="name"
                  type="text"
                  placeholder="Enter your name"
                  className="input input-bordered w-full max-w-xs"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </label>
              <label htmlFor="mail" className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text md:text-base">Email Address</span>
                </div>
                <input
                  id="mail"
                  name="mail"
                  autoComplete="email"
                  type="email"
                  placeholder="Enter your email"
                  className="input input-bordered w-full max-w-xs"
                  value={mail}
                  onChange={(e) => setMail(e.target.value)}
                  required
                />
              </label>
              <label htmlFor="phone" className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text md:text-base">Phone Number</span>
                </div>
                <input
                  autoComplete="tel"
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  className="input input-bordered w-full"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                />
              </label>
            </div>
            <div className="flex-1 flex flex-col gap-3">
              <TaskSelect onChange={(value) => setCategory(value)} />
              <label
                htmlFor="message"
                className="form-control w-full max-w-xs relative"
              >
                <div className="label">
                  <span className="label-text md:text-base">Message</span>
                </div>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Describe your needs, preferred time, address, etc."
                  className="textarea textarea-bordered textarea-md text-base w-full max-w-xs resize-none"
                  rows={5}
                  value={message}
                  onChange={handleMessageChange}
                  maxLength={charLimit}
                />
                {hasTyped && (
                  <div className="text-right text-xs text-gray-500 absolute -bottom-5 right-0">
                    {charCount}/{charLimit}
                  </div>
                )}
              </label>
            </div>
          </div>
          <div className="flex items-center justify-start gap-3">
            <label className="cursor-pointer flex items-center justify-start gap-3">
              <input
                type="checkbox"
                className="checkbox checkbox-md checkbox-primary"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                required
              />
            </label>

            <span className="label-text text-xs max-w-60 ">
              I accept the storage of my information for up to 30 days&nbsp;
              <ConsentModal buttonText="Read more" variant="primary" />
            </span>
          </div>
          {errorText && <p className="text-error">{errorText}</p>}
          {successText && <p className="text-success">{successText}</p>}
          <div>
            <button
              type="submit"
              className="btn btn-primary mt-5"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Request"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default OfferForm;
