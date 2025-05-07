import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import {
  Patner1,
  Patner2,
  Patner3,
  Patner4,
  Patner5,
  Patner6,
  Patner7,
} from "../../constant/imports";

const Patner: React.FC = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5, // Default number of slides for large screens
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024, // Medium screen (e.g., tablet landscape)
        settings: {
          slidesToShow: 4, // Show 4 slides
        },
      },
      {
        breakpoint: 768, // Small screen (e.g., tablet portrait)
        settings: {
          slidesToShow: 3, // Show 3 slides
        },
      },
      {
        breakpoint: 640, // Extra small screen (e.g., large phones)
        settings: {
          slidesToShow: 3, // Show 2 slides
        },
      },
      {
        breakpoint: 480, // Very small screens (e.g., small phones)
        settings: {
          slidesToShow: 3, // Show 1 slide
        },
      },
    ],
  };

  const events = [
    { path: Patner1 },
    { path: Patner2 },
    { path: Patner3 },
    { path: Patner4 },
    { path: Patner5 },
    { path: Patner6 },
    { path: Patner7 },
  ];

  return (
    <div className="w-full mb-5">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center ">
        Partners
      </h2>
      <Slider {...settings} dots={false}>
        {events.map((event, index) => (
          <div className="flex items-center h-[120px] justify-center mx-8">
            <div className=" h-full flex flex-row items-center">
              <img key={index} src={event.path} />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Patner;
