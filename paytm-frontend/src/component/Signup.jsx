import React, { useState } from "react";

const Signup = () => {
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    role: "",
  });
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        console.log("Form submitted with data:", data);

        try {
           
               const response = await fetch(
                 "http://localhost:3000/api/v1/user/signup",
                 {
                   method: "POST",
                   headers: {
                     "Content-Type": "application/json",
                   },
                   body: JSON.stringify(data),
                 }
               );

               if (response.ok) {
                   const result = await response.json();
                   localStorage.setItem("token",result.token)
                   console.log("Signup successful:", result);
                    setData({
                      username: "",
                      email: "",
                      password: "",
                      firstname: "",
                      lastname: "",
                      role: "",
                    });
                  
               } else {
                 console.error("Signup failed:", response.statusText);
               }
            

         
           
        } catch (error) {
            console.error("Error during form submission:", error);
        }
    };

    
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-red-600 mb-6">
          Signup
        </h1>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter username"
            onChange={(e) => setData({ ...data, username: e.target.value })}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="email"
            id="email"
            onChange={(e) => setData({ ...data, email: e.target.value })}
            name="email"
            placeholder="Enter email"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="password"
            id="password"
            onChange={(e) => setData({ ...data, password: e.target.value })}
            name="password"
            placeholder="Enter password"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="text"
            id="firstname"
                      name="firstname"
            onChange={(e) => setData({ ...data, firstname: e.target.value })}
            placeholder="Enter first name"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="text"
            id="lastname"
                      name="lastname"
            onChange={(e) => setData({ ...data, lastname: e.target.value })}
            placeholder="Enter last name"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <select
            id="role"
            name="role"
                      required
            onChange={(e) => setData({ ...data, role: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          >
            <option value="">Select role</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="user">User</option>
          </select>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
