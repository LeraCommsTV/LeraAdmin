import React from "react";
import { GiBinoculars } from "react-icons/gi"; // Import the GiBinoculars icon

const CompanyValues: React.FC = () => {
  return (
    <div className="bg-[#D19C30] text-white py-12 md:px-16 px-8">
      {/* Section Title */}
      <h2 className="md:text-center text-xl font-light mb-8">Company Values</h2>

      {/* Grid Layout */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-center justify-cente">
        {/* Value Card - Repeat for each value */}
        {Array(4)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className={`px-5 ${
                index !== 0 && "md:border-l md:border-l-white"
              }`}
            >
              {/* Icon */}
              <div
                className="w-14 h-14 text-white rounded-full flex items-center justify-center mb-4"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                }}
              >
                <GiBinoculars size={30} />
              </div>

              {/* Value Title */}
              <h3 className="text-lg font-bold font-mona">Innovation</h3>

              {/* Value Description */}
              <p className="text-xs font-mona mt-2">
                We are creative, always learning, versatile, and cutting edge.
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CompanyValues;
