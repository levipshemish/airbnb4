import { useEffect, useState } from "react";
import { useNav } from "../NavContext";
import { Link } from "react-router-dom";

export default function HomePage() {
  const { closeNav, cityFilter, guestCount } = useNav(); 
  const [homes, setHomes] = useState([]);

  useEffect(() => {
    const fetchHomes = async () => {
      try {
        const res = await fetch("http://localhost:5869/api/homes/get");
        const data = await res.json();
        console.log("📦 homes response:", data);
        setHomes(data);
      } catch (err) {
      console.error("Failed to fetch homes:", err);
      }
    };

    fetchHomes();
  }, []);

  // ✅ filter based on search bar in Navbar
  const filteredHomes = homes.filter((home) => {
    const matchesCity =
      !cityFilter ||
      (home.city && home.city.toLowerCase().includes(cityFilter.toLowerCase()));
  
    const matchesGuests =
      !guestCount ||
      (typeof home.maxGuest === 'number' && home.maxGuest >= Number(guestCount));
  
    return matchesCity && matchesGuests;
  });
  
  console.log(guestCount)
  

  return (
    <div className="min-h-screen" onClick={closeNav}>
    <div className="p-4">
    <h2 className="text-3xl font-bold mb-4 py-3">All Homes</h2>
      {filteredHomes.length === 0 ? (
        <p className="text-gray-500">No homes found for “{cityFilter}”</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {filteredHomes.map((home) => (
            <Link to={`/home/${home._id}`} key={home._id}>
              <div className="hover:shadow-lg transition">
                {home.photos?.length > 0 && (
                  <img
                    src={`http://localhost:5869/${home.photos[0]}`}
                    alt="Home"
                    className="w-full h-48 object-cover rounded-xl"
                  />
                )}
                <div className="mt-1 px-1">
                  <p className="text-sm text-gray-800">Home in {home.city}</p>
                  <p className="font-semibold text-gray-500 text-xs">
                    ${home.price} for 1 night
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  </div>
  
  );
}
