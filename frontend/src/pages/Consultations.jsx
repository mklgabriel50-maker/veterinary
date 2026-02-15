import { useEffect, useState } from "react";
import { api, getToken } from "../api.js";

export default function Consultations(){
  const [items, setItems] = useState([]);
  const [appts, setAppts] = useState([]);
  const [err, setErr] = useState("");
  const [form, setForm] = useState({appointment_id:"", diagnosis:"", treatment:""});

  async function load(){
    setErr("");
    try{
      const token = getToken();
      const [consults, appointments] = await Promise.all([
        api("/consultations", {token}),
        api("/appointments", {token}),
      ]);
      setItems(consults);
      setAppts(appointments);
      if(!form.appointment_id && appointments[0]) setForm(f=>({...f, appointment_id:String(appointments[0].id)}));
    }catch(ex){ setErr(ex.message); }
  }

  useEffect(()=>{ load(); },[]);

  async function create(e){
    e.preventDefault();
    setErr("");
    try{
      const token = getToken();
      const payload = {
        appointment_id: Number(form.appointment_id),
        diagnosis: form.diagnosis || null,
        treatment: form.treatment || null,
        weight_kg: null,
        temperature_c: null
      };
      await api("/consultations", {method:"POST", token, body:payload});
      setForm(f=>({...f, diagnosis:"", treatment:""}));
      await load();
    }catch(ex){ setErr(ex.message); }
  }

  return (
    <div>
      <h2>Consultații</h2>

      <form onSubmit={create} style={{display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:8, marginBottom:14}}>
        <select value={form.appointment_id} onChange={e=>setForm({...form, appointment_id:e.target.value})}>
          {appts.map(a=><option key={a.id} value={a.id}>Programare #{a.id}</option>)}
        </select>
        <input placeholder="Diagnostic" value={form.diagnosis} onChange={e=>setForm({...form, diagnosis:e.target.value})}/>
        <input placeholder="Tratament" value={form.treatment} onChange={e=>setForm({...form, treatment:e.target.value})}/>
        <button style={{gridColumn:"span 3"}}>Adaugă consultație</button>
      </form>

      {err && <div style={{color:"crimson"}}>{err}</div>}

      <table width="100%" cellPadding="8" style={{borderCollapse:"collapse"}}>
        <thead>
          <tr style={{textAlign:"left", borderBottom:"1px solid #eee"}}>
            <th>ID</th><th>Programare</th><th>Diagnostic</th><th>Tratament</th>
          </tr>
        </thead>
        <tbody>
          {items.map(c=>(
            <tr key={c.id} style={{borderBottom:"1px solid #f3f3f3"}}>
              <td>{c.id}</td>
              <td>{c.appointment_id}</td>
              <td>{c.diagnosis||""}</td>
              <td>{c.treatment||""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
