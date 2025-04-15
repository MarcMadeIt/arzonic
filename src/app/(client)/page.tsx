import Hero from "@/components/client/home/Hero";
import Prices from "@/components/client/home/Prices";
import React from "react";

const Home = () => {
  return (
    <>
      <section className="h-[800px]">
        <Hero />
      </section>

      <section className="h-[800px]">
        <Prices />
      </section>
    </>
  );
};

export default Home;
