import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar2 from '../components/Navbar2';
import { useUser } from '../LoginContext';
import { useNavigate } from 'react-router-dom';

const serviceCategoryData = {
  "Home Services": ["Plumbing", "Cleaning", "Electrician"],
  "Beauty & Wellness": ["Haircut", "Massage", "Nails"],
  "Tech Support": ["Computer Repair", "Phone Setup", "WiFi Help"],
  "Tutoring": ["Math", "English", "Coding"],
  "Events": ["Photography", "DJ", "Catering"]
};

const serviceCategoryIcons = {
  "Home Services": "/images/tools-hammer-svgrepo-com.svg",
  "Beauty & Wellness": "/images/makeup-woman-svgrepo-com.svg",
  "Tech Support": "/images/computer-svgrepo-com.svg",
  "Tutoring": "/images/teacher-female-svgrepo-com.svg",
  "Events": "/images/party-popper-svgrepo-com.svg",
};


export default function AddService() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [photos, setPhotos] = useState([]);
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState("");
  const { user } = useUser();
  const navigate = useNavigate();


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
      formData.append("category", selectedCategory);
      formData.append("subcategory", selectedSub);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("location", location);
      formData.append("duration", duration);
      for (let i = 0; i < photos.length; i++) {
        formData.append("photos", photos[i]);
      }

      const res = await fetch("http://localhost:5869/api/services", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: formData
      });

      const data = await res.json();
      if (res.ok) {
        alert("Service created!");
        navigate('/myservices');
        setShowForm(false);
        setSelectedCategory(null);
        setSelectedSub(null);
        setTitle('');
        setDescription('');
        setPrice('');
        setPhotos([]);
        setLocation('');
        setDuration('');
      } else {
        alert(data.error || 'Must Fill Out All Fields');
      }
    } catch (err) {
      console.error(err);
      alert("Must Fill out all Fields.");
    }
  };

  return (
    <div>
      <Navbar2 onBackClick={handleBack} />
      <div className="flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-bold font-sans text-center mt-35 mb-30 text-gray-800">
          {selectedCategory
            ? selectedSub
              ? `Service: ${selectedSub}`
              : `Choose a subcategory in ${selectedCategory}`
            : "What service are you offering?"}
        </h1>

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
              {Object.keys(serviceCategoryData).map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className="bg-white flex gap-4 items-center rounded-lg shadow-md p-5 text-center text-lg font-medium text-gray-700 hover:bg-blue-100 transition cursor-pointer"
                >
                  <img
                      src={serviceCategoryIcons[category]}
                      alt={category}
                      className="w-10 h-10"
                    />
                    <span>{category}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

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
              {serviceCategoryData[selectedCategory].map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSelectedSub(sub)}
                  className="bg-white rounded-lg shadow-md p-5 text-center text-lg font-medium text-gray-700 hover:bg-green-100 transition cursor-pointer"
                >
                  {sub}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {selectedSub && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="mt-8 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Next
          </button>
        )}

        {(selectedCategory || showForm) && (
          <button
            onClick={handleBack}
            className="mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded transition"
          >
            Back
          </button>
        )}

        <AnimatePresence>
          {showForm && (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-30"
            >
              <div className="bg-white w-[90%] max-w-2xl p-6 rounded-xl relative shadow-2xl">
                <button
                  onClick={() => setShowForm(false)}
                  className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Close
                </button>

                <h2 className="text-2xl font-semibold mb-4">Add Service Details</h2>

                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border border-gray-300 rounded px-4 py-2"
                  />
                  <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border border-gray-300 rounded px-4 py-2 h-24"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full border border-gray-300 rounded px-4 py-2"
                  />
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setPhotos(e.target.files)}
                    className="w-full border border-gray-300 rounded px-4 py-2"
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full border border-gray-300 rounded px-4 py-2"
                  />
                  <input
                    type="text"
                    placeholder="Duration (e.g. 1 hour)"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full border border-gray-300 rounded px-4 py-2"
                  />

                  <button
                    onClick={handleSubmit}
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                  >
                    Submit Service
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
