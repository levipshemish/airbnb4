import React from 'react';
import { Link } from "react-router-dom";
import { FaAirbnb } from "react-icons/fa";

const Navbar2 = ({ backLink = '/', onBackClick }) => {
  return (
    <div className="flex fixed top-0 left-0 right-0 z-[9999] justify-between items-center px-10 py-6 bg-white">
      <Link to="/">
        <FaAirbnb className="text-[#FE385C] text-4xl" />
      </Link>

      {onBackClick ? (
        <button
          onClick={onBackClick}
          className="text-black text-sm bg-gray-100 px-9 py-3 rounded-3xl  font-medium hover:bg-gray-200"
        >
          Back
        </button>
      ) : (
        <Link
          to={backLink}
          className="text-black text-sm bg-gray-100 px-9 py-3 rounded-3xl  font-medium hover:bg-gray-200"
        >
          Back
        </Link>
      )}
    </div>
  );
};

export default Navbar2;
