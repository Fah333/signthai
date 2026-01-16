import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Narbar";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";

// 🔹 Pages หลัก
import Home from "./pages/Home";
import Lessons from "./pages/Lessons";
import Exercise from "./pages/Exercise";
import Variouslessons from "./pages/Variouslessons";
import Testexercise from "./pages/Testexercise";

// 🔹 Admin Pages
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import EditLesson from "./pages/EditLesson";
import EditSign from "./pages/EditSign";
import EditExercise from "./pages/EditExercise";
import EditAdmin from "./pages/EditAdmin";
import AddLesson from "./pages/AddLesson";
import AddSign from "./pages/AddSign";
import AddExercise from "./pages/AddExercise";
import AddAdmin from "./pages/AddAdmin";
import Score from "./pages/Score";

// 🔹 User Pages
import Login from "./user/Login";
import UserMenu from "./user/UserMenu";


function App() {
  return (
    <Router>
      <Routes>
        {/* 🔹 หน้า Register / Login / Guest */}
        <Route path="/login" element={<Login />} />
        <Route path="/user-menu" element={<UserMenu />} />

        {/* 🔹 Admin Routes (ไม่มี Navbar / Footer) */}
        <Route path="/admin/admin" element={<Admin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/edit-lesson/:id" element={<EditLesson />} />
        <Route path="/edit-word/:lessonId/:signId" element={<EditSign />} />
        <Route path="/edit-exercise/:id" element={<EditExercise />} />
        <Route path="/edit-admin/:id" element={<EditAdmin />} />
        <Route path="/add-lesson" element={<AddLesson />} />
        <Route path="/add-sign" element={<AddSign />} />
        <Route path="/add-exercise" element={<AddExercise />} />
        <Route path="/add-admin" element={<AddAdmin />} />


        {/* 🔹 ส่วนของผู้ใช้ปกติ (มี Navbar + Footer) */}
        <Route
          path="/*"
          element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/lessons" element={<Lessons />} />
                  <Route path="/exercises" element={<Exercise />} />
                  <Route path="/lessons/:id" element={<Variouslessons />} />
                  <Route
                    path="/exercises/lesson/:lessonNumber"
                    element={<Testexercise />} />
                  <Route path="/score/:userId" element={<Score />} />
                  <Route path="/lesson/:lessonNumber" element={<PrivateRoute element={<Testexercise />} />}
/>
                </Routes>
              </main>
              <Footer />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
