import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const SuccessExperience = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await fetch(`http://localhost:5869/api/experiencebookings/${bookingId}`);
        const data = await res.json();
        setBooking(data);
      } catch (err) {
        console.error('Failed to fetch booking:', err);
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  if (loading) return <div>Loading...</div>;
  if (!booking) return <div>Booking not found.</div>;

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🎉 Booking Confirmed!</h1>
      {booking.photo && (
        <img
          src={`http://localhost:5869/${booking.experiencePhoto}`}
          alt="Booked Home"
          className="mt-4 w-full h-64 object-cover rounded"
        />
      )}
      <h2 className="text-xl font-semibold">{booking.experienceTitle}</h2>
      <p className="text-gray-600">{booking.experienceAddress}</p>
      <p className="mt-2">📅 Date: {new Date(booking.date).toLocaleDateString()}</p>
      <p className="mt-2">💵 Price: ${booking.price}</p>
    </div>
  );
};

export default SuccessExperience;
