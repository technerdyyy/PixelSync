import React, { useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar";
import { FaTrash, FaPencilAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import Avatar from "../Components/Avatar"; // Import Avatar component

const artworks = [
  {
    id: 1,
    title: "Enchanted Forest",
    category: "Digital Illustration",
    date: "2 days ago",
    image: "/path-to-image1.jpg",
  },
  {
    id: 2,
    title: "Cyber Warrior",
    category: "Character Design",
    date: "1 week ago",
    image: "/path-to-image2.jpg",
  },
  {
    id: 3,
    title: "Flow State",
    category: "Abstract Art",
    date: "2 weeks ago",
    image: "/path-to-image3.jpg",
  },
];

const UserProfile = () => {
  const { user } = useSelector((state) => state.user);
  const [artworks, setArtworks] = useState([]);

  useEffect(() => {
    const fetchArtworks = async () => {
      if (!user?.email) return;

      try {
        const response = await fetch(
          `http://localhost:5000/user-artworks/${user.email}`
        );
        const data = await response.json();
        setArtworks(data);
      } catch (error) {
        console.error("Error fetching artworks:", error);
      }
    };

    fetchArtworks();
  }, [user]);

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
        <button className="bg-[#6F0081] text-white px-4 py-2 mt-6 rounded-md flex items-center gap-2">
          <FaTrash />
          Delete All
        </button>

        {/* Artwork Gallery */}
        <div className="grid grid-cols-3 gap-6 mt-6">
          {artworks.map((art) => (
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
                <button className="bg-white p-2 rounded-full">
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
      </div>
    </div>
  );
};

export default UserProfile;
