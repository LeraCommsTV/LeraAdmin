import React from "react";
import { ProHome, ProjectListings } from "../public/components/Project";
import { Footer, Header } from "../public/components/Layout";

const Project = () => {
  return (
    <div>
      <Header active="projects" />
      <ProHome />
      <ProjectListings />
      <Footer />
    </div>
  );
};

export default Project;
