import React from "react";

const ProHome: React.FC = () => {
  return (
    <div className="project-home md:h-[80vh] w-full">
      <div className="bg-[rgba(0,0,0,0.7)] h-full w-full flex flex-col justify-center md:px-20 px-8 md:pt-28 md:pb-28 pt-52 pb-10 text-white relative">
        <div className="md:w-[40%]">
          <h1 className="text-3xl font-bold leading-8 mb-4">Projects</h1>
          <p className="font-light text-xs font-mona leading-5">
            Lera approaches all implementation and execution of tasks from an
            evidence-based standpoint, conducting research, and analysing
            findings from a consumer perspective to inform the development and
            innovative deployment of coherent communication strategies. Lera’ s
            experience spans different thematic issues around health and social
            development, pursuing the most efficient and effective solutions
            that produce optimum, and impactful results.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProHome;
