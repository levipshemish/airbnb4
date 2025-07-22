export default function Checkout({ homeName, totalPrice }) {
    const handleCheckout = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/create-checkout-session`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ homeName, totalPrice }),
        });
  
        const { url } = await res.json();
  
        console.log('Backend responded with:', url); // Will print "hi"
  
        // ONLY redirect if the URL is real
        if (url.startsWith('http')) {
          window.location = url;
        }
      } catch (err) {
        console.error('Checkout error:', err);
      }
    };
  
    return (
      <button
        onClick={handleCheckout}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Proceed to Payment
      </button>
    );
  }
  