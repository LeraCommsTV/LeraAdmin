import React from "react";
import { Event3 } from "../../constant/imports";

interface CardProps {
  title: string;
  description: string;
  imageUrl: string;
}

const Card: React.FC<CardProps> = ({ title, description, imageUrl }) => {
  return (
    <div
      className="relative bg-cover bg-center h-64 text-white"
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div className="bg-gradient-to-b from-transparent via-black/50 to-black  h-full flex flex-col justify-end p-6">
        <h3 className="text-sm font-bold font-mona mb-3">{title}</h3>
        <p className="text-xs font-mona">{description}</p>
      </div>
    </div>
  );
};

const ProjectListings: React.FC = () => {
  const cards = [
    {
      title: "SBC for Gender and Nutrition in Nigeria Project",
      description:
        "An SBC campaign of the Africa Poultry Multiplication Initiative (APMI) on nutrition and gender in Nigeria, funded by Tanager.",
      imageUrl: Event3,
    },
    {
      title: "SBC for Gender and Nutrition in Nigeria Project",
      description:
        "An SBC campaign of the Africa Poultry Multiplication Initiative (APMI) on nutrition and gender in Nigeria, funded by Tanager.",
      imageUrl: Event3,
    },
    {
      title: "SBC for Gender and Nutrition in Nigeria Project",
      description:
        "An SBC campaign of the Africa Poultry Multiplication Initiative (APMI) on nutrition and gender in Nigeria, funded by Tanager.",
      imageUrl: Event3,
    },
    {
      title: "SBC for Gender and Nutrition in Nigeria Project",
      description:
        "An SBC campaign of the Africa Poultry Multiplication Initiative (APMI) on nutrition and gender in Nigeria, funded by Tanager.",
      imageUrl: Event3,
    },
    {
      title: "SBC for Gender and Nutrition in Nigeria Project",
      description:
        "An SBC campaign of the Africa Poultry Multiplication Initiative (APMI) on nutrition and gender in Nigeria, funded by Tanager.",
      imageUrl: Event3,
    },
    {
      title: "SBC for Gender and Nutrition in Nigeria Project",
      description:
        "An SBC campaign of the Africa Poultry Multiplication Initiative (APMI) on nutrition and gender in Nigeria, funded by Tanager.",
      imageUrl: Event3,
    },
  ];

  return (
    <div className="px-8 md:px-20 pt-16 pb-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {cards.map((card, index) => (
        <Card
          key={index}
          title={card.title}
          description={card.description}
          imageUrl={card.imageUrl}
        />
      ))}
    </div>
  );
};

export default ProjectListings;
