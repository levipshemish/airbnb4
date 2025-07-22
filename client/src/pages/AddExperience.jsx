import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar2 from '../components/Navbar2';
import { useUser } from '../LoginContext';
import { useNavigate } from 'react-router-dom';


const categoryData = {
  "Art and Design": ["Painting", "Photography", "Pottery"],
  "Fitness and Wellness": ["Yoga", "Meditation", "Personal Training"],
  "Food and Drink": ["Cooking Class", "Wine Tasting", "Local Food Tour"],
  "History and Culture": ["City Walk", "Museum Tour", "Storytelling"],
  "Nature and Outdoors": ["Hiking", "Camping", "Wildlife Watching"]
};

const categoryIcons = {
  "Art and Design": "/images/art-svgrepo-com.svg",
  "Fitness and Wellness": "/images/man-lifting-weights-medium-dark-skin-tone-svgrepo-com.svg",
  "Food and Drink": "/images/burger-svgrepo-com.svg",
  "History and Culture": "/images/history-svgrepo-com.svg",
  "Nature and Outdoors": "/images/forest-svgrepo-com.svg",
};


const AddExperience = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [price, setPrice] = useState('');
const [photos, setPhotos] = useState([]);
const [city, setCity] = useState('');
const [address, setAddress] = useState('');
const [maxGuests, setMaxGuests] = useState('');
const navigate = useNavigate();

  const { user } = useUser();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleCategorySelect = (category) => setSelectedCategory(category);
  const handleSubcategorySelect = (sub) => setSelectedSub(sub);
  const handleBack = () => {
    if (showForm) {
      setShowForm(false);
    } else if (selectedSub) {
      setSelectedSub(null);
    } else if (selectedCategory) {
      setSelectedCategory(null);
    } else {
      navigate('/'); // First back — go home
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('category', selectedCategory);
      formData.append('subcategory', selectedSub);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('city', city);
      formData.append('address', address);
      formData.append('maxGuests', maxGuests);

  
      // Append photos
      for (let i = 0; i < photos.length; i++) {
        formData.append('photos', photos[i]);
      }
  
      const res = await fetch('http://localhost:5869/api/experiences', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
          // DO NOT set 'Content-Type' here when using FormData
        },
        body: formData,
      });
  
      const data = await res.json();
      if (res.ok) {
        alert('Experience created!');
        navigate('/myexperiences');
        setShowForm(false);
        setSelectedCategory(null);
        setSelectedSub(null);
        setTitle('');
        setDescription('');
        setPrice('');
        setPhotos([]);
      } else {
        alert(data.error || 'Must fill out all fields.');
      }
    } catch (err) {
      console.error('Error submitting experience:', err);
      alert('Must fill out all fields.');
    }
  };
  console.log(localStorage.getItem('token'))


  return (
    <div>
        <Navbar2 onBackClick={handleBack} />
    <div className="flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-center mb-30 mt-35 font-sans text-gray-800">
        {selectedCategory
          ? selectedSub
            ? `You selected: ${selectedSub}`
            : `Choose a subcategory in ${selectedCategory}`
          : "What experience will you offer guests?"}
      </h1>

      {/* Category Selection */}
      <AnimatePresence>
        {!selectedCategory && (
          <motion.div
            key="categories"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-xl"
          >
            {Object.keys(categoryData).map((category) => (
              <button
                key={category}
                onClick={() => handleCategorySelect(category)}
                className="bg-white flex gap-4 items-center rounded-lg shadow-md p-5 text-center text-lg font-medium text-gray-700 hover:bg-blue-100 transition cursor-pointer"
              >
                  <img src={categoryIcons[category]} alt={category} className="w-10 h-10" />
                <span>{category}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subcategory Selection */}
      <AnimatePresence>
        {selectedCategory && !selectedSub && (
          <motion.div
            key="subcategories"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-xl"
          >
            {categoryData[selectedCategory].map((sub) => (
              <button
                key={sub}
                onClick={() => handleSubcategorySelect(sub)}
                className="bg-white rounded-lg shadow-md p-5 text-center text-lg font-medium text-gray-700 hover:bg-green-100 transition cursor-pointer"
              >
                {sub}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Next Button */}
      {selectedSub && !showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="mt-8 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Next
        </button>
      )}

      {/* Back Button */}
      {(selectedCategory || showForm) && (
        <button
          onClick={handleBack}
          className="mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded transition"
        >
          Back
        </button>
      )}

      {/* Popup Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed left-0 right-0 bottom-0 top-[64px] z-[9998] flex items-center justify-center bg-none bg-opacity-50"
          >
            <div className="bg-white w-[90%] max-w-2xl p-6 rounded-xl relative shadow-2xl">
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Close
              </button>

              <h2 className="text-2xl font-semibold mb-4">
                Add Experience Details
              </h2>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-2"
                />
                <textarea
                  placeholder="Description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-2 h-24"
                />

            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={e => setPrice(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2"
            />

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={e => setPhotos(e.target.files)}
              className="w-full border border-gray-300 rounded px-4 py-2"
            />

              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-2"
              />

              <input
                type="text"
                placeholder="Address"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-2"
              />

              <input
                type="number"
                placeholder="Max Guests"
                value={maxGuests}
                onChange={e => setMaxGuests(e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-2"
              />


                <button
                  onClick={handleSubmit}
                  className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                  Submit Experience
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </div>
  );
};

export default AddExperience;
