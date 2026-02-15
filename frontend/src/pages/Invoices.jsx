import { useEffect, useState } from "react";
import { api, getToken } from "../api.js";

export default function Invoices(){
  const [items, setItems] = useState([]);
  const [appts, setAppts] = useState([]);
  const [err, setErr] = useState("");
  const [form, setForm] = useState({appointment_id:"", number:"INV-0001", amount:"100", currency:"RON"});

  async function load(){
    setErr("");
    try{
      const token = getToken();
      const [invoices, appointments] = await Promise.all([
        api("/invoices", {token}),
        api("/appointments", {token}),
      ]);
      setItems(invoices);
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
        number: form.number,
        amount: Number(form.amount),
        currency: form.currency,
        status: "unpaid",
        notes: null
      };
      await api("/invoices", {method:"POST", token, body:payload});
      setForm(f=>({...f, number:`INV-${String(Math.floor(Math.random()*9000)+1000)}`, amount:"100"}));
      await load();
    }catch(ex){ setErr(ex.message); }
  }

  return (
    <div>
      <h2>Facturi</h2>

      <form onSubmit={create} style={{display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:8, marginBottom:14}}>
        <select value={form.appointment_id} onChange={e=>setForm({...form, appointment_id:e.target.value})}>
          {appts.map(a=><option key={a.id} value={a.id}>Programare #{a.id}</option>)}
        </select>
        <input placeholder="Număr" value={form.number} onChange={e=>setForm({...form, number:e.target.value})}/>
        <input placeholder="Suma" value={form.amount} onChange={e=>setForm({...form, amount:e.target.value})}/>
        <input placeholder="Monedă" value={form.currency} onChange={e=>setForm({...form, currency:e.target.value})}/>
        <button style={{gridColumn:"span 4"}}>Adaugă factură</button>
      </form>

      {err && <div style={{color:"crimson"}}>{err}</div>}

      <table width="100%" cellPadding="8" style={{borderCollapse:"collapse"}}>
        <thead>
          <tr style={{textAlign:"left", borderBottom:"1px solid #eee"}}>
            <th>ID</th><th>Programare</th><th>Număr</th><th>Suma</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map(i=>(
            <tr key={i.id} style={{borderBottom:"1px solid #f3f3f3"}}>
              <td>{i.id}</td>
              <td>{i.appointment_id}</td>
              <td>{i.number}</td>
              <td>{i.amount} {i.currency}</td>
              <td>{i.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
