import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ColoredLogo, WhiteLogo } from "../../constant/imports";
import { LiaTimesSolid } from "react-icons/lia";
import { RxHamburgerMenu } from "react-icons/rx";
interface HeaderProps {
  active: string;
  isHome?: boolean;
  isWhite?: boolean;
}
const Header: React.FC<HeaderProps> = ({ isHome, isWhite, active }) => {
  const [nav, setNav] = useState(false);
  const menuItems = [
    { name: "Home", path: "" },
    { name: "About Us", path: "about" },
    { name: "Resources", path: "resources" },
    { name: "Projects", path: "projects" },
    { name: "Blog", path: "blog" },
    { name: "Contact", path: "contact" },
  ];
  const handleClick = () => setNav(!nav);
  return (
    <nav
      className={`${
        isHome
          ? "absolute w-full left-0 top-0 text-white bg-transparent"
          : "bg-white text-black"
      } `}
    >
      <div className="w-full container mx-auto px-8 py-2 flex items-center justify-between">
        {/* Logo */}
        <Link to={"/"} className="font-mona text-sm font-bold capitalize">
          {isHome ? (
            <img src={WhiteLogo} alt="LERA Communications Logo" />
          ) : (
            <img src={ColoredLogo} alt="LERA Communications Logo" />
          )}
        </Link>
        {/* Navigation Links */}
        <ul className="hidden md:flex space-x-8 text-sm font-light">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                to={`/${item.path}`}
                className={`font-mona text-sm font-bold capitalize ${
                  active === item.path && "border-b-2 border-b-primary pb-1"
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button (Hamburger) */}
        <div className="md:hidden">
          <button
            type="button"
            className="text-gray-400 hover:text-white focus:outline-none"
            onClick={handleClick}
          >
            {!nav ? (
              <RxHamburgerMenu color={isHome ? "white" : "black"} size={20} />
            ) : (
              <LiaTimesSolid color={isHome ? "white" : "black"} size={20} />
            )}
          </button>
        </div>
      </div>
      <ul
        className={!nav ? "hidden" : "absolute bg-white w-full px-6 py-8 "}
        style={{ zIndex: 10000 }}
      >
        {menuItems.map((item, index) => (
          <li key={index}>
            <Link
              to={`/${item.path}`}
              className={`font-mona text-xs font-bold capitalize text-black  ${
                active === item.path && "border-b-2 border-b-primary  pb-1"
              }`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Header;
