import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import MenuList from "./pages/MenuList";
import MenuDetail from "./pages/MenuDetail";
import Login from "./auth/Login";
import Register from "./auth/Register";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<MenuList />} />
          <Route path="/menu/:id" element={<MenuDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;