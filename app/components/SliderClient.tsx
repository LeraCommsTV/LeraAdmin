// app/(public)/home/SliderClient.tsx
"use client";

import dynamic from 'next/dynamic';
import Image from 'next/image';

// Dynamically import Slider with SSR disabled
const Slider = dynamic(() => import('react-slick'), { ssr: false });

// Import slick-carousel CSS
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface Event {
  title: string;
  subtitle: string;
  image: string;
}

interface SliderClientProps {
  events?: Event[];
  partners?: string[];
  settings: {
    dots: boolean;
    infinite: boolean;
    speed: number;
    slidesToShow: number;
    slidesToScroll: number;
    responsive?: Array<{
      breakpoint: number;
      settings: {
        slidesToShow: number;
      };
    }>;
  };
  isEventSlider?: boolean;
}

export default function SliderClient({ events, partners, settings, isEventSlider }: SliderClientProps) {
  return (
    <div className="w-full">
      <Slider {...settings} dots={false}>
        {isEventSlider && events
          ? events.map((event, index) => (
              <div key={index} className="w-[400px]">
                <div className="relative h-64">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                  <div className="bg-gradient-to-b from-transparent via-black/50 to-black h-full flex flex-col justify-end p-6">
                    <h3 className="text-sm font-bold font-mona">{event.title}</h3>
                    <p className="text-[10px] font-bold uppercase font-mona text-yellow-600">
                      {event.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            ))
          : partners?.map((partner, index) => (
              <div key={index} className="flex items-center h-[120px] justify-center mx-8">
                <div className="h-full flex flex-row items-center">
                  <Image
                    src={partner}
                    alt={`Partner ${index + 1}`}
                    width={120}
                    height={80}
                    className="object-contain"
                  />
                </div>
              </div>
            ))}
      </Slider>
    </div>
  );
}