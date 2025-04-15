import Hero from "@/components/client/home/Hero";
import Prices from "@/components/client/home/Prices";
import React from "react";

const Home = () => {
  return (
    <>
      <section className="h-[700px]">
        <Hero />
      </section>

      <section className="h-[700px]">
        <Prices />
      </section>
    </>
  );
};

export default Home;
