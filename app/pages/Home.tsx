import React from "react";
import {
  AboutUs,
  Hero,
  CommunityEngagement,
  WhatsHappening,
  EventSlider,
  FlagShip,
  Patner,
} from "../public/components/Home";
import Footer from "../public/components/Layout/Footer";
const Home = () => {
  return (
    <>
      <Hero />
      <AboutUs />
      <CommunityEngagement />
      <WhatsHappening />
      <EventSlider />
      <FlagShip />
      <Patner />
      <Footer />
    </>
  );
};

export default Home;
