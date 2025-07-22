import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { FaAirbnb } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";
import { useNav } from "../NavContext";
import { Link } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { FaSearch } from "react-icons/fa";
import { useUser } from "../LoginContext";
import HostMenu from "./HostMenu";

export default function Navbar() {
  const [showPopup, setShowPopup] = useState(false);
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [loginName, setLoginName] = useState('');
  const [loginText, setLoginText] = useState('');
  const [loginStatus, setLoginStatus] = useState('');

  const { user, login: contextLogin, logout: contextLogout } = useUser();
  const { isNavOpen, toggleNav, closeNav, cityFilter, setCityFilter, guestCount, setGuestCount } = useNav();

  const [tempCity, setTempCity] = useState(cityFilter);
const [tempGuests, setTempGuests] = useState(guestCount);

const handleSearch = () => {
  setCityFilter(tempCity);
  setGuestCount(Number(tempGuests) || 0);
};

  const handleOpen = () => setShowPopup(true);
  const handleClose = () => setShowPopup(false);

  const submit = async () => {
    const res = await fetch('http://localhost:5869/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, text }),
    });
    const newMessage = await res.json();
    setMessages([...messages, newMessage]);
    setName('');
    setText('');
  };

  const login = async () => {
    try {
      const res = await fetch('http://localhost:5869/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: loginName, text: loginText }),
      });

      const data = await res.json();
      if (res.ok) {
        contextLogin(data.user, data.token); // ✅ use context
        setLoginStatus(`Welcome back, ${data.user.name}`);
        setShowPopup(false);
        closeNav();
      } else {
        setLoginStatus(data.error || 'Login failed');
      }
    } catch (err) {
      setLoginStatus('Login error');
    }
  };

  const logout = () => {
    contextLogout(); // ✅ use context
    closeNav();
    setShowPopup(false);
  };

  const isTokenValid = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;
  
    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000; // current time in seconds
      return decoded.exp && decoded.exp > now;
    } catch (err) {
      return false;
    }
  };
  

  return (
    <div>
      <div className="h-[160px] bg-[#F9F9F9] border border-b-2 border-[#EBEBEB]">
        <div className="flex flex-col">
        <div className="flex justify-between p-5">
          <Link to={'/'}>
            <FaAirbnb className="text-[#FE385C] text-4xl" />
          </Link>
          <div className="flex flex-wrap gap-6 text-gray-500 justify-center items-center text-sm sm:text-base md:gap-10 w-full md:w-auto">
  <Link className="group flex items-center gap-2" to={'/'}>
    <img
      className="w-6 md:w-8 transition-transform duration-300 ease-in-out group-hover:scale-110"
      src="/images/house-svgrepo-com.svg"
    />
    <span>Homes</span>
  </Link>
  <Link className="group flex items-center gap-2" to={'/experiences'}>
    <img
      className="w-6 md:w-8 transition-transform duration-300 ease-in-out group-hover:scale-110"
      src="/images/hot-air-balloon-svgrepo-com (2).svg"
    />
    <span>Experiences</span>
  </Link>
  <Link className="group flex items-center gap-2" to={'/services'}>
    <img
      className="w-6 md:w-8 transition-transform duration-300 ease-in-out group-hover:scale-110"
      src="/images/bell-svgrepo-com.svg"
    />
    <span>Services</span>
  </Link>
</div>


          

          <div className="flex gap-2">
          {user && isTokenValid() && user.name ? (
  <Link to="/profile">
    <div
      className="bg-[#F2F2F2] w-8 h-8 mr-3 rounded-full flex items-center justify-center text-sm font-semibold text-gray-700 cursor-pointer"
      title={user.name}
    >
      {user.name?.charAt(0)?.toUpperCase()}
    </div>
  </Link>
) : (
  <CgProfile
    onClick={handleOpen}
    className="bg-[#F2F2F2] w-8 h-8 mr-3 p-1 rounded-xl text-gray-400 cursor-pointer"
    title="Log in to access profile"
  />
)}



            {!isNavOpen && (
              <RxHamburgerMenu
                className="bg-[#F2F2F2] w-8 h-8 mr-3 p-1 rounded-xl cursor-pointer"
                onClick={toggleNav}
              />
            )}

            {isNavOpen && !showPopup && ( 
              <div className="w-64 bg-white shadow-xl absolute right-5 top-24 z-30 rounded-2xl p-4 space-y-3">
                {!user ? (
                  <div
                    onClick={() => {
                      handleOpen();
                      closeNav();
                    }}
                    className="cursor-pointer text-gray-800 font-semibold hover:bg-gray-100 px-4 py-2 rounded transition"
                  >
                    Log in or Sign up
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-gray-600 px-4 py-2">Hello, {user.name}</p>

                    <div   className="block text-gray-800 font-semibold hover:bg-gray-100 px-4 py-2 rounded transition">
                    <HostMenu closeNav={closeNav} />
                    </div>
                    <div className="border-t border-gray-200 my-2" />
                    <Link
                      to="/upcoming"
                      onClick={closeNav}
                      className="block text-gray-800 font-semibold hover:bg-gray-100 px-4 py-2 rounded transition"
                    >
                      Upcoming events
                    </Link>

                    <div className="border-t border-gray-200 my-2" />
                    <Link
                      to="/myhomes"
                      onClick={closeNav}
                      className="block text-gray-800 font-semibold hover:bg-gray-100 px-4 py-2 rounded transition"
                    >
                      My Homes
                    </Link>

                    <Link
                      to="/myexperiences"
                      onClick={closeNav}
                      className="block text-gray-800 font-semibold hover:bg-gray-100 px-4 py-2 rounded transition"
                    >
                      My Experiences
                    </Link>

                    <Link
                      to="/myservices"
                      onClick={closeNav}
                      className="block text-gray-800 font-semibold hover:bg-gray-100 px-4 py-2 rounded transition"
                    >
                      My Services
                    </Link>

                    <div className="border-t border-gray-200 my-2" />


                    <button
                      onClick={logout}
                      className="w-full text-left text-red-500 font-semibold hover:bg-red-100 px-4 py-2 rounded transition"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            )}

          </div>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-50">
          <div className="w-[90%] max-w-2xl bg-white p-8 rounded-xl shadow-2xl relative">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition"
            >
              Close
            </button>

            <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

            <form className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Message"
                value={text}
                onChange={e => setText(e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={submit}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
              >
                Submit
              </button>
            </form>

            <div className="mt-10 border-t pt-6">
              <h3 className="text-xl font-semibold mb-4">Log in</h3>
              <input
                type="text"
                placeholder="Name"
                value={loginName}
                onChange={e => setLoginName(e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                placeholder="Password"
                value={loginText}
                onChange={e => setLoginText(e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={login}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded transition"
              >
                Log in
              </button>
              {loginStatus && (
                <p className="mt-2 text-center text-sm text-red-500">
                  {loginStatus}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="w-full flex justify-center">
  <div className="w-[80%] max-w-2xl">
    <div className="flex items-center border border-gray-300 rounded-full bg-white px-2 py-1 space-x-2 w-full">
      <input
        type="text"
        placeholder="City"
        value={tempCity}
        onChange={(e) => setTempCity(e.target.value)}
        className="px-3 py-2 w-1/2 focus:outline-none rounded-full"
      />
      <input
        type="number"
        min="1"
        placeholder="Guests"
        value={tempGuests}
        onChange={(e) => setTempGuests(e.target.value)}
        className="px-3 py-2 w-1/4 focus:outline-none rounded-full"
      />
      <FaSearch
        onClick={handleSearch}
        className="text-gray-500 hover:text-pink-500 cursor-pointer w-5 h-5"
        title="Search"
      />
    </div>
  </div>
</div>

       </div>
    </div>
  );
}
