import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SingleDayCalendar from '../components/SingleDayCalendar';
import { loadStripe } from '@stripe/stripe-js';
import { useUser } from '../LoginContext';

export default function SerivceDetails() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [bookingPopup, setBookingPopup] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
    const { user } = useUser()

  useEffect(() => {
    const fetchService = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/services/${id}`);
      const data = await res.json();
      setService(data);
    };
    fetchService();
  }, [id]);

  const handleOpen = () => setBookingPopup(true);
  const handleClose = () => setBookingPopup(false);

  // const makePayment = async () => {
  //   const stripe = await loadStripe('pk_live_51R3ftrGEKXFMczPAOKnKlvR2rySTUpkNoEBIBlDBFoCVjfn4UUB80AzGSd8yfYg5ahOJeeRiWFqrhvZSocl9iL9500MVgwgNID'); // replace with real key

  //   const body = {
  //     products: [
  //       {
  //         name: service.title,
  //         price: service.price,
  //         quantity: 1,
  //       },
  //     ],
  //   };

  //   const headers = {
  //     'Content-Type': 'application/json',
  //   };

  //   const response = await fetch('http://localhost:5869/api/create-checkout-session', {
  //     method: 'POST',
  //     headers: headers,
  //     body: JSON.stringify(body),
  //   });

  //   const session = await response.json();

  //   const result = await stripe.redirectToCheckout({
  //     sessionId: session.id,
  //   });

  //   if (result.error) {
  //     console.log(result.error);
  //   }
  // };
  console.log('STRIPE KEY:', import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

  const makePayment = async () => {
    const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

    const body = {
      products: [
        {
          name: service.title,
          price: service.price,
          quantity: 1,
        },
      ],
      service: {
        serviceId: service._id,
        serviceTitle: service.title,
        serviceLocation: service.location,
        servicePhoto: service.photos?.[0] || '',
        servicePrice: service.price,
        date: selectedDate,
      },
      userId: user._id, // assuming you have user from context
    };
  
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/services/api/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  
    const session = await response.json();
  
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });
  
    if (result.error) {
      console.log(result.error);
    }
  };
  

  if (!service) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white rounded-xl shadow-md mt-6 space-y-4">
      <h2 className="text-3xl font-bold text-gray-800">{service.title}</h2>
      <p className="text-gray-700">{service.description}</p>
      <p className="text-gray-600">
        <strong>Category:</strong> {service.category} → {service.subcategory}
      </p>
      <p className="text-xl font-semibold text-green-700">${service.price}</p>

      <div className="flex flex-wrap gap-4 mt-4">
        {service.photos.map((photo, i) => (
          <img
            key={i}
            src={`${import.meta.env.VITE_API_URL}/${photo}`}
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
              experience={service}
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
