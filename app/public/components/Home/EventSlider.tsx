import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Event1, Event2, Event3, Event4 } from "../../constant/imports";

const EventSlider: React.FC = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3.5, // Show 2 cards at a time
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768, // Mobile breakpoint
        settings: {
          slidesToShow: 1.5, // Show 1 card at a time on small screens
        },
      },
    ],
  };

  const events = [
    {
      title: "Lera CSR at Jahi Primary School, Keffi",
      subtitle: "EVENT · FEATURED",
      image: Event1,
    },
    {
      title: "Lera Renew Commitment to Gender Equality",
      subtitle: "EVENT · FEATURED",
      image: Event2,
    },
    {
      title: "Lera Supports Community Development",
      subtitle: "EVENT · FEATURED",
      image: Event3,
    },
    {
      title: "Lera Empowering Women Entrepreneurs",
      subtitle: "EVENT · FEATURED",
      image: Event4,
    },
  ];

  return (
    <section className="text-white">
      <div className="w-full">
        <Slider {...settings} dots={false}>
          {events.map((event, index) => (
            <div key={index} className="w-[400px]">
              <div
                className="relative bg-cover bg-center h-64"
                style={{ backgroundImage: `url(${event.image})` }}
              >
                <div className="bg-gradient-to-b from-transparent via-black/50 to-black  h-full flex flex-col justify-end p-6">
                  <h3 className="text-sm font-bold font-mona">{event.title}</h3>
                  <p className="text-[10px] font-bold uppercase font-mona text-yellow-600">
                    {event.subtitle}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default EventSlider;
