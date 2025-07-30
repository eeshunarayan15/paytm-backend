import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/v1/account/profile",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Send token in header
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setProfile(data);
          console.log("Profile fetched:", data);
        } else {
            if (response.status === 401) {
                // Unauthorized, redirect to login
                navigate("/login");
            }
          console.error("Failed to fetch profile:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token]);

  if (!profile) return <div>Loading profile...</div>;

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">
        Welcome, {profile.user.firstname}!
      </h2>
      <p>
        <strong>Username:</strong> {profile.user.username}
      </p>
      <p>
        <strong>Email:</strong> {profile.user.email}
      </p>
      <p>
        <strong>Role:</strong> {profile.user.role}
      </p>
      <p>
        <strong>Wallet Balance:</strong> ₹{profile.wallet.balance}
      </p>
    </div>
  );
};

export default Profile;
