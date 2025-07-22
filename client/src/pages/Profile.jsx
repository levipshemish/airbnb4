import { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom"; // ✅ useNavigate for redirect
import { useNav } from '../NavContext';
import HostMenu from '../components/HostMenu';

export default function Profile() {
  const [user, setUser] = useState(null);
  const { closeNav } = useNav();
  const navigate = useNavigate(); // ✅

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch('http://localhost:5869/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setUser(data);
        } else {
          console.error(data.error);
        }
      } catch (err) {
        console.error('Profile fetch error:', err);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem('token');

    try {
      await fetch('http://localhost:5869/api/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      localStorage.removeItem('token'); // ✅ clear token
      setUser(null); // clear state
      navigate('/'); // optional redirect to home
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (!user) return <div>Loading profile...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8" onClick={closeNav}>
      {/* Welcome Box */}
      <div className="bg-white rounded-2xl shadow-md p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome, {user.name}!</h1>
          <p className="text-gray-500 mt-1">Manage your bookings, listings, and profile here.</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm px-4 py-2 bg-red-100 text-red-500 rounded hover:bg-red-200 transition"
        >
          Log out
        </button>
      </div>

      {/* Past Trips Box */}
      <h2 className="text-2xl font-bold text-gray-800 mt-15 mb-2">Bookings</h2>
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800">Past Trips</h2>
        <p className="text-gray-500 mt-1">You haven’t taken any trips yet.</p>
      </div>

      <Link
        to="/upcoming"
        className="block rounded-2xl shadow-md p-6 transition-transform duration-300 ease-in-out hover:scale-105"
       >
        <h2 className="text-xl font-semibold">Upcoming Events</h2>
        <p className="text-sm mt-1">View your upcoming Homes, experiences, and services.</p>
      </Link>

      <h2 className="text-2xl font-bold text-gray-800 mt-15 mb-2">Listings</h2>
      <Link
        to="/myhomes"
        className="block rounded-2xl shadow-md p-6 transition-transform duration-300 ease-in-out hover:scale-105"
      >
        <h2 className="text-xl font-semibold">My Homes</h2>
        <p className="text-sm mt-1">View your Homes</p>
      </Link>

      <Link
        to="/myexperiences"
        className="block rounded-2xl shadow-md p-6 transition-transform duration-300 ease-in-out hover:scale-105"
      >
        <h2 className="text-xl font-semibold">My Experiences</h2>
        <p className="text-sm mt-1">View your Experiences</p>
      </Link>

      <Link
        to="/myservices"
        className="block rounded-2xl shadow-md p-6 transition-transform duration-300 ease-in-out hover:scale-105"
      >
        <h2 className="text-xl font-semibold">My Services</h2>
        <p className="text-sm mt-1">View your Services</p>
      </Link>

      {/* Become a Host Link */}
      <HostMenu
  closeNav={closeNav}
  asCard={true}
  buttonClassName="block bg-blue-600 text-white text-center rounded-2xl shadow-md p-6 hover:bg-blue-700 transition"
/>

    </div>
  );
}
