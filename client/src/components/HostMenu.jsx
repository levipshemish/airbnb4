import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HostMenu({ closeNav, buttonClassName = "", asCard = false }) {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => {
    setShowPopup(false);
    closeNav?.();
  };

  const handleNavigate = (path) => {
    handleClose();
    navigate(path);
  };

  const handleOpen = () => setShowPopup(true);

  return (
    <>
      {asCard ? (
        <div
          onClick={handleOpen}
          className={`cursor-pointer ${buttonClassName}`}
        >
          <h2 className="text-xl font-semibold">Become a host</h2>
          <p className="text-sm mt-1">Start listing your space and earn money.</p>
        </div>
      ) : (
        <button
          onClick={handleOpen}
          className={`cursor-pointer transition ${buttonClassName}`}
        >
          Become a host
        </button>
      )}

      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-50">
          <div className="w-[90%] h-[80%] max-w-3xl bg-white p-10 rounded-xl shadow-2xl relative text-center">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition"
            >
              Close
            </button>

            <h2 className="text-3xl font-bold mb-8 text-gray-800">What would you like to host?</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                onClick={() => handleNavigate("/addhome")}
                className="bg-blue-500 hover:bg-blue-600 text-white py-6 rounded-lg shadow-md text-xl font-semibold transition"
              >
                Host a Home
              </button>
              <button
                onClick={() => handleNavigate("/addservice")}
                className="bg-green-500 hover:bg-green-600 text-white py-6 rounded-lg shadow-md text-xl font-semibold transition"
              >
                Host a Service
              </button>
              <button
                onClick={() => handleNavigate("/addexperience")}
                className="bg-purple-500 hover:bg-purple-600 text-white py-6 rounded-lg shadow-md text-xl font-semibold transition"
              >
                Host an Experience
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}



