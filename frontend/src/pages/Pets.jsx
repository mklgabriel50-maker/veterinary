import { useEffect, useState } from "react";
import { api, getToken } from "../api.js";

export default function Pets(){
  const [items, setItems] = useState([]);
  const [owners, setOwners] = useState([]);
  const [err, setErr] = useState("");
  const [form, setForm] = useState({owner_id:"", name:"", species:"dog", breed:"", sex:"", age_years:""});

  async function load(){
    setErr("");
    try{
      const token = getToken();
      const [pets, ownersData] = await Promise.all([
        api("/pets", {token}),
        api("/owners", {token}),
      ]);
      setItems(pets);
      setOwners(ownersData);
      if(!form.owner_id && ownersData[0]) setForm(f=>({...f, owner_id:String(ownersData[0].id)}));
    }catch(ex){ setErr(ex.message); }
  }

  useEffect(()=>{ load(); },[]);

  async function create(e){
    e.preventDefault();
    setErr("");
    try{
      const token = getToken();
      const payload = {
        owner_id: Number(form.owner_id),
        name: form.name,
        species: form.species,
        breed: form.breed || null,
        sex: form.sex || null,
        age_years: form.age_years ? Number(form.age_years) : null
      };
      await api("/pets", {method:"POST", token, body:payload});
      setForm(f=>({...f, name:"", breed:"", sex:"", age_years:""}));
      await load();
    }catch(ex){ setErr(ex.message); }
  }

  const ownerMap = new Map(owners.map(o=>[o.id, o.full_name]));

  return (
    <div>
      <h2>Animale (Pets)</h2>

      <form onSubmit={create} style={{display:"grid", gridTemplateColumns:"repeat(6, 1fr)", gap:8, marginBottom:14}}>
        <select value={form.owner_id} onChange={e=>setForm({...form, owner_id:e.target.value})}>
          {owners.map(o=><option key={o.id} value={o.id}>{o.full_name}</option>)}
        </select>
        <input placeholder="Nume animal" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
        <select value={form.species} onChange={e=>setForm({...form, species:e.target.value})}>
          <option value="dog">Câine</option>
          <option value="cat">Pisică</option>
          <option value="other">Alt</option>
        </select>
        <input placeholder="Rasă" value={form.breed} onChange={e=>setForm({...form, breed:e.target.value})}/>
        <input placeholder="Sex" value={form.sex} onChange={e=>setForm({...form, sex:e.target.value})}/>
        <input placeholder="Vârstă (ani)" value={form.age_years} onChange={e=>setForm({...form, age_years:e.target.value})}/>
        <button style={{gridColumn:"span 6"}}>Adaugă animal</button>
      </form>

      {err && <div style={{color:"crimson"}}>{err}</div>}

      <table width="100%" cellPadding="8" style={{borderCollapse:"collapse"}}>
        <thead>
          <tr style={{textAlign:"left", borderBottom:"1px solid #eee"}}>
            <th>ID</th><th>Owner</th><th>Nume</th><th>Specie</th><th>Rasă</th><th>Sex</th><th>Vârstă</th>
          </tr>
        </thead>
        <tbody>
          {items.map(p=>(
            <tr key={p.id} style={{borderBottom:"1px solid #f3f3f3"}}>
              <td>{p.id}</td>
              <td>{ownerMap.get(p.owner_id) || p.owner_id}</td>
              <td>{p.name}</td>
              <td>{p.species}</td>
              <td>{p.breed||""}</td>
              <td>{p.sex||""}</td>
              <td>{p.age_years ?? ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
