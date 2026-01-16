import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";



function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* เสริม: เพิ่มหน้า Lessons, Practice */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
