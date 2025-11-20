import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import NotFound from "./pages/NotFound";
import GuestRoute from "./routes/GuestRoute";
import RoleRoute from "./routes/RoleRoute";
import Register from "./auth/Register";
import Login from "./auth/Login";
import WhoAmI from "./pages/WhoAmI";

import UserDashboard from "./pages/user/UserDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import KasirDashboard from "./pages/kasir/KasirDashboard";

import MenuList from "./pages/MenuList";
import MenuDetail from "./pages/MenuDetail";

function App() {
  return (
    <Router>
      <Navbar />
        <Routes>
          <Route path="/not-found" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />

          <Route path="/register" element={<GuestRoute> <Register /></GuestRoute>} />
          <Route path="/login" element={<GuestRoute> <Login /></GuestRoute>} />
          <Route path="/whoami" element={<WhoAmI />} />

          <Route path="/admin/dashboard" element={ <RoleRoute  roles={['admin']}> <AdminDashboard /> </RoleRoute >}/>
          <Route path="/kasir/dashboard" element={ <RoleRoute  roles={['kasir']}> <KasirDashboard /> </RoleRoute >}/>
          <Route path="/user/dashboard" element={ <RoleRoute  roles={['user']}> <UserDashboard /> </RoleRoute >}/>

          <Route path="/" element={<MenuList />} />
          <Route path="/menu/:id" element={<MenuDetail />} />
        </Routes>
    </Router>
  );
}

export default App;