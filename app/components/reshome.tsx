//components/ResHome.tsx (Optional: Keep as reusable component)
import React from "react";

const ResHome: React.FC = () => {
  return (
    <div className="res-home">
      <div className="bg-[rgba(0,0,0,0.6)] h-full w-full flex flex-col justify-center items-end md:px-20 px-8 md:pt-28 md:pb-28 pt-52 pb-10 text-white relative">
        <div className="md:w-[60%] ">
          <h1 className="text-2xl font-bold leading-8 mb-4">
            Create the kind of world you want to live in.
          </h1>
          <p className="font-thin text-sm font-mona">
            We use evidence-based research to inform policies and programs that
            improves lives. Our expertise cuts across various sectors- health,
            education, nutrition, environment, economic development, civil
            society, gender, youth and creativity- and geographies to address
            the full range of human developmental needs. Together, we unleash
            new ideas and opportunities and strengthen our collective capacity
            to drive change.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResHome;
