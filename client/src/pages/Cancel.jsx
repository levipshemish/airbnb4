import React from 'react';
import { Link } from 'react-router-dom';

const Cancel = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-30 px-4">
      <div className="text-2xl font-semibold text-pink-600 mb-10">
        Your order has been canceled.
      </div>
      <Link
        to="/"
        className="mt-2 px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
      >
        Return to Home
      </Link>
    </div>
  );
};

export default Cancel;
