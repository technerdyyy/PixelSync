import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import image from "../assets/image.png";

const Register = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("data", data);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/register`,
        data
      );

      alert(response.data.message); // Success message
      if (response.data.success) {
        setData({
          name: "",
          email: "",
          password: "",
        });
        navigate("/login");
      }
    } catch (error) {
      alert(
        "Error: " + (error.response?.data?.message || "Something went wrong")
      );
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-black px-4">
      <div className="flex flex-col md:flex-row bg-[#222222] text-white rounded-[65px] shadow-lg w-full max-w-4xl">
        {/* Left Side (Image) */}
        <div className="md:block md:w-1/2 bg-purple-400 flex items-center justify-center rounded-[65px] overflow-hidden">
          <img
            src={image}
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Side (Form) */}
        <div className="w-full md:w-3/5 p-6 md:p-8">
          <h1 className="text-xl font-tiro-telugu md:text-2xl font-bold mb-4 text-center">
            PixelSync
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-300">Full Name</label>
              <input
                type="text"
                name="name"
                value={data.name}
                onChange={handleOnChange}
                required
                className="w-full rounded-[15px] bg-[#222222] border border-white/20 opacity-100 box-border p-4"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-300">Email</label>
              <input
                type="email"
                name="email"
                value={data.email}
                onChange={handleOnChange}
                required
                className="w-full rounded-[15px] bg-[#222222] border border-white/20 opacity-100 box-border p-4"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-300">Password</label>
              <input
                type="password"
                name="password"
                value={data.password}
                onChange={handleOnChange}
                required
                className="w-full rounded-[15px] bg-[#222222] border border-white/20 opacity-100 box-border p-4"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-[15px] bg-[#6F0081] border border-white/20 opacity-100 box-border p-4"
            >
              Create Account
            </button>

            <p className="text-center text-sm mt-4">
              Already have an account?{" "}
              <Link to={"/login"} className="text-purple-400">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
