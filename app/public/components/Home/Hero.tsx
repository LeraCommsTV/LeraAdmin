import React from "react";
import { Header } from "../Layout";

const Hero: React.FC = () => {
  return (
    <div className="hero relative text-white min-h-screen w-full flex flex-col justify-center md:px-20 px-8">
      <div className="">
        <Header active="" isHome />
      </div>
      <div className="md:w-[30%] w-[80%]">
        <h1 className="text-2xl font-bold leading-8 mb-4">
          Transforming Narratives, Elevating Impact
        </h1>
        <p className="font-thin text-xs font-mona">
          Empowering Your Brand with Strategic Communication and Innovative
          Media Solutions
        </p>
      </div>
    </div>
  );
};

export default Hero;
