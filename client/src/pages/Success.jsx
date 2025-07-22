import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function Success() {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings/${bookingId}`);
      const data = await res.json();
      setBooking(data);
    };
    if (bookingId) fetchBooking();
  }, [bookingId]);

  if (!booking) return <p>Loading booking info...</p>;

  return (
    <div className="p-8 max-w-xl mx-auto bg-white rounded-xl shadow-lg mt-8">
      <h1 className="text-2xl font-bold text-green-600">Booking Confirmed 🎉</h1>
      <p className="mt-4 text-gray-700"><strong>Name:</strong> {booking.name}</p>
      <p className="text-gray-700"><strong>Address:</strong> {booking.address}</p>
      <p className="text-gray-700"><strong>Dates:</strong> {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}</p>
      <p className="text-gray-700"><strong>Total:</strong> ${booking.totalPrice}</p>
      {booking.photo && (
        <img
          src={`${import.meta.env.VITE_API_URL}/${booking.photo}`}
          alt="Booked Home"
          className="mt-4 w-full h-64 object-cover rounded"
        />
      )}
      <a href="/" className="mt-6 inline-block text-blue-600 hover:underline">Return to homepage</a>
    </div>
  );
}
