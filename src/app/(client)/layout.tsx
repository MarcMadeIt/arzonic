"use client";

import Header from "@/components/client/layout/Header";
import { FaAngleUp } from "react-icons/fa6";
import { useEffect, useState } from "react";
import Script from "next/script";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Script
        async
        defer
        src="https://stats.hhservice.dk/script.js"
        data-website-id="92b19d71-7695-4a2a-bf87-2ab08ec7cf04"
      />
      <div className="sm:h-lvh h-dvh max-w-screen-2xl mx-auto 2xl:px-3">
        <header>
          <Header />
        </header>
        <main>{children}</main>
        <footer></footer>

        {showScroll && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-16 right-4 p-3 bg-secondary text-white rounded-full shadow-lg z-50 block md:hidden"
          >
            <FaAngleUp />
          </button>
        )}
      </div>
    </>
  );
}
