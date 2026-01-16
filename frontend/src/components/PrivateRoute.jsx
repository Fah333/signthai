// src/components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("token"); // เช็คว่ามี token ไหม
  if (!token) {
    // ถ้าไม่มี token ให้ไปหน้า login
    return <Navigate to="/login" replace />;
  }
  // ถ้ามี token ให้แสดง component ที่ห่อไว้
  return children;
}
