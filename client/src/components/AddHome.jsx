import React, { useEffect, useState } from 'react'
import { useNav } from '../NavContext';
import { useUser } from '../LoginContext';
import { useNavigate } from 'react-router-dom';

//make sure user is attach when home is created 

const AddHome = () => {
    const {closeNav} = useNav();
    const { user } = useUser();
    const [name, setName] = useState('')
    const [text, setText] = useState('');
    const [address, setAddress] = useState('')
    const [price, setPrice] = useState('')
    const [photos, setPhotos] = useState([]);
    const [city, setCity] = useState('');
    const [photoPreviews, setPhotoPreviews] = useState([]);
    const [maxGuest, setMaxGuest] = useState('');
    const [homes, setHomes] = useState([])
    const navigate = useNavigate();


    const submit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        
        const formData = new FormData();
        formData.append('name', name);
        formData.append('text', text);
        formData.append('address', address);
        formData.append('price', price);
        formData.append('city', city)
        formData.append('maxGuest', maxGuest);
       

        photos.forEach((photo, i) => {
          formData.append('photos', photo);
        });
      
        const res = await fetch('http://localhost:5869/api/homes', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`, // 🔐 Send the JWT here
          },
          body: formData, // no headers needed
        });
      
        const newHome = await res.json();
        setHomes([...homes, newHome]);
      
        navigate('/myhomes');
        setName('');
        setText('');
        setAddress('');
        setPrice('');
        setPhotos([]);
        setPhotoPreviews([]);
        setCity('')
        setMaxGuest('');
      };

      const handlePhotoChange = (e) => {
        const files = Array.from(e.target.files);
        setPhotos(files);
      
        const previews = files.map(file => URL.createObjectURL(file));
        setPhotoPreviews(previews);
      };

      useEffect(() => {
        return () => {
          photoPreviews.forEach(url => URL.revokeObjectURL(url));
        };
      }, [photoPreviews]);
      

  return (
    <div onClick={closeNav} className="min-h-screen bg-gray-100 p-6 flex justify-center items-start">
    <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-semibold mb-4 text-pink-500">Add a Home</h2>
      
      <form className="space-y-4">
      <div className="space-y-4">
  <div>
    <label className="block mb-1 font-medium">Title</label>
    <input
      type="text"
      placeholder="Title"
      value={name}
      onChange={e => setName(e.target.value)}
      className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
    />
  </div>

  <div>
    <label className="block mb-1 font-medium">Description</label>
    <textarea
      placeholder="Description"
      value={text}
      onChange={e => setText(e.target.value)}
      className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
    />
  </div>

  <div>
    <label className="block mb-1 font-medium">Upload Photos</label>
    <input
      type="file"
      multiple
      accept="image/*"
      onChange={handlePhotoChange}
      className="w-full border border-gray-300 rounded px-4 py-2 bg-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-pink-100 file:text-pink-500 hover:file:bg-pink-200"
    />
    {photoPreviews.length > 0 && (
      <div className="flex gap-4 mt-2 flex-wrap">
        {photoPreviews.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`preview-${i}`}
            className="w-24 h-24 object-cover rounded border"
          />
        ))}
      </div>
    )}
  </div>

  <div>
    <label className="block mb-1 font-medium">Price per Night $</label>
    <input
      type="number"
      min="0"
      placeholder="Price"
      value={price}
      onChange={e => setPrice(e.target.value)}
      className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
    />
  </div>

  <div>
    <label className="block mb-1 font-medium">Max Guests</label>
    <input
      type="number"
      min="0"
      placeholder="Max guests"
      value={maxGuest}
      onChange={e => setMaxGuest(e.target.value)}
      className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
    />
  </div>
<div className='flex gap-4'>
  <div>
    <label className="block mb-1 font-medium">Address</label>
    <input
      type="text"
      placeholder="Address"
      value={address}
      onChange={e => setAddress(e.target.value)}
      className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
    />
  </div>

  <div>
    <label className="block mb-1 font-medium">City</label>
    <input
      type="text"
      placeholder="City"
      value={city}
      onChange={e => setCity(e.target.value)}
      className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
    />
  </div>
</div>
</div>
        
  
        <button
          type="submit"
          onClick={submit}
          className="w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600 transition"
        >
          Submit
        </button>
      </form>
    </div>
  </div>
  
  )
}

export default AddHome
