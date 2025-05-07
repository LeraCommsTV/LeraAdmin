import React from "react";
import { Footer, Header } from "../public/components/Layout";
import { AboutHome, CompanyValues } from "../public/components/About";

const About = () => {
  return (
    <div>
      <Header active="about" />
      <AboutHome />
      <CompanyValues />
      <Footer />
    </div>
  );
};

export default About;
