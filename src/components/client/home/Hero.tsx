"use client";
import Image from "next/image";
import React from "react";
import dynamic from "next/dynamic";

const ThreeAnimation = dynamic(() => import("../../animation/threeAnimation"), {
  ssr: false,
});

const Hero = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div className="relative z-10 flex lg:flex-row flex-col items-center justify-between h-full pt-10 px-6">
        <div className="flex-1 flex flex-col gap-5">
          <div className="flex gap-3 items-center">
            <div className="flex relative">
              <Image src="/danmark.png" alt="" width={50} height={50} />
            </div>
            <h1 className="text-xl sm:text-4xl text-white">
              MODERN WEB AGENCY
            </h1>
          </div>
          <div>
            <p className="text-sm sm:text-base text-white">
              We specialize in building high-performance websites and immersive
              3D experiences using modern, custom-built technology — no
              templates, no WordPress.
            </p>
          </div>
          <div className="flex gap-2 text-sm sm:text-lg text-white">
            <span>Custom Websites</span>
            <span>3D Design</span>
            <span>Web Applications</span>
          </div>
          <div className="mt-5">
            <button className="btn btn-primary">See More</button>
          </div>
        </div>

        <div className="flex-1 w-full h-full">
          <ThreeAnimation />
        </div>
      </div>
    </div>
  );
};

export default Hero;
