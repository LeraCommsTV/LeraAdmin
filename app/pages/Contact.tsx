import React from "react";
import { Footer, Header } from "../public/components/Layout";
import {
  ContactForm,
  ContactHome,
  GoogleMapContainer,
} from "../public/components/Contact";

const Contact = () => {
  return (
    <div>
      <Header active="contact" />
      <ContactHome />
      <ContactForm />
      {/* <GoogleMapContainer /> */}
      <Footer />
    </div>
  );
};

export default Contact;
