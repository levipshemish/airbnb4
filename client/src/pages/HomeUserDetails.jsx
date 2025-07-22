import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNav } from "../NavContext";

export default function HomeUserDetails() {
  const {closeNav} = useNav()
  const { id } = useParams();
  const [home, setHome] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    text: '',
    address: '',
    price: ''
  });

  useEffect(() => {
    const fetchHome = async () => {
      try {
        const res = await fetch(`http://localhost:5869/api/homes/${id}`);
        const data = await res.json();
        setHome(data);
        setEditData({
          name: data.name,
          text: data.text,
          address: data.address,
          price: data.price
        });
      } catch (err) {
        console.error('Failed to fetch home:', err);
      }
    };

    fetchHome();
  }, [id]);

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('name', editData.name);
      formData.append('text', editData.text);
      formData.append('address', editData.address);
      formData.append('price', editData.price);
  
      if (editData.photo) {
        formData.append('photo', editData.photo);
      }
  
      const res = await fetch(`http://localhost:5869/api/homes/${id}`, {
        method: 'PUT',
        body: formData,
      });
  
      if (res.ok) {
        const updated = await res.json();
        setHome(updated);
        setIsEditing(false);
      } else {
        console.error('Failed to update home');
      }
    } catch (err) {
      console.error('Error updating home:', err);
    }
  };
  

  if (!home) return <p>Loading...</p>;

  return (
        <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto" onClick={closeNav}>
    <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-gray-800">{home.name}</h2>
        <button
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow"
        onClick={() => setIsEditing(true)}
        >
        Edit
        </button>
    </div>

    <p className="text-gray-700 text-base mb-2">{home.text}</p>
    <p className="text-sm text-gray-500 mb-1">📍 {home.address}</p>
    <p className="text-xl font-semibold text-green-600 mb-4">${home.price}</p>

    {home.photos?.length > 0 && (
        <img
        src={`http://localhost:5869/${home.photos[0]}`}
        alt="Home"
        className="w-full max-w-3xl h-80 object-cover rounded-xl border"
        />
    )}



      {/* ✨ EDIT POPUP MODAL */}
      {isEditing && (
        <div className="fixed inset-0 bg-transparent bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Edit Home</h3>
            <input
              type="text"
              name="name"
              value={editData.name}
              onChange={handleEditChange}
              placeholder="Name"
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              name="text"
              value={editData.text}
              onChange={handleEditChange}
              placeholder="Description"
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              name="address"
              value={editData.address}
              onChange={handleEditChange}
              placeholder="Address"
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
