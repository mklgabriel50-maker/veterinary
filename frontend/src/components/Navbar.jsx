import { Link, useNavigate } from "react-router-dom";
import { clearToken, getToken } from "../api.js";

export default function Navbar(){
  const nav = useNavigate();
  const token = getToken();

  function logout(){
    clearToken();
    nav("/login");
  }

  return (
    <div style={{borderBottom:"1px solid #eee", padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between"}}>
      <div style={{display:"flex", gap:12, alignItems:"center"}}>
        <strong>Vet Clinic</strong>
        <Link to="/">Dashboard</Link>
        <Link to="/owners">Clienți</Link>
        <Link to="/pets">Animale</Link>
        <Link to="/appointments">Programări</Link>
        <Link to="/consultations">Consultații</Link>
        <Link to="/invoices">Facturi</Link>
      </div>
      <div>
        {token ? (
          <button onClick={logout}>Logout</button>
        ) : (
          <Link to="/login"><button>Autentificare</button></Link>
        )}
      </div>
    </div>
  );
}
