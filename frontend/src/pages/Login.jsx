import { useState } from "react";
import { api, setToken } from "../api.js";
import { useNavigate } from "react-router-dom";

export default function Login(){
  const nav = useNavigate();
  const [email, setEmail] = useState("admin@clinic.ro");
  const [password, setPassword] = useState("parola123");
  const [fullName, setFullName] = useState("Administrator Clinică");
  const [mode, setMode] = useState("login"); // login | signup
  const [err, setErr] = useState("");

  async function submit(e){
    e.preventDefault();
    setErr("");
    try{
      if(mode === "signup"){
        await api("/auth/signup", {method:"POST", body:{email, password, full_name: fullName, role:"admin"}});
      }
      const data = await api("/auth/login", {method:"POST", body:{email, password}});
      setToken(data.access_token);
      nav("/");
    }catch(ex){
      setErr(ex.message);
    }
  }

  return (
    <div style={{maxWidth:520, margin:"40px auto", border:"1px solid #eee", borderRadius:12, padding:18, background:"#fff"}}>
      <h2 style={{marginTop:0}}>Autentificare</h2>

      <div style={{display:"flex", gap:8, marginBottom:12}}>
        <button onClick={()=>setMode("login")} disabled={mode==="login"}>Login</button>
        <button onClick={()=>setMode("signup")} disabled={mode==="signup"}>Creează cont</button>
      </div>

      <form onSubmit={submit} style={{display:"grid", gap:10}}>
        {mode==="signup" && (
          <div>
            <label>Nume complet</label>
            <input value={fullName} onChange={e=>setFullName(e.target.value)} style={{width:"100%", padding:10}} />
          </div>
        )}
        <div>
          <label>Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} style={{width:"100%", padding:10}} />
        </div>
        <div>
          <label>Parolă</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:"100%", padding:10}} />
        </div>
        <button type="submit">{mode==="signup" ? "Creează cont & intră" : "Intră"}</button>
      </form>

      {err && <div style={{marginTop:12, color:"crimson"}}>{err}</div>}
    </div>
  );
}
