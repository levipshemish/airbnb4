import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNav } from "../NavContext";

export default function ServiceUserDetails() {
  const { closeNav } = useNav();
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    category: '',
    subcategory: '',
    price: '',
    location: '',
    duration: ''
  });
  

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await fetch(`http://localhost:5869/api/services/${id}`);
        const data = await res.json();
        setService(data);
        setEditData({
            title: data.title,
            description: data.description,
            category: data.category,
            subcategory: data.subcategory,
            price: data.price,
            location: data.location,
            duration: data.duration
          });
      } catch (err) {
        console.error('Failed to fetch service:', err);
      }
    };

    fetchService();
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
      formData.append('location', editData.location);
      formData.append('duration', editData.duration);

      if (editData.photo) {
        formData.append('photo', editData.photo);
      }

      const res = await fetch(`http://localhost:5869/api/services/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (res.ok) {
        const updated = await res.json();
        setService(updated);
        setIsEditing(false);
      } else {
        console.error('Failed to update service');
      }
    } catch (err) {
      console.error('Error updating service:', err);
    }
  };

  if (!service) return <p>Loading...</p>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto" onClick={closeNav}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-gray-800">{service.title}</h2>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow"
          onClick={() => setIsEditing(true)}
        >
          Edit
        </button>
      </div>

      <p className="text-gray-700 text-base mb-2">{service.description}</p>
      <p className="text-sm text-gray-500 mb-1">
        Category: {service.category} → {service.subcategory}
      </p>
      <p className="text-xl font-semibold text-green-600 mb-4">${service.price}</p>

      {service.photos?.length > 0 && (
        <img
          src={`http://localhost:5869/${service.photos[0]}`}
          alt={service.title}
          className="w-full max-w-3xl h-80 object-cover rounded-xl border"
        />
      )}

      <div>{service.location}</div>
      <div>{service.duration} Hours</div>

      {isEditing && (
        <div className="fixed inset-0 bg-transparent bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Edit Service</h3>
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

            <input
            type="text"
            name="location"
            value={editData.location}
            onChange={handleEditChange}
            placeholder="Location"
            className="w-full mb-2 p-2 border rounded"
            />
            <input
            type="text"
            name="duration"
            value={editData.duration}
            onChange={handleEditChange}
            placeholder="Duration (e.g. 1 hour)"
            className="w-full mb-4 p-2 border rounded"
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
