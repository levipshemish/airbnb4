import React, { useEffect, useState } from 'react';
import { useNav } from '../NavContext';
import { useUser } from '../LoginContext';
import { Link } from 'react-router-dom';

const MyExperiences = () => {
  const { closeNav } = useNav();
  const { user } = useUser();
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const res = await fetch(`http://localhost:5869/api/experiences/user/${user._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await res.json();
        setExperiences(data);
      } catch (err) {
        console.error('Failed to fetch experiences:', err);
      }
    };

    if (user?._id) {
      fetchExperiences();
    }
  }, [user]);

  return (
    <div className="p-4" onClick={closeNav}>
      <h2 className="text-xl font-semibold mb-4">My Experiences</h2>

      {experiences.length === 0 ? (
        <p>No experiences available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {experiences.map((exp) => (
            <Link to={`/experience/user/${exp._id}`}
              key={exp._id}
              className="border p-4 rounded shadow hover:shadow-lg transition relative"
            >
              <h3 className="text-lg font-bold">{exp.title}</h3>
              <p>{exp.description}</p>
              <p className="text-sm text-gray-500 mt-1">
                {exp.category} → {exp.subcategory}
              </p>
              <p className="font-semibold mt-2">${exp.price}</p>

              {exp.photos && exp.photos.length > 0 && (
                <img
                  src={`http://localhost:5869/${exp.photos[0]}`}
                  alt={exp.title}
                  className="mt-2 w-full h-48 object-cover rounded"
                />
              )}
            </Link>
          ))}
        </div>
      )}
      <div className='flex justify-center mt-10'>
      <Link className="text-2xl font-semibold bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition" to={'/addexperience'}>
        + Add Experience
      </Link>
      </div>
    </div>
  );
};

export default MyExperiences;
