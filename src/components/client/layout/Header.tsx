"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import Link from "next/link";

import { FaBars, FaFacebook, FaInstagram, FaXmark } from "react-icons/fa6";
import Theme from "./Theme";
import Image from "next/image";

const Header = () => {
  const pathname = usePathname();
  const detailsRef = useRef<HTMLDetailsElement>(null);

  const handleCloseDrawer = () => {
    const drawerCheckbox = document.getElementById(
      "my-drawer-4"
    ) as HTMLInputElement;
    if (drawerCheckbox) {
      drawerCheckbox.checked = false;
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      detailsRef.current &&
      !detailsRef.current.contains(event.target as Node)
    ) {
      detailsRef.current.open = false;
    }
  };

  useEffect(() => {
    handleCloseDrawer();
    if (detailsRef.current) {
      detailsRef.current.open = false;
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [pathname]);

  return (
    <div className="navbar bg-base-100 inset-x-0 z-50 max-w-[1536px] mx-auto p-2 md:p-4 flex justify-between items-center 2xl:rounded-b-lg">
      <div className="flex-1">
        <Link className="cursor-pointer pl-4 flex items-center gap-2" href="/">
          <Image src="/logo-arzonic.png" alt="" width={60} height={60} />
          <span className=" font-bold text-3xl tracking-wider">Arzonic</span>
        </Link>
      </div>
      <nav className="flex-none">
        <ul className="menu w-full md:menu-lg menu-horizontal font-bold md:font-medium gap-3 md:gap-5 items-center hidden md:flex">
          <li>
            <Link href="/solutions">Solutions</Link>
          </li>
          <li>
            <Link href="/cases">Cases</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="btn btn-outline text-base-content hover:btn-secondary"
            >
              Contact
            </Link>
          </li>
          <li>
            <Theme />
          </li>
        </ul>
        <div className="drawer drawer-end flex md:hidden">
          <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <label
              htmlFor="my-drawer-4"
              className="drawer-button btn btn-ghost"
            >
              <FaBars size={30} />
            </label>
          </div>
          <div className="drawer-side">
            <label
              htmlFor="my-drawer-4"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <ul className="menu menu-lg bg-base-100 text-base-content min-h-full w-96 p-4 pt-20 gap-2 items-center relative">
              <li className="absolute top-1 right-1">
                <label htmlFor="my-drawer-4">
                  <FaXmark size={30} />
                </label>
              </li>
              <li className="text-2xl font-bold">
                <Link href="/solutions" onClick={handleCloseDrawer}>
                  Solutions
                </Link>
              </li>
              <li className="text-2xl font-bold">
                <Link href="/cases" onClick={handleCloseDrawer}>
                  Cases
                </Link>
              </li>
              <li className="text-2xl font-bold">
                <Link href="/about" onClick={handleCloseDrawer}>
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="btn btn-primary text-neutral-content py-2 mt-4"
                  onClick={handleCloseDrawer}
                >
                  Contact
                </Link>
              </li>

              <div className="flex flex-col items-center gap-6 flex-1 justify-center w-full">
                <span className=" text-lg font-bold">Follow us</span>
                <div className="flex gap-6">
                  <Link
                    href="https://www.facebook.com/share/18mtAGts1w/?mibextid=wwXIfr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1"
                  >
                    <div className="w-14 h-14 shadow-lg rounded-full flex items-center justify-center">
                      <FaFacebook className="text-3xl text-secondary" />
                    </div>
                    <span className="text-secondary font-bold">Facebook</span>
                  </Link>
                  <Link
                    href="https://www.instagram.com/arzonic.agency/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1"
                  >
                    <div className="w-14 h-14 shadow-lg rounded-full flex items-center justify-center">
                      <FaInstagram className="text-3xl text-secondary" />
                    </div>
                    <span className="text-secondary font-bold">Instagram</span>
                  </Link>
                </div>
              </div>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
