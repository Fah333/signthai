// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import heroImage from "../assets/hero.webp";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("กรุณากรอก Email ให้ถูกต้อง");
      setLoading(false);
      return;
    }

    if (!username) {
      setError("กรุณากรอก Username");
      setLoading(false);
      return;
    }

    try {
      console.log("Email:", email, "Password:", password);
      console.log("Trimmed password:", password.trim());
      
      const res = await fetch("http://localhost:3000/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Register failed");

      // สมัครสำเร็จ → navigate ไปหน้า Login พร้อม auto fill email
      navigate("/login", { state: { email } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100 bg-cover bg-center relative"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative z-10 w-full max-w-sm sm:max-w-md bg-white/95 backdrop-blur-md p-10 rounded-3xl shadow-2xl flex flex-col items-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-8">
          Register
        </h2>

        {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}

        <form className="w-full space-y-5" onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-semibold flex items-center justify-center ${loading ? "bg-green-300 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
              } transition`}
          >
            {loading ? "Processing..." : "Register"}
          </button>
        </form>

        <button
          onClick={() => navigate("/login")}
          className="mt-6 w-full py-2 text-center rounded-xl border border-gray-400 text-gray-700 hover:bg-gray-100 transition"
        >
          กลับไปหน้า Login
        </button>
      </div>
    </div>
  );
}

export default Register;
