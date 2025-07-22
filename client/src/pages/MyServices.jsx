import React, { useEffect, useState } from 'react';
import { useNav } from '../NavContext';
import { useUser } from '../LoginContext';
import { Link } from 'react-router-dom';

const MyServices = () => {
  const { closeNav } = useNav();
  const { user } = useUser();
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/services/user/${user._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await res.json();
        setServices(data);
      } catch (err) {
        console.error('Failed to fetch services:', err);
      }
    };

    if (user?._id) {
      fetchServices();
    }
  }, [user]);

  return (
    <div className="p-4" onClick={closeNav}>
      <h2 className="text-xl font-semibold mb-4">My Services</h2>

      {services.length === 0 ? (
        <p>No services available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((svc) => (
            <Link
              to={`/service/user/${svc._id}`}
              key={svc._id}
              className="border p-4 rounded shadow hover:shadow-lg transition relative"
            >
              <h3 className="text-lg font-bold">{svc.title}</h3>
              <p>{svc.description}</p>
              <p className="text-sm text-gray-500 mt-1">
                {svc.category} → {svc.subcategory}
              </p>
              <p className="font-semibold mt-2">${svc.price}</p>

              {svc.photos && svc.photos.length > 0 && (
                <img
                  src={`${import.meta.env.VITE_API_URL}/${svc.photos[0]}`}
                  alt={svc.title}
                  className="mt-2 w-full h-48 object-cover rounded"
                />
              )}
            </Link>
          ))}
        </div>
      )}
      <div className='flex justify-center mt-10'>
      <Link className="text-2xl font-semibold bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition" to={'/addservice'}>
        + Add Service
      </Link>
      </div>
    </div>
  );
};

export default MyServices;
