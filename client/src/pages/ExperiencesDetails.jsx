import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SingleDayCalendar from '../components/SingleDayCalendar';
import { loadStripe } from '@stripe/stripe-js';
import { useUser } from '../LoginContext';

export default function ExperienceDetails() {
  const { id } = useParams();
  const [experience, setExperience] = useState(null);
  const [bookingPopup, setBookingPopup] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    const fetchExperience = async () => {
      const res = await fetch(`http://localhost:5869/api/experiences/${id}`);
      const data = await res.json();
      setExperience(data);
    };
    fetchExperience();
  }, [id]);

  const handleOpen = () => setBookingPopup(true);
  const handleClose = () => setBookingPopup(false);


  const makePayment = async () => {
    if (!selectedDate) return alert('Please select a date');
    if (!user) return alert('You must be logged in to book');
  
    const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  
    const body = {
      products: [
        {
          name: experience.title,
          price: experience.price,
          quantity: 1,
        },
      ],
      experienceId: experience._id,
      experienceTitle: experience.title,
      experienceAddress: experience.address,
      experiencePhoto: experience.photos[0],
      userId: user._id,
      date: selectedDate,
    };
  
    const headers = {
      'Content-Type': 'application/json',
    };
  
    try {
      const response = await fetch('http://localhost:5869/api/experiences/api/create-checkout-session', {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
  
      const session = await response.json();
  
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });
  
      if (result.error) {
        console.error(result.error.message);
        alert('Stripe Checkout error: ' + result.error.message);
      }
    } catch (error) {
      console.error('Payment Error:', error);
      alert('Something went wrong with payment');
    }
  };

  if (!experience) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white rounded-xl shadow-md mt-6 space-y-4">
      <h2 className="text-3xl font-bold text-gray-800">{experience.title}</h2>
      <p className="text-gray-700">{experience.description}</p>
      <p className="text-gray-600">
        <strong>Category:</strong> {experience.category} → {experience.subcategory}
      </p>
      <p className="text-xl font-semibold text-green-700">${experience.price}</p>

      <div className="flex flex-wrap gap-4 mt-4">
        {experience.photos.map((photo, i) => (
          <img
            key={i}
            src={`http://localhost:5869/${photo}`}
            alt={`Experience ${i}`}
            className="w-40 h-40 object-cover rounded-lg shadow-sm"
          />
        ))}
      </div>

      <button
        onClick={handleOpen}
        className="mt-6 px-6 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition"
      >
        Book This Experience
      </button>

      {bookingPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-40">
          <div className="w-[90%] max-w-3xl bg-white p-6 rounded-xl shadow-lg relative space-y-4">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Close
            </button>

            <SingleDayCalendar
              experience={experience}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />

            {selectedDate && (
              <button
                onClick={makePayment}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded mt-4"
              >
                  Proceed to Checkout
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
