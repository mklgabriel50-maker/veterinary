import { useEffect, useState } from "react";
import { api, getToken } from "../api.js";

export default function Owners(){
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [form, setForm] = useState({full_name:"", phone:"", email:"", address:""});

  async function load(){
    setErr("");
    try{
      const token = getToken();
      const data = await api("/owners", {token});
      setItems(data);
    }catch(ex){ setErr(ex.message); }
  }

  useEffect(()=>{ load(); },[]);

  async function create(e){
    e.preventDefault();
    setErr("");
    try{
      const token = getToken();
      await api("/owners", {method:"POST", token, body:form});
      setForm({full_name:"", phone:"", email:"", address:""});
      await load();
    }catch(ex){ setErr(ex.message); }
  }

  return (
    <div>
      <h2>Clienți (Owners)</h2>

      <form onSubmit={create} style={{display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:8, marginBottom:14}}>
        <input placeholder="Nume complet" value={form.full_name} onChange={e=>setForm({...form, full_name:e.target.value})}/>
        <input placeholder="Telefon" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})}/>
        <input placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
        <input placeholder="Adresă" value={form.address} onChange={e=>setForm({...form, address:e.target.value})}/>
        <button style={{gridColumn:"span 4"}}>Adaugă client</button>
      </form>

      {err && <div style={{color:"crimson"}}>{err}</div>}

      <table width="100%" cellPadding="8" style={{borderCollapse:"collapse"}}>
        <thead>
          <tr style={{textAlign:"left", borderBottom:"1px solid #eee"}}>
            <th>ID</th><th>Nume</th><th>Telefon</th><th>Email</th><th>Adresă</th>
          </tr>
        </thead>
        <tbody>
          {items.map(o=>(
            <tr key={o.id} style={{borderBottom:"1px solid #f3f3f3"}}>
              <td>{o.id}</td><td>{o.full_name}</td><td>{o.phone||""}</td><td>{o.email||""}</td><td>{o.address||""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
