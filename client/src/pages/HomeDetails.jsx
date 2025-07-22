import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import BookingCalendar from '../components/BookingCalendar';
import {loadStripe} from '@stripe/stripe-js';
import { useUser } from '../LoginContext';


export default function HomeDetails() {
  const { id } = useParams();
     const {user} = useUser();
  const [home, setHome] = useState(null);
  const [bookingPopup, setBookingPopup] = useState(false);

  const [startDate, setStartDate] = useState(null);
const [endDate, setEndDate] = useState(null);


const calculateNights = () => {
  if (!startDate || !endDate) return 0;
  const diffTime = Math.abs(endDate - startDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const totalNights = calculateNights();
const totalPrice = home ? totalNights * home.price : 0;

  useEffect(() => {
    const fetchHome = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/homes/${id}`);
      const data = await res.json();
      setHome(data);
    };
    fetchHome();
  }, [id]);

  const handleOpen = () => setBookingPopup(true);
  const handleClose = () => setBookingPopup(false);

 

  const makePayment = async () => {
    const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

  
    const body = {
      products: [{
        name: home.name,
        price: totalPrice,
        quantity: 1
      }],
      userId: user._id,         // get this from context or props
      homeId: home._id,
      startDate,
      endDate,
      name: home.name,
      address: home.address,
      photo: home.photos[0]     // just use the first photo
    };
  
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/homes/api/create-checkout-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  
    const session = await response.json();
  
    stripe.redirectToCheckout({ sessionId: session.id });
  };
  
  
console.log(home)
  

  if (!home) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white rounded-xl shadow-md mt-6 space-y-4">
    <h2 className="text-3xl font-bold text-gray-800">{home.name}</h2>
    <p className="text-gray-600">{home.text}</p>
  
    <div className="text-gray-700 space-y-1">
      <p><strong>City:</strong> {home.city}</p>
      <p><strong>Address:</strong> {home.address}</p>
      <p className="font-semibold text-xl text-green-700">${home.price}</p>
    </div>
  
    <div className="flex flex-wrap gap-4 mt-4">
      {home.photos.map((photo, i) => (
        <img
          key={i}
          src={`${import.meta.env.VITE_API_URL}/${photo}`}
          alt={`Home photo ${i}`}
          className="w-40 h-40 object-cover rounded-lg shadow-sm"
        />
      ))}
    </div>
  
    <button
      onClick={handleOpen}
      className="mt-6 px-6 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition"
    >
      Reserve this Airbnb
    </button>
  
    {bookingPopup && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-40">
        <div className="w-[90%] max-w-4xl bg-white p-8 rounded-xl shadow-xl relative space-y-6 overflow-y-auto max-h-[90vh]">
  
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
          >
            Close
          </button>
  
          <h3 className="text-2xl font-bold text-gray-800">{home.name}</h3>
  
          <div className="flex flex-wrap gap-4">
            {home.photos.map((photo, i) => (
              <img
                key={i}
                src={`${import.meta.env.VITE_API_URL}/${photo}`}
                alt={`Home photo ${i}`}
                className="w-32 h-32 object-cover rounded"
              />
            ))}
          </div>
  
          <p className="text-gray-600 font-medium">City: {home.city}</p>
  
          <BookingCalendar
            home={home}
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
          />
  
          <div className="flex gap-4 mt-4">
            {/* <button
              onClick={handleBooking}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded"
            >
              Submit Booking
            </button> */}
            <button
              onClick={makePayment}
              className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
  
  );
}
