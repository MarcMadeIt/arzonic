import Image from "next/image";
import React from "react";

const Hero = () => {
  return (
    <div className="flex lg:flex-row flex-col-reverse items-center justify-between h-full px-10">
      <div className="flex-1 flex flex-col gap-5">
        <div className="flex gap-2 items-center">
          <div className=" flex relative h-auto">
            <Image
              src="/danmark.png"
              alt=""
              width={50}
              height={50}
              className="rounded-lg"
            />
          </div>
          <h1 className="text-4xl">MODERN WEB AGENCY</h1>
        </div>
        <div>
          <p>
            We specialize in building high-performance websites and immersive 3D
            experiences using modern, custom-built technology — no templates, no
            WordPress.
          </p>
        </div>
        <div className="flex gap-2">
          <span>Custom Websites</span>
          <span>3D Design</span>
          <span>Web Applications</span>
        </div>
        <div className="mt-5">
          <button className="btn btn-primary">See More</button>
        </div>
      </div>
      <div className="flex-1">{/* 3D element  */}</div>
    </div>
  );
};

export default Hero;
