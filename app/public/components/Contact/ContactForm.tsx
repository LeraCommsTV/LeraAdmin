import React from "react";

const ContactForm: React.FC = () => {
  return (
    <div className="min-h-screen py-14 px-12 md:px-28">
      <div>
        <div className="mb-6">
          <button className="px-4 py-2 bg-green-100 text-primary rounded-full text-sm font-semibold uppercase font-mona">
            CONNECT WITH US
          </button>
        </div>
        <h1 className="text-4xl font-bold mb-6">Get in Touch</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl w-full">
        {/* Form Section */}
        <div>
          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                className="w-full p-3 rounded-lg bg-[#42BC401F] text-gray-700 text-xs font-semibold font-mona placeholder:text-gray-700 focus:outline-none focus:ring-2"
              />
              <input
                type="text"
                placeholder="Last Name"
                className="w-full p-3 rounded-lg bg-[#42BC401F] text-gray-700 text-xs font-semibold font-mona placeholder:text-gray-700 focus:outline-none focus:ring-2"
              />
            </div>
            <input
              type="email"
              placeholder="Email Address"
              className="w-full p-3 rounded-lg bg-[#42BC401F] text-gray-700 text-xs font-semibold font-mona placeholder:text-gray-700 focus:outline-none focus:ring-2"
            />
            <textarea
              placeholder="Write a message"
              rows={4}
              className="w-full p-3 rounded-lg bg-[#42BC401F] text-gray-700 text-xs font-semibold font-mona placeholder:text-gray-700 focus:outline-none focus:ring-2"
            />
            <button
              type="button"
              className="w-full py-3 bg-primary text-white font-bold rounded-lg shadow  focus:outline-none font-mona"
            >
              Submit
            </button>
          </form>
        </div>

        {/* Contact Info Section */}
        <div className="p-6 border border-gray-200 rounded-lg shadow bg-white">
          <p className="text-black font-mona font-medium mb-6 text-xs border-b border-black pb-6">
            Gender Dynamix Consult Limited is a Nigerian women-led consultancy
            firm using GESI expertise to empower organizations and build a more
            equitable Nigeria.
          </p>
          <div className="space-y-4">
            <p className="font-bold text-black text-sm font-mona">
              No 72, Birnin Kebbi Crescent, Garki, Abuja
            </p>
            <p className="font-bold text-black text-sm font-mona">
              +2348067750659
            </p>
            <p className="font-bold text-black text-sm font-mona">
              info@genderdynamixconsult.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
