import { useEffect, useState } from "react";
import { api, getToken } from "../api.js";

export default function Appointments(){
  const [items, setItems] = useState([]);
  const [pets, setPets] = useState([]);
  const [err, setErr] = useState("");
  const [form, setForm] = useState({pet_id:"", scheduled_at:"", reason:""});

  async function load(){
    setErr("");
    try{
      const token = getToken();
      const [appts, petsData] = await Promise.all([
        api("/appointments", {token}),
        api("/pets", {token}),
      ]);
      setItems(appts);
      setPets(petsData);
      if(!form.pet_id && petsData[0]) setForm(f=>({...f, pet_id:String(petsData[0].id)}));
    }catch(ex){ setErr(ex.message); }
  }

  useEffect(()=>{ load(); },[]);

  async function create(e){
    e.preventDefault();
    setErr("");
    try{
      const token = getToken();
      const payload = {
        pet_id: Number(form.pet_id),
        scheduled_at: new Date(form.scheduled_at).toISOString(),
        reason: form.reason || null,
        status: "scheduled",
        notes: null
      };
      await api("/appointments", {method:"POST", token, body:payload});
      setForm(f=>({...f, scheduled_at:"", reason:""}));
      await load();
    }catch(ex){ setErr(ex.message); }
  }

  const petMap = new Map(pets.map(p=>[p.id, p.name]));

  return (
    <div>
      <h2>Programări</h2>

      <form onSubmit={create} style={{display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:8, marginBottom:14}}>
        <select value={form.pet_id} onChange={e=>setForm({...form, pet_id:e.target.value})}>
          {pets.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <input type="datetime-local" value={form.scheduled_at} onChange={e=>setForm({...form, scheduled_at:e.target.value})}/>
        <input placeholder="Motiv" value={form.reason} onChange={e=>setForm({...form, reason:e.target.value})}/>
        <button>Adaugă programare</button>
      </form>

      {err && <div style={{color:"crimson"}}>{err}</div>}

      <table width="100%" cellPadding="8" style={{borderCollapse:"collapse"}}>
        <thead>
          <tr style={{textAlign:"left", borderBottom:"1px solid #eee"}}>
            <th>ID</th><th>Animal</th><th>Data</th><th>Status</th><th>Motiv</th>
          </tr>
        </thead>
        <tbody>
          {items.map(a=>(
            <tr key={a.id} style={{borderBottom:"1px solid #f3f3f3"}}>
              <td>{a.id}</td>
              <td>{petMap.get(a.pet_id) || a.pet_id}</td>
              <td>{new Date(a.scheduled_at).toLocaleString()}</td>
              <td>{a.status}</td>
              <td>{a.reason||""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
