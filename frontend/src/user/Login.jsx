import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import heroImage from "../assets/hero.webp";
import {jwtDecode} from "jwt-decode";

function UserAuth() {
  const [username, setUsername] = useState(""); // สำหรับ Register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false); // toggle register/login

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const saveUserData = (data) => {
    localStorage.setItem("username", data.username);
    localStorage.setItem("userId", data.user_id);
    if (data.token) localStorage.setItem("token", data.token);

    const userObj = {
      user_id: data.user_id,
      username: data.username,
      token: data.token || ""
    };
    localStorage.setItem("user", JSON.stringify(userObj));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("กรุณากรอก Email ให้ถูกต้อง");
      setLoading(false);
      return;
    }

    try {
      console.log("Login payload:", { email, password });
      const res = await fetch("http://localhost:3000/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: password.trim() }),
      });

      const text = await res.text();
      console.log("Raw response:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }

      if (!res.ok) throw new Error(data.message || "Login failed");

      const decoded = jwtDecode(data.token);

      const userData = {
        user_id: decoded.user_id,
        username: decoded.username,
        token: data.token,
      };

      saveUserData(userData);
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("กรุณากรอก Email ให้ถูกต้อง");
      setLoading(false);
      return;
    }

    if (!username.trim()) {
      setError("กรุณากรอก Username");
      setLoading(false);
      return;
    }

    try {
      console.log("Register payload:", { username, email, password: password.trim() });
      const res = await fetch("http://localhost:3000/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          email,
          password: password.trim(),
        }),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }

      if (!res.ok) throw new Error(data.message || "Register failed");

      // save user data + token และ login อัตโนมัติ
      const userData = {
        user_id: data.user_id,
        username: data.username,
        token: data.token,
      };
      saveUserData(userData);

      navigate(from, { replace: true });
    } catch (err) {
      console.error("Register error:", err);
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
          {isRegister ? "Register" : "Login"}
        </h2>

        {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}

        <form className="w-full space-y-5">
          {isRegister && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />

          <button
            onClick={isRegister ? handleRegister : handleLogin}
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-semibold flex items-center justify-center ${loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"} transition`}
          >
            {loading ? (isRegister ? "Processing..." : "Logging in...") : (isRegister ? "Register" : "Login")}
          </button>

          <p className="text-sm text-gray-600 text-center mt-2">
            {isRegister ? "มีบัญชีแล้ว?" : "ยังไม่มีบัญชี?"}{" "}
            <span
              className="text-blue-500 cursor-pointer hover:underline"
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister ? "Login" : "Register"}
            </span>
          </p>
        </form>

        <button
          onClick={() => navigate("/")}
          className="mt-6 w-full py-2 text-center rounded-xl border border-gray-400 text-gray-700 hover:bg-gray-100 transition"
        >
          กลับไปหน้า Home
        </button>
      </div>
    </div>
  );
}

export default UserAuth;
