import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [balance, setBalance] = useState(null);
  const [search, setSearch] = useState("");
  const [transferTo, setTransferTo] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // Fetch user list
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/api/v1/account/all-users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        if (res.ok) setUsers(data.users);
        else setError(data.error || "Failed to fetch users");
      } catch (err) {
        setError("Something went wrong while fetching users.");
      }
    };

    fetchUsers();
  }, [token]);

  // Fetch balance
  const fetchBalance = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/v1/account/balance", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) setBalance(data.balance);
      else setError(data.error || "Failed to fetch balance");
    } catch (err) {
      setError("Something went wrong while fetching balance.");
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [token]);

  // Filtered user list for search
  const filteredUsers = users.filter((user) =>
    `${user.firstname} ${user.lastname}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Handle money transfer
  const handleTransfer = async () => {
    setError("");
    setMessage("");

    if (!transferTo || !amount) {
      setError("Please select a user and enter amount.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/v1/account/transfer", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toUsername: transferTo, // 🔁 use username here
          amount: parseFloat(amount),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setAmount("");
        setTransferTo("");
        fetchBalance(); // 🔁 refresh balance after successful transfer
      } else {
        setError(data.error || "Transfer failed");
      }
    } catch (err) {
      setError("Something went wrong while transferring money.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6">
      <h1 className="text-xl font-bold mb-4">Dashboard</h1>

      {/* Balance */}
      <div className="mb-4 text-lg font-medium">
        Your Balance:{" "}
        <span className="text-green-700 font-semibold">
          ₹ {balance ?? "Loading..."}
        </span>
      </div>

      {/* Search Users */}
      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md px-4 py-2 mb-4 border rounded-md"
      />

      {/* User List */}
      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="flex items-center justify-between bg-white p-4 rounded shadow"
          >
            <div>
              <p className="font-semibold">
                {user.firstname} {user.lastname}
              </p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <button
              onClick={() => setTransferTo(user.username)} // 🔁 use username
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              Select
            </button>
          </div>
        ))}
      </div>

      {/* Transfer Form */}
      {transferTo && (
        <div className="mt-6 p-4 border bg-white rounded shadow max-w-md">
          <h3 className="font-bold mb-2">
            Send Money to <span className="text-blue-600">{transferTo}</span>
          </h3>
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full mb-3 px-3 py-2 border rounded"
          />
          <button
            onClick={handleTransfer}
            className="w-full bg-green-600 text-white py-2 rounded"
          >
            Transfer
          </button>
        </div>
      )}

      {/* Success/Error Messages */}
      {message && <div className="mt-4 text-green-600">{message}</div>}
      {error && <div className="mt-4 text-red-600">{error}</div>}
    </div>
  );
};

export default Dashboard;
