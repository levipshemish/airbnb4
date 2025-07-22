import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNav } from '../NavContext';

const Experiences = () => {
  const [experiences, setExperiences] = useState([]);
  const { cityFilter, guestCount, closeNav } = useNav();

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/experiences`);
        const data = await res.json();
        setExperiences(data);
      } catch (err) {
        console.error('Failed to fetch experiences:', err);
      }
    };

    fetchExperiences();
  }, []);

  const filteredExperiences = experiences.filter((exp) => {
    const matchesCity =
      !cityFilter ||
      (exp.city && exp.city.toLowerCase().includes(cityFilter.toLowerCase()));
  
    const matchesGuests =
      !guestCount ||
      (typeof exp.maxGuests === 'number' && exp.maxGuests >= Number(guestCount));
  
    return matchesCity && matchesGuests;
  });
  

  return (
    <div className="min-h-screen" onClick={closeNav}>
  <div className="p-4">
  <h2 className="text-3xl font-bold mb-4 py-3">All Experiences</h2>
    {filteredExperiences.length === 0 ? (
      <p className="text-gray-500">No experiences found</p>
    ) : (
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {filteredExperiences.map((exp) => (
          <Link to={`/experiences/${exp._id}`} key={exp._id}>
            <div className="hover:shadow-lg transition">
              {exp.photos?.length > 0 && (
                <img
                  src={`${import.meta.env.VITE_API_URL}/${exp.photos[0]}`}
                  alt={exp.title}
                  className="w-full aspect-square object-cover rounded-xl"
                />
              )}
              <div className="mt-1 px-1">
                <p className="text-sm text-gray-800">{exp.title}</p>
                <p className="text-xs text-gray-500">
                  {exp.category} → {exp.subcategory}
                </p>
                <p className="text-xs text-gray-600 truncate">{exp.description}</p>
                <p className="font-semibold text-green-700 text-xs mt-1">${exp.price}</p>
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

export default Experiences;
