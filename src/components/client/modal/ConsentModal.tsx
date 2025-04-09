"use client";
import React, { useState } from "react";

interface ConsentModalProps {
  buttonText: string;
  variant?: "primary" | "hover";
}

const ConsentModal = ({ buttonText, variant = "hover" }: ConsentModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Link to open modal */}
      <span
        className={`link ${
          variant === "primary" ? "link-primary" : "link-hover"
        }`}
        onClick={() => setIsOpen(true)}
      >
        {buttonText}
      </span>

      {/* Modal */}
      {isOpen && (
        <div className="modal modal-open fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal-box max-w-2xl p-6 bg-white rounded-lg shadow-lg">
            <h3 className="font-bold text-xl md:text-2xl py-2">
              Consent & Privacy Policy
            </h3>

            <div className="py-4 text-sm max-h-96 overflow-y-auto flex flex-col gap-5">
              <div>
                <h4 className="font-semibold md:text-base mb-2">
                  1. Collection and Processing of Personal Data
                </h4>
                <p>
                  When you fill out a form on our website to request a quote or
                  make contact, Halsnæs Haveservice collects and processes the
                  following information:
                </p>
                <ul className="list-disc pl-5 my-2">
                  <li>Name</li>
                  <li>Phone number</li>
                  <li>Email address</li>
                  <li>Any information you provide in the message field</li>
                </ul>
                <p>
                  This data is used solely to handle your inquiry, provide the
                  requested service, and follow up on your request.
                </p>
              </div>

              <div>
                <h4 className="font-semibold md:text-base mb-2">
                  2. Data Retention and Deletion
                </h4>
                <p>
                  We store your data securely and confidentially. Your
                  information will automatically be deleted after 30 days unless
                  a customer agreement is established, in which case the data
                  may be kept for a longer period.
                </p>
                <p>
                  If you wish to have your data deleted before the 30-day period
                  ends, you can contact us at{" "}
                  <strong>
                    <a href="mailto:hhs@hhservice.dk" target="_blank">
                      hhs@hhservice.dk
                    </a>
                  </strong>
                  , and we will delete it within a reasonable timeframe.
                </p>
              </div>

              <div>
                <h4 className="font-semibold md:text-base mb-2">
                  3. Disclosure of Information
                </h4>
                <p>
                  We <strong>do not</strong> share your information with third
                  parties unless it is necessary to fulfill your request (e.g.,
                  a subcontractor). In such cases, it will only happen with your
                  consent.
                </p>
              </div>

              <div>
                <h4 className="font-semibold md:text-base mb-2">
                  4. Your Rights
                </h4>
                <p>You have the right to:</p>
                <ul className="list-disc pl-5 my-2">
                  <li>Access the data we have registered about you</li>
                  <li>Correct any incorrect information</li>
                  <li>
                    Request deletion of your data (unless retention is required
                    by law)
                  </li>
                  <li>Withdraw your consent to the storage of your data</li>
                </ul>
                <p>
                  To exercise your rights, you can contact us at{" "}
                  <strong>
                    <a href="mailto:hhs@hhservice.dk" target="_blank">
                      hhs@hhservice.dk
                    </a>
                  </strong>
                  .
                </p>
              </div>

              <div>
                <h4 className="font-semibold md:text-base mb-2">5. Consent</h4>
                <p>
                  By submitting your information via our website, you give your
                  consent to us processing your data as described above.
                </p>
                <p>
                  You can withdraw your consent at any time by contacting us,
                  and we will delete your information unless there is a legal
                  basis for continued storage.
                </p>
              </div>

              <div>
                <h4 className="font-semibold md:text-base mb-2">
                  6. Data Security
                </h4>
                <p>
                  We protect your information through appropriate technical and
                  organizational security measures to prevent misuse or
                  unauthorized access.
                </p>
              </div>

              <div>
                <h4 className="font-semibold md:text-base mb-2">
                  7. Changes to Consent and Privacy Policy
                </h4>
                <p>
                  We reserve the right to update this consent and privacy
                  policy. The latest version will always be available on our
                  website.
                </p>
              </div>

              <p className="mt-2 text-xs">Last updated: February 5, 2025</p>
            </div>

            <div className="modal-action">
              <button
                className="btn btn-primary"
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConsentModal;
