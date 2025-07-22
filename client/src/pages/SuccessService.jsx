// SuccessService.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const SuccessService = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    if (!bookingId) return;
    fetch(`http://localhost:5869/api/servicebookings/${bookingId}`)
      .then((res) => res.json())
      .then((data) => setBooking(data))
      .catch((err) => console.error('Error fetching service booking:', err));
  }, [bookingId]);

  if (!booking) return <div>Loading...</div>;

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🎉 Service Booked!</h1>
      <img
        src={`http://localhost:5869/${booking.servicePhoto}`}
        alt="Service"
        className="w-full h-64 object-cover rounded"
      />
      <h2 className="text-xl font-semibold">{booking.serviceTitle}</h2>
      <p className="text-gray-600">{booking.serviceAddress}</p>
      <p className="mt-2">💵 Price: ${booking.price}</p>
      <p className="mt-2">📅 Date: {new Date(booking.date).toLocaleDateString()}</p>
    </div>
  );
};

export default SuccessService;
