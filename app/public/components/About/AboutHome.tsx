import React from "react";
import { FaBullseye } from "react-icons/fa";
import { GiBinoculars } from "react-icons/gi";
const AboutHome = () => {
  return (
    <div className="about-home text-white flex md:justify-center justify-start items-end pt-28 md:px-28 px-8">
      <div className="pt-12">
        {/* About Header */}
        <div>
          <h2 className="text-3xl md:text-4xl font-light mb-2 md:text-center text-left">
            About Lera
          </h2>
          <p className="leading-relaxed max-w-3xl mx-auto md:text-center text-left font-mona font-light text-sm">
            Lera Communications is a strategic and development communications
            firm based in Nigeria. We offer a wide range of media and
            communication solutions to individuals, corporate organizations, and
            various industries, including government, corporate, film, and news.
            Our team is composed of highly creative and detail-oriented
            professionals, and we provide extensive training to ensure top-tier
            service delivery
          </p>
        </div>
        {/* Bottom */}
        <div
          className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-t-white py-8 mt-14"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          {/* Mission Section */}
          <div className="">
            <div className="flex gap-4 items-center">
              {/* Icon */}
              <div
                className="w-12 h-12 text-white rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                }}
              >
                <FaBullseye size={30} />
              </div>
              <h3 className="text-xl font-light">
                Our <br /> Mission
              </h3>
            </div>
            <div>
              <p className="mt-2 font-mona font-light text-xs">
                To be the leading strategic communications and media consulting
                company in Nigeria, driving impactful narratives and innovative
                media solutions that inspire, inform, and transform societies.
              </p>
            </div>
          </div>

          {/* Vision Section */}
          <div className="">
            <div className="flex gap-4 items-center">
              {/* Icon */}
              <div
                className="w-12 h-12 text-white rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                }}
              >
                <GiBinoculars size={30} />
              </div>
              <h3 className="text-xl font-light">
                Our <br /> Vision
              </h3>
            </div>
            <div>
              <p className="mt-2 font-mona font-light text-xs">
                Leveraging technology and storytelling to engage audiences,
                foster social progress, build impactful partnerships, and
                continuously develop our team's talent for excellence,
                innovation, and integrity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutHome;
