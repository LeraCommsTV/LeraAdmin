import React from "react";
import { Header } from "../Layout";
import { Event3 } from "../../constant/imports";

const BlogContent: React.FC = () => {
  const cards = [
    {
      type: "featured",
      date: "July 16, 2024",
      title: "Celebrating Family Bonds: Strength, Unity, and Inclusivity",
      image: Event3,
    },
    {
      type: "event",
      date: "July 19, 2024",
      title:
        "SCLI Faith Leaders Pivotal to Driving Positive Nutrition Practices",
      image: Event3,
    },
    {
      type: "event",
      date: "July 19, 2024",
      title: "Lera Renews Commitment to Gender Equity",
      image: Event3,
    },
    {
      type: "event",
      date: "July 19, 2024",
      title: "Lera at PUNCH’s 50th Anniversary",
      image: Event3,
    },
    {
      type: "featured",
      date: "2024",
      title:
        "Remembering Dr. Benjamin Lozare: A Tribute to His Leadership Legacy",
      image: Event3,
    },
  ];

  return (
    <div className="bg-black text-white p-6">
      <div className="">
        <Header active="blog" isHome />
      </div>
      {/* Grid Blog */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        {/* Large Card */}
        <div
          className="relative bg-cover bg-center h-full text-white"
          style={{ backgroundImage: `url(${cards[0].image})` }}
        >
          <div className="bg-gradient-to-b from-transparent via-black/50 to-black  h-full flex flex-col justify-between p-6">
            <div className="flex">
              <p className="text-[10px] font-bold uppercase font-mona bg-primary px-2 py-1">
                {cards[0].type}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-light capitalize font-mona">
                {cards[0].date}
              </p>
              <h3 className="text-xs font-bold font-mona">{cards[0].title}</h3>
            </div>
          </div>
        </div>
        {/* Small Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {cards.slice(1).map((card, index) => (
            <div
              className="relative bg-cover bg-center text-white"
              style={{ backgroundImage: `url(${card.image})` }}
              key={index}
            >
              <div className="bg-gradient-to-b from-transparent via-black/50 to-black  h-full flex flex-col justify-between p-6">
                <div className="flex">
                  <p className="text-[10px] font-bold uppercase font-mona bg-primary px-2 py-1">
                    {card.type}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-light capitalize font-mona">
                    {card.date}
                  </p>
                  <h3 className="text-xs font-bold font-mona">{card.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
        {cards.slice(2).map((card, index) => (
          <div key={index} className="">
            <div className="relative">
              <div className="flex absolute right-2 top-3">
                <p className="text-[10px] font-bold uppercase font-mona bg-primary px-2 py-1">
                  {card.type}
                </p>
              </div>
              <img
                src={card.image.src}
                alt={card.title}
                className="w-full object-contain"
              />
            </div>
            <div className="py-4">
              <span className="text-yellow-500 text-sm font-mona font-bold">
                {card.title}
              </span>
              <p className="text-xs font-mona font-light mt-2">
                {
                  "News: To commemorate International Men’s Day, the Centre for Communication and Social Impact (CCSI) celebrated men’s resilience and positive contributions by hosting an in-house well-being session for male colleagues."
                }
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogContent;
