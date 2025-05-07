import React from "react";
import { aboutUsImg, FlagShipImg, WhoAreWeText } from "../../constant/imports";

const FlagShip: React.FC = () => {
  return (
    <section className="md:py-16 py-10 my-16 md:px-10 px-0 bg-green-50">
      {/* Heading */}
      <h2 className="md:px-36 px-0 md:mb-8 mb-2 md:text-4xl text-2xl font-medium text-black text-center">
        Flagship CSR initiative RUGAN ARDO ''WASH'' PROJECT
      </h2>
      {/* Inner Container */}
      <div className="w-full flex flex-col md:flex-row items-start justify-between p-8 md:p-8 rounded-2xl">
        {/* Image Section */}
        <div className="relative w-full md:w-[38%] flex items-center justify-end">
          <img src={FlagShipImg} alt="Flag Ship" className="" />
        </div>
        {/* Text Section */}
        <div className="w-full md:w-[58%] space-y-4 md:mt-0 mt-5">
          <p className="leading-relaxed font-mona md:text-sm text-xs font-semibold text-black">
            Many public health challenges such as: malnutrition, malaria, water
            borne diseases etc. faced by communities in Nigeria are largely
            preventable. Several rural communities in Nigeria lack access to
            safe drinking-water, sanitation and hygiene services; malaria
            prevention and treatment services; as well as access to family
            planning (FP)/childbirth spacing (CBS) services. Women in rural
            areas are more likely to marry earlier than their urban
            counterparts, increasing the need for modern family planning.
            However, women in rural areas are less likely to use modern
            contraceptives when compared to their urban counterparts.
          </p>
          <button className="text-primary font-medium py-1 px-4 font-mono border-b-2 border-b-yellow-600">
            Read more
          </button>
        </div>
      </div>
    </section>
  );
};

export default FlagShip;
