"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaComment, FaGear, FaHouse, FaList } from "react-icons/fa6";
import { readUserSession } from "@/lib/auth/readUserSession";
import Image from "next/image";

const Navbar = () => {
  const pathname = usePathname();
  // const [role, setRole] = useState<string | null>(null);

  // useEffect(() => {
  //   (async () => {
  //     const session = await readUserSession();
  //     if (session) {
  //       setRole(session.role);
  //     } else {
  //       setRole(null);
  //     }
  //   })();
  // }, []);

  return (
    <div className="flex flex-col items-center justify-between  bg-base-100 rounded-lg sm:fixed sm:h-full md:py-0 md:pr-0">
      <div className="flex flex-col sm:gap-5 h-full ">
        <div className="flex flex-col items-center justify-center h-32 w-full text-xl">
          <Image src="/logo-arzonic.png" alt="" width={80} height={80} />
          <span className="font-bold">ADMIN</span>
        </div>
        <div className="hidden sm:flex">
          <ul className="menu menu-lg gap-2 rounded-box w-56 xl:w-72">
            <li>
              <Link
                className={pathname === "/admin" ? "active" : ""}
                href="/admin"
              >
                Overblik
              </Link>
            </li>
            <li>
              <Link
                className={pathname === "/admin/content" ? "active" : ""}
                href="/admin/content"
              >
                Indhold
              </Link>
            </li>
            <li>
              <Link
                className={pathname === "/admin/messages" ? "active" : ""}
                href="/admin/messages"
              >
                Henvendelser
              </Link>
            </li>
            {/* {role === "admin" && ( */}
            <li>
              <Link
                className={pathname === "/admin/settings" ? "active" : ""}
                href="/admin/settings"
              >
                Indstillinger
              </Link>
            </li>
            {/* )} */}
          </ul>
        </div>
        <div className="flex flex-col items-center sm:hidden fixed bottom-5 left-1/2 transform -translate-x-1/2 justify-center z-30 max-w-[300px] w-full">
          <ul className="menu menu-horizontal bg-base-200 rounded-box flex-wrap justify-center max-w-md w-full gap-4">
            <li>
              <Link
                href="/admin"
                className={pathname === "/admin" ? "active" : ""}
              >
                <FaHouse size={25} />
              </Link>
            </li>
            <li>
              <Link
                href="/admin/content"
                className={pathname === "/admin/content" ? "active" : ""}
              >
                <FaList size={25} />
              </Link>
            </li>
            <li>
              <Link
                href="/admin/messages"
                className={pathname === "/admin/messages" ? "active" : ""}
              >
                <FaComment size={25} />
              </Link>
            </li>
            {/* {role === "admin" && ( */}
            <li>
              <Link
                href="/admin/settings"
                className={pathname === "/admin/settings" ? "active" : ""}
              >
                <FaGear size={25} />
              </Link>
            </li>
            {/* )} */}
          </ul>
        </div>
      </div>
      <span className="text-[11px] items-center justify-center p-4 hidden sm:flex">
        © 2025 Crafted by Marccode
      </span>
    </div>
  );
};

export default Navbar;
