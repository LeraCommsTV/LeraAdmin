import React from "react";

const ContactHome: React.FC = () => {
  return (
    <div className="contact-home">
      <div className="bg-[rgba(0,0,0,0.6)] h-full w-full flex flex-col justify-center items-start md:px-20 px-8 md:pt-28 md:pb-28 pt-52 pb-10 text-white relative">
        <div className="md:w-[20%]">
          <p className="  font-bold uppercase text-yellow-600 tracking-wider text-xs font-mona">
            Contact us
          </p>
          <h1 className="text-4xl font-bold leading-10 my-1">
            Let’s hear from you
          </h1>
        </div>
      </div>
    </div>
  );
};

export default ContactHome;
