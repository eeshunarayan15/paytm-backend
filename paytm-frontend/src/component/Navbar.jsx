import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">
          Paytm Clone
        </Link>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="focus:outline-none text-xl"
          >
            ☰
          </button>
        </div>

        {/* Nav Links */}
        <div
          className={`md:flex items-center space-x-6 ${
            isOpen ? "block mt-4" : "hidden md:flex"
          }`}
        >
          <Link to="/" className="block py-1 hover:underline">
            Home
          </Link>
          <Link to="/login" className="block py-1 hover:underline">
            Login
          </Link>
          <Link to="/signup" className="block py-1 hover:underline">
            Signup
          </Link>
          <Link to="/profile" className="block py-1 hover:underline">
            Profile
          </Link>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
