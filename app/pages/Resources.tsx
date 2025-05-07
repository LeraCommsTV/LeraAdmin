import React from "react";
import { Footer, Header } from "../public/components/Layout";
import { CompanyProfile, ResHome } from "../public/components/Resources";

const Resources = () => {
  return (
    <div>
      <Header active="resources" />
      <ResHome />
      <CompanyProfile />
      <Footer />
    </div>
  );
};

export default Resources;
