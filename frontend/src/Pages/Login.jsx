import React, { useState } from "react";
import image from "../assets/image.png"; // Ensure the correct path
import user from "../assets/user.png"; // Ensure the correct path
import axios from "axios";
const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", data);
      alert(response.data.message); // Show success message
      localStorage.setItem("token", response.data.token); // Store token
    } catch (error) {
      alert("Error: " + (error.response?.data?.error || "Something went wrong"));
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-black px-4">
      <div className="flex flex-col md:flex-row bg-[#222222] text-white rounded-[65px] shadow-lg w-full max-w-4xl">
        
        {/* Left Side (Image) */}
        <div className="hidden md:flex md:w-1/2 bg-purple-400 items-center justify-center rounded-[65px] overflow-hidden">
          <img src={image} alt="Background" className="w-full h-full object-cover" />
        </div>

        {/* Right Side (Form) */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
          <h1 className="text-xl md:text-2xl font-bold mb-4 text-center font-tiro-telugu text-[#FBE6FF]">
            PixelSync
          </h1>
          
          <div className="flex justify-center mb-4">
            <img src={user} alt="user" className="w-[80px] h-[70px]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block text-gray-300">Email</label>
              <input
                type="email"
                name="email"
                value={data.email}
                onChange={handleOnChange}
                required
                className="w-full max-w-md rounded-[15px] bg-[#222222] border border-white/20 p-3 focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-gray-300">Password</label>
              <input
                type="password"
                name="password"
                value={data.password}
                onChange={handleOnChange}
                required
                className="w-full max-w-md rounded-[15px] bg-[#222222] border border-white/20 p-3 focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              type="submit"
              className="w-full max-w-md rounded-[15px] bg-[#6F0081] border border-white/20 p-3 hover:bg-[#5a0067] transition"
            >
              Login
            </button>

            <p className="text-center text-sm mt-2">
              New here?{" "}
              <a href="#" className="text-purple-400 hover:underline">Register</a>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
