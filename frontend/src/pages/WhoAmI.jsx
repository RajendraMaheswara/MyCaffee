import { useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthProvider";

export default function WhoAmI() {
    const { user, token } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        if (token) {
            api.get("/api/me")
                .then(res => setUserData(res.data.user))
                .catch(err => console.error(err));
        }
    }, [token]);

    if (!token) {
        return <p>Kamu belum login.</p>;
    }

    if (!userData) {
        return <p>Mengambil data...</p>;
    }

    return (
        <div style={{ maxWidth: "400px", margin: "40px auto" }}>
            <h2>Informasi Login</h2>

            <div className="info-box">
                <p><strong>Nama:</strong> {userData.nama_lengkap}</p>
                <p><strong>Username:</strong> {userData.username}</p>
                <p><strong>Email:</strong> {userData.email}</p>
                <p><strong>Role:</strong> {userData.peran}</p>
                <p><strong>Total Stamp:</strong> {userData.total_stamp}</p>
            </div>

            <style>{`
                .info-box {
                    padding: 15px;
                    margin-top: 20px;
                    border-radius: 8px;
                    background: #f5f5f5;
                    border: 1px solid #ddd;
                }
                strong { display: inline-block; width: 120px; }
            `}</style>
        </div>
    );
}