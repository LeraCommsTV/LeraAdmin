import React from "react";
import { aboutUsImg, WhoAreWeText } from "../../constant/imports";

const AboutUs: React.FC = () => {
  return (
    <section className="py-20 md:px-20 px-0 bg-white">
      {/* Inner Container */}
      <div className="w-full bg-[#F9FAFB] flex flex-col md:flex-row items-center justify-between p-8 md:p-8 rounded-2xl">
        {/* Text Section */}
        <div className="w-full md:w-[48%] space-y-4 mb-8">
          <img
            src={WhoAreWeText}
            alt="Strategic Communication"
            className="rounded-lg"
          />
          <h2 className="text-3xl font-medium text-primary">
            We are a Strategic Communication firm
          </h2>
          <p className="leading-relaxed font-mona md:text-sm text-xs font-semibold text-black">
            Driven by values of integrity, passion, care, innovation, and
            excellence, Lera focuses on the central role of strategic
            communication to impact behaviors, build brands, and provide
            technical leadership in health and social development.
          </p>
          <button className="bg-primary text-white font-medium py-2 px-8 rounded-full font-mono md:block hidden">
            About Us
          </button>
        </div>

        {/* Image Section */}
        <div className="relative w-full md:w-[48%] flex items-center justify-end">
          <img
            src={aboutUsImg.src}
            alt="Strategic Communication"
            className="rounded-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
