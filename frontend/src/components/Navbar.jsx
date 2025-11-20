import { useLocation, Link } from "react-router-dom";

export default function Navbar() {
    const { pathname } = useLocation();

    if (pathname === "/login" || pathname === "/register" || pathname === "/not-found") {
        return null;
    }

    return (
        <nav style={{ padding: "10px", background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "space-between"}}>
          <Link to="/" style={{ textDecoration: "none", fontWeight: "bold" }}>
              ☕ MyCaffee
          </Link>

          <Link to="/login" className="font-semibold hover:underline" style={{ color: "#5C4033" }}>
              Login
          </Link>
        </nav>
    );
}