import React from "react";

const CommunityEngagement: React.FC = () => {
  return (
    <div className="community-engagement relative text-white w-full flex flex-col justify-center items-end md:px-20 px-8 md:pt-16 md:pb-16 pb-8 pt-40">
      <div className="md:w-[50%] w-full md:mt-0 mt-20">
        <h1 className="text-2xl font-bold leading-8 mb-4">
          Community Engagement
        </h1>
        <p className="font-thin md:text-sm text-xs font-mona">
          Community engagement and advocacy services include community outreach
          programs, advocacy campaigns, stakeholder engagement, CSR initiatives,
          and public policy advocacy. Community outreach programs design and
          implement initiatives to engage and benefit local communities,
          fostering positive relationships and social impact.
        </p>
      </div>
    </div>
  );
};

export default CommunityEngagement;
