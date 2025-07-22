import React, { useEffect, useState } from 'react';
import { useNav } from '../NavContext';
import { useUser } from '../LoginContext';
import { Link } from 'react-router-dom';


const MyHomes = () => {
   const {closeNav} = useNav();
   const {user} = useUser();
  const [homes, setHomes] = useState([]);

  useEffect(() => {
    const fetchHomes = async () => {
      try {
        const res = await fetch(`http://localhost:5869/api/homes/user/${user._id}`);
        const data = await res.json();
        setHomes(data);
      } catch (err) {
        console.error('Failed to fetch homes:', err);
      }
    };
  
    if (user?._id) {
      fetchHomes();
    }
  }, [user]);

  console.log("Current user:", user);

  return (
    <div className="p-4" onClick={closeNav}>
      <h2 className="text-xl font-semibold mb-4">My Homes</h2>
      
      {homes.length === 0 ? (
        <p>No homes available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
         {homes.map((home) => (
              <Link to={`/home/user/${home._id}`} key={home._id}>
                <div className="border p-4 rounded shadow hover:shadow-lg transition">
                  <h3 className="text-lg font-bold">{home.name}</h3>
                  <p>{home.text}</p>
                  <p className="text-sm text-gray-500">{home.address}</p>
                  <p className="font-semibold">${home.price}</p>

                  {home.photos && home.photos.length > 0 && (
                    <img
                      src={`http://localhost:5869/${home.photos[0]}`}
                      alt="Home"
                      className="mt-2 w-full h-48 object-cover rounded"
                    />
                  )}
                </div>
              </Link>
            ))}
        </div>
      )}
      <div className='flex justify-center mt-10'>
      <Link className="text-2xl font-semibold bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition" to={'/addhome'}>
        + Add Home
      </Link>
      </div>
     
    </div>
  );
};

export default MyHomes;
