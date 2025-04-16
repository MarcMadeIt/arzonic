"use client";

import Theme from "@/components/client/layout/Theme";
import { signOut } from "@/lib/server/actions";
import { usePathname } from "next/navigation";
import React from "react";
import { useTranslation } from "react-i18next";
import "@/i18n/config";
import { FaEllipsis } from "react-icons/fa6";

interface PageTitleMapping {
  [key: string]: string;
}

const Topbar = () => {
  const pathname = usePathname();
  const { t, i18n } = useTranslation();

  const pageTitles: PageTitleMapping = {
    "/admin": t("overview"),
    "/admin/content": t("content"),
    "/admin/messages": t("requests"),
    "/admin/settings": t("settings"),
  };

  const currentTitle = pageTitles[pathname] || t("unknown_page");

  return (
    <div className="navbar bg-base-200 shadow-sm w-full rounded-md pl-5 h-14 flex items-center justify-between">
      <div className="flex-1">
        <a className="text-lg md:text-xl font-semibold tracking-wide">
          {currentTitle}
        </a>
      </div>
      <div className="flex-none">
        <div className="dropdown dropdown-bottom dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-sm m-1">
            <FaEllipsis />
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow-lg ring-1 ring-black ring-opacity-5"
          >
            <li>
              <Theme />
            </li>
            <li>
              <button onClick={() => i18n.changeLanguage("da")}>
                {t("language")}: Dansk
              </button>
              <button onClick={() => i18n.changeLanguage("en")}>
                {t("language")}: English
              </button>
            </li>
            <li>
              <button onClick={signOut}>{t("logout")}</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
