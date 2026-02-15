export default function Card({title, children}){
  return (
    <div style={{border:"1px solid #eee", borderRadius:12, padding:16, background:"#fff"}}>
      <div style={{fontWeight:700, marginBottom:8}}>{title}</div>
      <div>{children}</div>
    </div>
  )
}
