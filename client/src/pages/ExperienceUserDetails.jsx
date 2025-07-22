import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNav } from "../NavContext";

export default function ExperienceUserDetails() {
  const { closeNav } = useNav();
  const { id } = useParams();
  const [experience, setExperience] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    category: '',
    subcategory: '',
    price: ''
  });

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const res = await fetch(`http://localhost:5869/api/experiences/${id}`);
        const data = await res.json();
        setExperience(data);
        setEditData({
          title: data.title,
          description: data.description,
          category: data.category,
          subcategory: data.subcategory,
          price: data.price
        });
      } catch (err) {
        console.error('Failed to fetch experience:', err);
      }
    };

    fetchExperience();
  }, [id]);

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('title', editData.title);
      formData.append('description', editData.description);
      formData.append('category', editData.category);
      formData.append('subcategory', editData.subcategory);
      formData.append('price', editData.price);

      if (editData.photo) {
        formData.append('photo', editData.photo);
      }

      const res = await fetch(`http://localhost:5869/api/experiences/${id}`, {
        method: 'PUT',
        body: formData,
        headers: {
          // Do NOT set Content-Type here, let browser set it to multipart/form-data
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      });

      if (res.ok) {
        const updated = await res.json();
        setExperience(updated);
        setIsEditing(false);
      } else {
        console.error('Failed to update experience');
      }
    } catch (err) {
      console.error('Error updating experience:', err);
    }
  };

  if (!experience) return <p>Loading...</p>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto" onClick={closeNav}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-gray-800">{experience.title}</h2>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow"
          onClick={() => setIsEditing(true)}
        >
          Edit
        </button>
      </div>

      <p className="text-gray-700 text-base mb-2">{experience.description}</p>
      <p className="text-sm text-gray-500 mb-1">
        Category: {experience.category} → {experience.subcategory}
      </p>
      <p className="text-xl font-semibold text-green-600 mb-4">${experience.price}</p>

      {experience.photos?.length > 0 && (
        <img
          src={`http://localhost:5869/${experience.photos[0]}`}
          alt={experience.title}
          className="w-full max-w-3xl h-80 object-cover rounded-xl border"
        />
      )}

      {/* ✨ EDIT POPUP MODAL */}
      {isEditing && (
        <div className="fixed inset-0 bg-transparent bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Edit Experience</h3>
            <input
              type="text"
              name="title"
              value={editData.title}
              onChange={handleEditChange}
              placeholder="Title"
              className="w-full mb-2 p-2 border rounded"
            />
            <textarea
              name="description"
              value={editData.description}
              onChange={handleEditChange}
              placeholder="Description"
              className="w-full mb-2 p-2 border rounded h-24"
            />
            <input
              type="text"
              name="category"
              value={editData.category}
              onChange={handleEditChange}
              placeholder="Category"
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              name="subcategory"
              value={editData.subcategory}
              onChange={handleEditChange}
              placeholder="Subcategory"
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="number"
              name="price"
              value={editData.price}
              onChange={handleEditChange}
              placeholder="Price"
              className="w-full mb-4 p-2 border rounded"
            />
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={(e) => setEditData({ ...editData, photo: e.target.files[0] })}
              className="w-full mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
