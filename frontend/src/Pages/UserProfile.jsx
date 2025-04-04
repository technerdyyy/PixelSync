import React, { useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar";
import { FaTrash, FaPencilAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import Avatar from "../Components/Avatar"; // Import Avatar component


const UserProfile = () => {
  const { user } = useSelector((state) => state.user);
  const [artworks, setArtworks] = useState([]);

  useEffect(() => {
    const fetchArtworks = async () => {
      if (!user?.email) return;

      try {
        const response = await fetch(`http://localhost:5000/api/user-artworks/${user.email}`);
        const data = await response.json();

        if (Array.isArray(data)) {
          setArtworks(data);
        } else {
          setArtworks([]); // Fallback to empty array if response is not an array
        }
      } catch (error) {
        console.error("Error fetching artworks:", error);
        setArtworks([]); // Prevents map() errors by ensuring an empty array
      }
    };

    fetchArtworks();
  }, [user]);

  const handleDeleteAll = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/delete-all-artworks/${user.email}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setArtworks([]); // Clear UI after deletion
      } else {
        console.error("Failed to delete artworks");
      }
    } catch (error) {
      console.error("Error deleting artworks:", error);
    }
  };

  const handleDeleteArtwork = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/delete-artwork/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setArtworks((prev) => prev.filter((art) => art._id !== id));
      } else {
        console.error("Failed to delete artwork");
      }
    } catch (error) {
      console.error("Error deleting artwork:", error);
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        {/* Profile Card */}
        <div className="bg-[#FBE6FF] shadow-md p-6 rounded-lg flex items-center gap-6">
          <Avatar name={user?.name || "Guest User"} width={80} height={80} />
          <div>
            <h2 className="text-xl font-bold">{user?.name || "Guest User"}</h2>
            <p className="text-gray-600 text-sm">
              {user?.email || "No email available"}
            </p>
            <p className="text-lg font-bold mt-2">{artworks.length}</p>
            <span className="text-gray-500">Artworks</span>
          </div>
        </div>

        {/* Delete All Button */}
        {artworks.length > 0 && (
          <button
            onClick={handleDeleteAll}
            className="bg-[#6F0081] text-white px-4 py-2 mt-6 rounded-md flex items-center gap-2"
          >
            <FaTrash />
            Delete All
          </button>
        )}

        {/* Artwork Gallery */}
        {artworks.length === 0 ? (
          <p className="text-gray-500 mt-6">No artworks yet.</p>
        ) : (
          <div className="grid grid-cols-3 gap-6 mt-6">
            {Array.isArray(artworks) &&
              artworks.map((art) => (
                <div key={art._id} className="relative group">
                  <img
                    src={art.image}
                    alt={art.title}
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex justify-center items-center gap-4 transition">
                    <button className="bg-white p-2 rounded-full">
                      <FaPencilAlt className="text-gray-800" />
                    </button>
                    <button
                      className="bg-white p-2 rounded-full"
                      onClick={() => handleDeleteArtwork(art._id)}
                    >
                      <FaTrash className="text-red-600" />
                    </button>
                  </div>
                  <div className="mt-2">
                    <h3 className="font-semibold">{art.title}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(art.createdAt).toDateString()}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
