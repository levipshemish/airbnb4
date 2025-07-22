import React, { useEffect, useState } from 'react';
import { useUser } from '../LoginContext';
import { useNav } from '../NavContext';

const Upcoming = () => {
  const [bookings, setBookings] = useState([]);
  const [experienceBookings, setExperienceBookings] = useState([]);
  const [serviceBookings, setServiceBookings] = useState([])
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [loadingExperiences, setLoadingExperiences] = useState(true);
  const [loadingServices, setLoadingServices] = useState(true);
  const { user } = useUser(); 
    const { closeNav } = useNav();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(`http://localhost:5869/api/bookings/user/${user._id}`);
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoadingBookings(false);
      }
    };
  
    if (user?._id) fetchBookings();
  }, [user]);
  
  useEffect(() => {
    const fetchExperienceBookings = async () => {
      try {
        const res = await fetch(`http://localhost:5869/api/experiencebookings/user/${user._id}`);
        const data = await res.json();
        setExperienceBookings(data);
      } catch (err) {
        console.error("Error fetching experience bookings:", err);
      } finally {
        setLoadingExperiences(false);
      }
    };
  
    if (user?._id) fetchExperienceBookings();
  }, [user]);
  
  useEffect(() => {
    const fetchServiceBookings = async () => {
      try {
        const res = await fetch(`http://localhost:5869/api/servicebookings/user/${user._id}`);
        const data = await res.json();
        setServiceBookings(data);
      } catch (err) {
        console.error("Error fetching experience bookings:", err);
      } finally {
        setLoadingServices(false);
      }
    };
  
    if (user?._id) fetchServiceBookings();
  }, [user]);

  if (loadingBookings || loadingExperiences) return <div>Loading...</div>;

  console.log(experienceBookings)
  return (
    <div className="p-6" onClick={closeNav}>
      <h1 className="text-2xl font-bold mb-4">Upcoming Bookings</h1>
      <label className='text-xl mb-1'>Homes</label>
      {bookings.length === 0 ? (
        <p>No upcoming bookings found.</p>
      ) : (
        <div className="grid gap-4 mb-10">
          {bookings.map((booking) => (
            <div key={booking._id} className="p-4 border rounded shadow flex gap-4 items-center">
                <img src={`http://localhost:5869/${booking.photo}`} alt="Home" className="w-32 h-24 object-cover rounded" />
                <div>
                <h2 className="text-xl font-semibold">{booking.name}</h2>
                <p>{booking.address}</p>
                <p>
                    {new Date(booking.startDate).toLocaleDateString()} → {new Date(booking.endDate).toLocaleDateString()}
                </p>
                <p>Total: ${booking.totalPrice}</p>
                </div>
            </div>
            ))}

        </div>
      )}
        <div className='text-xl mb-1'>Experiences</div>
        <div className='mb-10'>
        {experienceBookings.map((exbooking) => (
              <div key={exbooking._id} className="p-4 border rounded shadow flex gap-4 items-center">
              <img src={`http://localhost:5869/${exbooking.experiencePhoto}`} alt="Home" className="w-32 h-24 object-cover rounded" />
              <div>
              <h2 className="text-xl font-semibold">{exbooking.experienceTitle}</h2>
              <p>{exbooking.experienceAddress}</p>
              <p>
                  {new Date(exbooking.date).toLocaleDateString()} 
              </p>
              <p>Total: ${exbooking.price}</p>
              </div>
          </div>
        ))}
        </div>

     <div className='text-xl mb-1'>Services</div>
        {serviceBookings.map((servbooking) => (
              <div key={servbooking._id} className="p-4 border rounded shadow flex gap-4 items-center">
              <img src={`http://localhost:5869/${servbooking.servicePhoto}`} alt="Home" className="w-32 h-24 object-cover rounded" />
              <div>
              <h2 className="text-xl font-semibold">{servbooking.serviceTitle}</h2>
              <p>{servbooking.serviceLocation}</p>
              <p>
                  {new Date(servbooking.date).toLocaleDateString()} 
              </p>
              <p>Total: ${servbooking.servicePrice}</p>
              </div>
          </div>
        ))}

     </div>
  );
};

export default Upcoming;
