import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNav } from '../NavContext';

const Services = () => {
  const [services, setServices] = useState([]);
  const { cityFilter, guestCount, closeNav } = useNav();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('http://localhost:5869/api/services');
        const data = await res.json();
        setServices(data);
      } catch (err) {
        console.error('Failed to fetch services:', err);
      }
    };

    fetchServices();
  }, []);

  const filteredServices = services.filter((serv) => {
    const matchesCity =
      !cityFilter ||
      (serv.location && serv.location.toLowerCase().includes(cityFilter.toLowerCase()));
  
    return matchesCity 
  });
  

  return (
    <div className="min-h-screen" onClick={closeNav}>
  <div className="p-4">
    <h2 className="text-3xl font-bold mb-4 py-3">All Services</h2>
    {filteredServices.length === 0 ? (
      <p className="text-gray-500">No services found</p>
    ) : (
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {filteredServices.map((serv) => (
          <Link to={`/services/${serv._id}`} key={serv._id}>
            <div className="hover:shadow-lg transition">
              {serv.photos?.length > 0 && (
                <img
                  src={`http://localhost:5869/${serv.photos[0]}`}
                  alt={serv.title}
                  className="w-full aspect-square object-cover rounded-xl"
                />
              )}
              <div className="mt-1 px-1">
                <p className="text-sm text-gray-800">{serv.title}</p>
                <p className="text-xs text-gray-500">
                  {serv.category} → {serv.subcategory}
                </p>
                <p className="text-xs text-gray-600 truncate">{serv.description}</p>
                <p className="font-semibold text-green-700 text-xs mt-1">${serv.price}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    )}
  </div>
</div>

  );
};

export default Services;
