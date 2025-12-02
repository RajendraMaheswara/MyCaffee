import { BrowserRouter as Router, Routes, Route, Navigate  } from "react-router-dom";
import Navbar from "./components/Navbar";
import CartSidebar from "./components/CartSidebar"; // IMPORT BARU

import NotFound from "./pages/NotFound";
import GuestRoute from "./routes/GuestRoute";
import RoleRoute from "./routes/RoleRoute";
import Register from "./auth/Register";
import Login from "./auth/Login";
import WhoAmI from "./pages/WhoAmI";

import UserDashboard from "./pages/user/UserDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import KasirDashboard from "./pages/kasir/KasirDashboard";

import MenuManagement from "./pages/admin/MenuManagement"; // Tambahkan ini
import MenuList from "./pages/user/MenuList";
import MenuDetail from "./pages/user/MenuDetail";
import CheckoutPage from "./pages/user/CheckoutPage"; // IMPORT BARU
import ConfirmationPage from "./pages/user/ConfirmationPage"; // IMPORT BARU

import UserManagement from "./pages/admin/UserManagement";
import { useContext } from "react";
import { AuthContext } from "./context/AuthProvider";

function App() {
  const { user } = useContext(AuthContext);
  return (
    <Router>
      <Navbar />
      <CartSidebar />
        <Routes>
          <Route path="/not-found" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />

          <Route path="/register" element={<GuestRoute> <Register /></GuestRoute>} />
          <Route path="/login" element={<GuestRoute> <Login /></GuestRoute>} />
          <Route path="/whoami" element={<WhoAmI />} />

          <Route path="/admin/dashboard" element={ <RoleRoute  roles={['admin']}> <AdminDashboard /> </RoleRoute >}/>
          <Route path="/kasir/dashboard" element={ <RoleRoute  roles={['kasir']}> <KasirDashboard /> </RoleRoute >}/>
          <Route path="/user/dashboard" element={ <RoleRoute  roles={['user']}> <UserDashboard /> </RoleRoute >}/>

          {/* Admin and Kasir cannot access the / route */}
          <Route path="/" element={
            user && (user.peran === 'admin' || user.peran === 'kasir') 
            ? <Navigate to={`/${user.peran}/dashboard`} /> 
            : <MenuList /> 
          } />
          <Route path="/menu/:id" element={<MenuDetail />} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/menu" element={<MenuManagement />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/checkout" element={<CheckoutPage />} /> {/* RUTE BARU */}
          <Route path="/confirmation/:id" element={<ConfirmationPage />} /> {/* RUTE BARU */}
        </Routes>
    </Router>
  );
}

export default App;