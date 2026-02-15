import { useEffect, useState } from "react";
import Card from "../components/Card.jsx";
import { api, getToken } from "../api.js";

export default function Dashboard(){
  const [health, setHealth] = useState("N/A");
  const [counts, setCounts] = useState({owners:0, pets:0, appointments:0});

  useEffect(()=>{
    (async ()=>{
      try{
        const h = await api("/health");
        setHealth(h.status);
      }catch{
        setHealth("N/A");
      }
      try{
        const token = getToken();
        const [owners, pets, appointments] = await Promise.all([
          api("/owners", {token}),
          api("/pets", {token}),
          api("/appointments", {token}),
        ]);
        setCounts({owners: owners.length, pets: pets.length, appointments: appointments.length});
      }catch{
        // ignore if not logged
      }
    })();
  },[]);

  return (
    <div style={{display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:12}}>
      <Card title="Stare API">{health}</Card>
      <Card title="Clienți">{counts.owners}</Card>
      <Card title="Animale">{counts.pets}</Card>
      <Card title="Programări">{counts.appointments}</Card>
      <Card title="Bun venit!">Folosește meniul.</Card>
      <Card title="Tip">Creează cont din /login (tab Creează cont).</Card>
    </div>
  );
}
