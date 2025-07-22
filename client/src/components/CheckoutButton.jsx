// CheckoutButton.jsx
export default function CheckoutButton() {
    const handleClick = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: 2000 }), // $20.00
      });
  
      const data = await res.json();
      window.location = data.url;
    };
  
    return <button onClick={handleClick}>Buy Now</button>;
  }
  