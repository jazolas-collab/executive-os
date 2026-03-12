import { useState, useRef, useEffect } from "react";

// ─── THEME ──────────────────────────────────────────────────────────
const C = {
  bg:"#0a0b0d",surface:"#111318",surfaceHover:"#161820",
  border:"#1e2028",borderHover:"#2e3140",
  accent:"#c8a96e",accentDim:"#8a7248",accentBg:"#c8a96e18",
  text:"#e8eaf0",textMuted:"#6b7280",textDim:"#9ca3af",
  danger:"#ef4444",dangerBg:"#ef444418",
  success:"#10b981",successBg:"#10b98118",
  warn:"#f59e0b",warnBg:"#f59e0b18",
  blue:"#3b82f6",blueBg:"#3b82f618",
  purple:"#8b5cf6",purpleBg:"#8b5cf618",
};
const STAGE_COLOR = {SQL:C.blue,Opportunity:C.warn,Closing:C.success};
const STAGE_BG    = {SQL:C.blueBg,Opportunity:C.warnBg,Closing:C.successBg};
const PRIORITY_ORDER = {Alta:0,Media:1,Baja:2};
const PRIORITY_COLOR = {Alta:C.danger,Media:C.warn,Baja:C.success};
const PRIORITY_BG    = {Alta:C.dangerBg,Media:C.warnBg,Baja:C.successBg};
const SOURCE_ICON    = {email:"✉",whatsapp:"💬",llamada:"📞",manual:"✏️",reunion:"🤝"};
const STAGES = ["SQL","Opportunity","Closing"];

// ─── DEALS DATA ───────────────────────────────────────────────────────
const INITIAL_DEALS = [
  {id:"57829895285",clientName:"CVDCH",         name:"Eliminar Webpay para Talleres",          value:0,      stage:"SQL",        closedate:"2026-05-08",currency:"USD"},
  {id:"57565295782",clientName:"eClass",        name:"Renovación plataforma e-learning",       value:79237,  stage:"SQL",        closedate:"2026-04-30",currency:"USD"},
  {id:"56645062937",clientName:"INACAP",        name:"Integración sistema académico",          value:291602, stage:"SQL",        closedate:"2026-07-16",currency:"USD"},
  {id:"56427453851",clientName:"Iplacex",       name:"Iplacex | Bettersoft",                  value:0,      stage:"SQL",        closedate:"2026-04-17",currency:"USD"},
  {id:"56045038894",clientName:"INAF",          name:"Licencias plataforma 2026",             value:22080,  stage:"SQL",        closedate:"2026-04-30",currency:"USD"},
  {id:"55063177506",clientName:"U. Adventista", name:"Universidad Adventista de Chile",        value:108417, stage:"SQL",        closedate:"2026-04-30",currency:"USD"},
  {id:"54970719106",clientName:"UAI",           name:"Expansión módulo financiero",           value:541106, stage:"SQL",        closedate:"2026-06-30",currency:"USD"},
  {id:"54342803102",clientName:"Esc. Moderna",  name:"Escuela Moderna de Música y Danza",     value:37854,  stage:"SQL",        closedate:"2026-04-16",currency:"USD"},
  {id:"35360869551",clientName:"PdV PRM",       name:"Preuniversitario Pedro de Valdivia PRM",value:489880, stage:"SQL",        closedate:"2026-07-31",currency:"USD"},
  {id:"41693726979",clientName:"U. del Alba",   name:"Universidad del Alba",                  value:147360, stage:"Opportunity",closedate:"2026-04-30",currency:"USD"},
  {id:"35835601316",clientName:"IPP",           name:"Instituto Profesional IPP",             value:110343, stage:"Opportunity",closedate:"2026-03-31",currency:"USD"},
  {id:"57392282457",clientName:"IPG",           name:"IPG - TNE",                             value:1530,   stage:"Closing",    closedate:"2026-03-20",currency:"USD"},
  {id:"56920380426",clientName:"UVM",           name:"Universidad Viña del Mar - PRM 2026",   value:52906,  stage:"Closing",    closedate:"2026-03-31",currency:"USD"},
  {id:"53858328868",clientName:"IPSS",          name:"Instituto Profesional San Sebastián",   value:10439,  stage:"Closing",    closedate:"2026-01-28",currency:"USD"},
  {id:"48177392163",clientName:"DS Chillán",    name:"DS Chillán",                            value:26492,  stage:"Closing",    closedate:"2026-05-31",currency:"USD"},
  {id:"41538242568",clientName:"IPSS CIISA",    name:"Instituto Profesional San Sebastián (CIISA)",value:16070,stage:"Closing", closedate:"2026-01-07",currency:"USD"},
  {id:"32300592005",clientName:"U. Magallanes", name:"Universidad de Magallanes",             value:61747,  stage:"Closing",    closedate:"2026-02-06",currency:"USD"},
];

const INITIAL_CLIENTS = INITIAL_DEALS.map(d => ({
  id: d.id,
  name: d.clientName,
  dealName: d.name,
  contact: "",
  dealId: d.id,
  dealStage: d.stage,
  dealValue: d.value,
  todos: (() => {
    const preset = {
      "57565295782": [
        {id:1,text:"Preparar consultoría sesión 3",emoji:"📋",source:"whatsapp",priority:"Alta",done:false,date:"2026-03-12",notes:""},
        {id:2,text:"Solicitar datos de alumnos",emoji:"📊",source:"email",priority:"Media",done:false,date:"2026-03-14",notes:""},
        {id:3,text:"Confirmar renovación contrato",emoji:"📝",source:"llamada",priority:"Alta",done:false,date:"2026-03-11",notes:""},
      ],
      "56645062937": [
        {id:1,text:"Preparar informe mensual de pagos",emoji:"📈",source:"email",priority:"Alta",done:false,date:"2026-03-13",notes:""},
        {id:2,text:"Agendar reunión con TI",emoji:"💻",source:"reunion",priority:"Media",done:false,date:"2026-03-15",notes:""},
      ],
      "54970719106": [
        {id:1,text:"Enviar demo de nueva funcionalidad",emoji:"🚀",source:"email",priority:"Alta",done:false,date:"2026-03-12",notes:""},
        {id:2,text:"Revisar integración con sistema académico",emoji:"🔗",source:"reunion",priority:"Media",done:false,date:"2026-03-18",notes:""},
      ],
      "41693726979": [
        {id:1,text:"Seguimiento propuesta comercial",emoji:"💼",source:"llamada",priority:"Alta",done:false,date:"2026-03-11",notes:""},
      ],
      "57392282457": [
        {id:1,text:"Validar datos TNE con equipo técnico",emoji:"✅",source:"email",priority:"Media",done:false,date:"2026-03-16",notes:""},
        {id:2,text:"Enviar firma de contrato",emoji:"✍️",source:"manual",priority:"Alta",done:false,date:"2026-03-12",notes:""},
      ],
    };
    return preset[d.id] || [];
  })()
}));

const MEETINGS_RAW = [
  {id:"74205185600",title:"Kickoff Aramark <> Toku",start:"2025-03-11T17:00:00Z",end:"2025-03-11T17:30:00Z",location:"Sala Valparaíso"},
  {id:"74718195002",title:"Toku <> Yapo.cl | Semanal 12/03",start:"2025-03-12T14:15:00Z",end:"2025-03-12T14:45:00Z",location:""},
  {id:"74440496395",title:"Quinta Casa <> Toku | Reunión Semanal",start:"2025-03-12T18:00:00Z",end:"2025-03-12T18:30:00Z",location:""},
];

// ─── HELPERS ────────────────────────────────────────────────────────
const fmt = n => n ? "$"+Number(n).toLocaleString("es-CL") : "—";
const fmtDate = iso => { if(!iso) return "—"; const d=new Date(iso+"T12:00:00"); return d.toLocaleDateString("es-CL",{day:"2-digit",month:"short",year:"numeric"}); };
const fmtTime = iso => new Date(iso).toLocaleTimeString("es-CL",{hour:"2-digit",minute:"2-digit",timeZone:"America/Santiago"});
function getNowCL() { return new Date(new Date().toLocaleString("en-US",{timeZone:"America/Santiago"})); }
function todayStr() { const d=getNowCL(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; }
function tomorrowStr() { const d=getNowCL(); d.setDate(d.getDate()+1); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; }
const isOverdue = d => d && d < todayStr();
const isToday   = d => d === todayStr();
const isSoon    = d => { if(!d) return false; const diff=(new Date(d)-new Date(todayStr()))/86400000; return diff>=0&&diff<=2; };
function dateLabel(d) {
  if(!d) return null;
  if(isOverdue(d)) return {text:"Vencida",color:C.danger};
  if(isToday(d))   return {text:"Hoy",color:C.warn};
  if(isSoon(d))    return {text:"Próxima",color:C.accent};
  return {text:fmtDate(d),color:C.textMuted};
}
function isWorkdayOver() { const n=getNowCL(); return n.getHours()>18||(n.getHours()===18&&n.getMinutes()>=30); }
function getCalendarDay() { return isWorkdayOver()?tomorrowStr():todayStr(); }
function formatDayLabel(s) { const d=new Date(s+"T12:00:00"); return d.toLocaleDateString("es-CL",{weekday:"long",day:"numeric",month:"long"}); }
function meetingDateStr(iso) { const d=new Date(new Date(iso).toLocaleString("en-US",{timeZone:"America/Santiago"})); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; }
function closeDateUrgency(iso) {
  if(!iso) return null;
  const diff = (new Date(iso) - new Date()) / 86400000;
  if(diff < 0)  return {color:C.danger,label:"Vencido"};
  if(diff <= 7) return {color:C.danger,label:"Esta semana"};
  if(diff <= 30) return {color:C.warn,label:"Este mes"};
  return {color:C.textMuted,label:null};
}

// ─── MINI CALENDAR ───────────────────────────────────────────────────
const DAYS_ES = ["Lu","Ma","Mi","Ju","Vi","Sá","Do"];
const MONTHS_ES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

function MiniCalendar({value, onChange, onClose}) {
  const today = todayStr();
  const initDate = value ? new Date(value+"T12:00:00") : new Date(today+"T12:00:00");
  const [viewYear, setViewYear] = useState(initDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initDate.getMonth());

  function getDaysInMonth(y, m) { return new Date(y, m+1, 0).getDate(); }
  function getFirstDayOfMonth(y, m) {
    // 0=Sun, convert to Mon-first: Mon=0,...,Sun=6
    const d = new Date(y, m, 1).getDay();
    return d === 0 ? 6 : d - 1;
  }

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const cells = [];
  for(let i = 0; i < firstDay; i++) cells.push(null);
  for(let d = 1; d <= daysInMonth; d++) cells.push(d);

  const prevMonth = () => { if(viewMonth===0){setViewMonth(11);setViewYear(y=>y-1);}else setViewMonth(m=>m-1); };
  const nextMonth = () => { if(viewMonth===11){setViewMonth(0);setViewYear(y=>y+1);}else setViewMonth(m=>m+1); };

  const selectDay = (d) => {
    const str = `${viewYear}-${String(viewMonth+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    onChange(str);
    onClose();
  };

  const clearDate = () => { onChange(""); onClose(); };

  return (
    <div style={{
      background:C.surface, border:`1px solid ${C.border}`, borderRadius:12,
      padding:14, width:240, boxShadow:"0 12px 40px #00000080", userSelect:"none"
    }}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
        <button onClick={prevMonth} style={{background:"none",border:`1px solid ${C.border}`,color:C.textMuted,borderRadius:6,width:26,height:26,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>
        <span style={{fontSize:13,fontWeight:700,color:C.text}}>{MONTHS_ES[viewMonth]} {viewYear}</span>
        <button onClick={nextMonth} style={{background:"none",border:`1px solid ${C.border}`,color:C.textMuted,borderRadius:6,width:26,height:26,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>›</button>
      </div>
      {/* Day headers */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:4}}>
        {DAYS_ES.map(d=><div key={d} style={{textAlign:"center",fontSize:10,fontWeight:700,color:C.textMuted,padding:"2px 0"}}>{d}</div>)}
      </div>
      {/* Days grid */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
        {cells.map((d,i)=>{
          if(!d) return <div key={i} />;
          const str = `${viewYear}-${String(viewMonth+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
          const isSelected = str === value;
          const isTod = str === today;
          const isPast = str < today;
          return (
            <button key={i} onClick={()=>selectDay(d)} style={{
              background: isSelected ? C.accent : isTod ? C.accentBg : "transparent",
              border: `1px solid ${isSelected ? C.accent : isTod ? C.accent+"50" : "transparent"}`,
              borderRadius:6, color: isSelected ? "#0a0b0d" : isPast ? C.textMuted : C.text,
              fontWeight: isSelected||isTod ? 700 : 400,
              fontSize:12, padding:"4px 0", cursor:"pointer", fontFamily:"inherit",
              transition:"all .1s"
            }} onMouseEnter={e=>{if(!isSelected)e.currentTarget.style.background=C.accentBg;}} onMouseLeave={e=>{if(!isSelected)e.currentTarget.style.background=isTod?C.accentBg:"transparent";}}>{d}</button>
          );
        })}
      </div>
      {/* Footer */}
      <div style={{marginTop:10,paddingTop:10,borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <button onClick={()=>{selectDay(new Date(today+"T12:00:00").getDate());setViewYear(new Date(today+"T12:00:00").getFullYear());setViewMonth(new Date(today+"T12:00:00").getMonth());}} style={{background:"none",border:"none",color:C.accent,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Hoy</button>
        <button onClick={clearDate} style={{background:"none",border:"none",color:C.textMuted,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>Sin fecha</button>
      </div>
    </div>
  );
}

function DatePickerCell({value, onChange}) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  useEffect(()=>{
    const h = e => { if(ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  },[]);

  const dl = dateLabel(value);
  return (
    <div ref={ref} style={{position:"relative",display:"inline-block"}}>
      <button onClick={()=>setOpen(o=>!o)} style={{
        background: open ? C.accentBg : "none",
        border:`1px solid ${open ? C.accent+"60" : C.border}`,
        borderRadius:6, padding:"3px 8px", cursor:"pointer",
        fontSize:11, color: dl ? dl.color : C.textMuted,
        fontFamily:"inherit", fontWeight: dl ? 600 : 400,
        transition:"all .15s", whiteSpace:"nowrap"
      }}>
        {value ? (dl?.text || fmtDate(value)) : "📅 Fecha"}
      </button>
      {open && (
        <div style={{position:"absolute",top:"110%",left:0,zIndex:500}}>
          <MiniCalendar value={value} onChange={onChange} onClose={()=>setOpen(false)} />
        </div>
      )}
    </div>
  );
}

// ─── UI ATOMS ────────────────────────────────────────────────────────
function Card({children,style={},onClick}) {
  return <div onClick={onClick} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:20,cursor:onClick?"pointer":"default",transition:"border-color .15s,background .15s",...style}} onMouseEnter={e=>{if(onClick){e.currentTarget.style.borderColor=C.borderHover;e.currentTarget.style.background=C.surfaceHover;}}} onMouseLeave={e=>{if(onClick){e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.surface;}}}>{children}</div>;
}
function Badge({children,color,bg}) {
  return <span style={{background:bg||color+"20",color,border:`1px solid ${color}40`,borderRadius:4,padding:"2px 8px",fontSize:11,fontWeight:700,letterSpacing:.3,whiteSpace:"nowrap"}}>{children}</span>;
}
function Btn({children,onClick,variant="ghost",style={},disabled}) {
  const v={ghost:{background:"transparent",border:`1px solid ${C.border}`,color:C.textDim},accent:{background:C.accent,border:"none",color:"#0a0b0d",fontWeight:700},subtle:{background:C.accentBg,border:`1px solid ${C.accent}40`,color:C.accent},danger:{background:C.dangerBg,border:`1px solid ${C.danger}40`,color:C.danger}};
  return <button onClick={onClick} disabled={disabled} style={{...v[variant],borderRadius:8,padding:"7px 14px",fontSize:12,fontWeight:600,cursor:disabled?"not-allowed":"pointer",fontFamily:"inherit",opacity:disabled?.4:1,transition:"opacity .15s",...style}} onMouseEnter={e=>{if(!disabled)e.currentTarget.style.opacity=".75";}} onMouseLeave={e=>{if(!disabled)e.currentTarget.style.opacity="1";}}>{children}</button>;
}
function BackBtn({onClick}) {
  return <button onClick={onClick} style={{background:"none",border:`1px solid ${C.border}`,color:C.textMuted,borderRadius:8,padding:"6px 12px",fontSize:12,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:6,transition:"all .15s"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=C.accent;e.currentTarget.style.color=C.accent;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textMuted;}}>← Volver</button>;
}
function SectionTitle({children,action}) {
  return <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><span style={{fontSize:11,fontWeight:700,letterSpacing:2,color:C.accentDim,textTransform:"uppercase"}}>{children}</span>{action}</div>;
}
function FilterPill({label,active,color,count,onClick}) {
  return <button onClick={onClick} style={{background:active?(color||C.accent)+"20":"transparent",border:`1px solid ${active?(color||C.accent)+"60":C.border}`,color:active?(color||C.accent):C.textMuted,borderRadius:20,padding:"5px 14px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:6,transition:"all .15s"}}>{label}{count!==undefined&&<span style={{background:active?(color||C.accent):C.border,color:active?"#0a0b0d":C.textMuted,borderRadius:10,fontSize:10,fontWeight:700,padding:"1px 6px"}}>{count}</span>}</button>;
}
const iStyle={background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,padding:"7px 10px",color:C.text,fontSize:12,fontFamily:"inherit",outline:"none",width:"100%",boxSizing:"border-box"};

// ─── EMOJI PICKER ────────────────────────────────────────────────────
const EMOJIS=["📋","📊","📝","📈","💻","🚀","🔗","💼","✅","✍️","📞","💬","✉️","🤝","🔴","🟡","🟢","⭐","🎯","🔥","⚡","💡","📌","🗂️","📁","🧩","🏆","⏰","📅","🔒"];
function EmojiPicker({value,onChange}) {
  const [open,setOpen]=useState(false);
  const ref=useRef();
  useEffect(()=>{ const h=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false);}; document.addEventListener("mousedown",h); return ()=>document.removeEventListener("mousedown",h); },[]);
  return (
    <div ref={ref} style={{position:"relative",display:"inline-block"}}>
      <button onClick={()=>setOpen(o=>!o)} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:6,padding:"2px 6px",cursor:"pointer",fontSize:16,lineHeight:1.4}}>{value||"📋"}</button>
      {open&&<div style={{position:"absolute",top:"110%",left:0,background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:8,display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:4,zIndex:300,boxShadow:"0 8px 32px #00000060",width:200}}>
        {EMOJIS.map(e=><button key={e} onClick={()=>{onChange(e);setOpen(false);}} style={{background:value===e?C.accentBg:"transparent",border:"none",borderRadius:6,cursor:"pointer",fontSize:18,padding:4}} onMouseEnter={el=>el.currentTarget.style.background=C.accentBg} onMouseLeave={el=>el.currentTarget.style.background=value===e?C.accentBg:"transparent"}>{e}</button>)}
      </div>}
    </div>
  );
}

// ─── INLINE EDIT ─────────────────────────────────────────────────────
function InlineEdit({value,onChange,style={}}) {
  const [editing,setEditing]=useState(false);
  const [draft,setDraft]=useState(value);
  const ref=useRef();
  useEffect(()=>{if(editing&&ref.current)ref.current.focus();},[editing]);
  const commit=()=>{onChange(draft||value);setEditing(false);};
  if(!editing) return <span onClick={()=>{setDraft(value);setEditing(true);}} title="Editar" style={{cursor:"text",borderBottom:`1px dashed ${C.accentDim}90`,paddingBottom:1,...style}}>{value}</span>;
  return <input ref={ref} value={draft} onChange={e=>setDraft(e.target.value)} onBlur={commit} onKeyDown={e=>{if(e.key==="Enter")commit();if(e.key==="Escape"){setDraft(value);setEditing(false);}}} style={{...iStyle,fontSize:"inherit",padding:"2px 6px",display:"inline",width:"auto",minWidth:120,...style}} />;
}

function SelectCell({value, options, onChange}) {
  const [editing, setEditing] = useState(false);
  const ref = useRef();
  useEffect(()=>{if(editing&&ref.current)ref.current.focus();},[editing]);
  if(!editing) return <span onClick={()=>setEditing(true)} title="Editar" style={{cursor:"pointer",borderBottom:`1px dashed ${C.accentDim}`,fontSize:12,color:value?C.textDim:C.textMuted,padding:"1px 2px"}}>{value||"—"}</span>;
  return <select ref={ref} value={value} onChange={e=>{onChange(e.target.value);setEditing(false);}} onBlur={()=>setEditing(false)} style={{...iStyle,width:"auto",fontSize:12,padding:"3px 6px"}}>{options.map(o=><option key={o}>{o}</option>)}</select>;
}

// ─── TODO ROW ────────────────────────────────────────────────────────
function TodoRow({todo,clientId,idx,isDragging,isOver,onDragStart,onDragEnter,onDrop,onDragEnd,onToggle,onUpdate,onRemove,showClient}) {
  const [showNotes,setShowNotes]=useState(false);
  const dl=dateLabel(todo.date);
  return (
    <div draggable onDragStart={e=>onDragStart(e,idx)} onDragEnter={e=>onDragEnter(e,idx)} onDragOver={e=>e.preventDefault()} onDrop={e=>onDrop(e,idx)} onDragEnd={onDragEnd}
      style={{background:isOver?C.accentBg:C.bg,borderRadius:10,border:`1px solid ${isOver?C.accent+"60":C.border}`,borderLeft:`3px solid ${todo.done?C.border:PRIORITY_COLOR[todo.priority]}`,opacity:isDragging?.3:todo.done?.45:1,transition:"all .15s",cursor:"grab"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,padding:"11px 14px"}}>
        <span style={{color:C.textMuted,fontSize:14,cursor:"grab",userSelect:"none",flexShrink:0}}>⠿</span>
        <input type="checkbox" checked={todo.done} onChange={()=>onToggle(clientId,todo.id)} style={{accentColor:C.accent,width:15,height:15,cursor:"pointer",flexShrink:0}} />
        <div onClick={e=>e.stopPropagation()}><EmojiPicker value={todo.emoji||"📋"} onChange={v=>onUpdate(clientId,todo.id,{emoji:v})} /></div>
        <div style={{flex:1,minWidth:0}}>
          <InlineEdit value={todo.text} onChange={v=>onUpdate(clientId,todo.id,{text:v})} style={{fontSize:13,color:todo.done?C.textMuted:C.text,fontWeight:500,textDecoration:todo.done?"line-through":"none"}} />
          {showClient&&<div style={{fontSize:11,color:C.accentDim,marginTop:2,fontWeight:600}}>{todo.clientName}</div>}
        </div>
        {!todo.done&&(
          <div onClick={e=>e.stopPropagation()}>
            <DatePickerCell value={todo.date} onChange={v=>onUpdate(clientId,todo.id,{date:v})} />
          </div>
        )}
        {todo.done&&dl&&<span style={{fontSize:10,color:dl.color,fontWeight:600,whiteSpace:"nowrap",flexShrink:0}}>{dl.text}</span>}
        {!todo.done&&<SelectCell value={todo.priority} options={["Alta","Media","Baja"]} onChange={v=>onUpdate(clientId,todo.id,{priority:v})} />}
        <button onClick={()=>setShowNotes(o=>!o)} style={{background:todo.notes?C.accentBg:"none",border:`1px solid ${todo.notes?C.accent+"40":C.border}`,borderRadius:6,padding:"2px 7px",cursor:"pointer",fontSize:11,color:todo.notes?C.accent:C.textMuted,fontFamily:"inherit",fontWeight:600,flexShrink:0}}>{todo.notes?"📝":"+ Nota"}</button>
        {onRemove&&<button onClick={()=>onRemove(clientId,todo.id)} style={{background:"none",border:"none",color:C.textMuted,cursor:"pointer",fontSize:18,padding:"0 2px",lineHeight:1,flexShrink:0}}>×</button>}
      </div>
      {showNotes&&<div style={{padding:"0 14px 12px 50px"}}><textarea value={todo.notes||""} onChange={e=>onUpdate(clientId,todo.id,{notes:e.target.value})} placeholder="Notas sobre esta tarea..." style={{...iStyle,resize:"vertical",minHeight:64,lineHeight:1.6,fontSize:12}} /></div>}
    </div>
  );
}

function DraggableTodoList({todos,clientId,onToggle,onUpdate,onRemove,onReorder,showClient}) {
  const [dragging,setDragging]=useState(null);
  const [over,setOver]=useState(null);
  const dragItem=useRef(null);
  const handleDragStart=(e,i)=>{dragItem.current=i;setDragging(i);e.dataTransfer.effectAllowed="move";};
  const handleDragEnter=(e,i)=>{e.preventDefault();setOver(i);};
  const handleDrop=(e,i)=>{e.preventDefault();if(dragItem.current!==null&&dragItem.current!==i)onReorder(clientId,dragItem.current,i);setDragging(null);setOver(null);dragItem.current=null;};
  const handleDragEnd=()=>{setDragging(null);setOver(null);dragItem.current=null;};
  return (
    <div style={{display:"flex",flexDirection:"column",gap:6}}>
      {todos.length===0&&<div style={{textAlign:"center",padding:32,color:C.textMuted,fontSize:13}}>Sin pendientes ✓</div>}
      {todos.map((todo,idx)=>(
        <TodoRow key={todo.id} todo={todo} clientId={clientId} idx={idx}
          isDragging={dragging===idx} isOver={over===idx}
          onDragStart={handleDragStart} onDragEnter={handleDragEnter}
          onDrop={handleDrop} onDragEnd={handleDragEnd}
          onToggle={onToggle} onUpdate={onUpdate} onRemove={onRemove} showClient={showClient} />
      ))}
    </div>
  );
}

// ─── KANBAN PIPELINE ─────────────────────────────────────────────────
function PipelineView({deals,setDeals,onBack}) {
  const [draggingId,setDraggingId]=useState(null);
  const [overStage,setOverStage]=useState(null);
  const [overIdx,setOverIdx]=useState(null);
  const byStage = s => deals.filter(d=>d.stage===s);
  const total = deals.reduce((s,d)=>s+d.value,0);
  const handleDragStart=(e,id)=>{ setDraggingId(id); e.dataTransfer.effectAllowed="move"; };
  const handleDragEnd=()=>{ setDraggingId(null);setOverStage(null);setOverIdx(null); };
  const handleDragOverStage=(e,stage,idx)=>{ e.preventDefault(); setOverStage(stage); setOverIdx(idx); };
  const handleDropOnStage=(e,stage,targetIdx)=>{
    e.preventDefault();
    if(!draggingId) return;
    setDeals(prev=>{
      const moving=prev.find(d=>d.id===draggingId);
      if(!moving) return prev;
      let updated=prev.filter(d=>d.id!==draggingId);
      const movedDeal={...moving,stage};
      const stageDeals=updated.filter(d=>d.stage===stage);
      const otherDeals=updated.filter(d=>d.stage!==stage);
      const insertAt=targetIdx!==null?targetIdx:stageDeals.length;
      stageDeals.splice(insertAt,0,movedDeal);
      const ordered=[];
      STAGES.forEach(s=>{ if(s===stage)ordered.push(...stageDeals); else ordered.push(...prev.filter(d=>d.stage===s&&d.id!==draggingId)); });
      return ordered;
    });
    setDraggingId(null);setOverStage(null);setOverIdx(null);
  };
  return (
    <div>
      <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:24}}>
        <BackBtn onClick={onBack} />
        <div><div style={{fontSize:18,fontWeight:700,color:C.text}}>Pipeline</div><div style={{fontSize:12,color:C.textMuted}}>Juan Felipe Azolas · Solo lectura HubSpot</div></div>
        <div style={{marginLeft:"auto",fontSize:20,fontWeight:700,color:C.accent}}>{fmt(total)}</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:24}}>
        {STAGES.map(s=>{
          const sd=byStage(s);
          return <Card key={s}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><span style={{fontSize:12,fontWeight:700,color:STAGE_COLOR[s],textTransform:"uppercase",letterSpacing:1}}>{s}</span><Badge color={STAGE_COLOR[s]}>{sd.length}</Badge></div><div style={{fontSize:22,fontWeight:700,color:C.text}}>{fmt(sd.reduce((a,d)=>a+d.value,0))}</div></Card>;
        })}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,alignItems:"start"}}>
        {STAGES.map(stage=>{
          const stageDeals=byStage(stage);
          const isDropTarget=overStage===stage;
          return (
            <div key={stage} onDragOver={e=>handleDragOverStage(e,stage,null)} onDrop={e=>handleDropOnStage(e,stage,null)}
              style={{background:isDropTarget?STAGE_COLOR[stage]+"0a":C.bg,borderRadius:14,border:`2px solid ${isDropTarget?STAGE_COLOR[stage]+"60":C.border}`,transition:"all .15s",minHeight:200,padding:"4px 4px 12px"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 14px 10px"}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:STAGE_COLOR[stage]}} />
                  <span style={{fontSize:13,fontWeight:700,color:C.text}}>{stage}</span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:12,color:C.textMuted}}>{fmt(stageDeals.reduce((a,d)=>a+d.value,0))}</span>
                  <Badge color={STAGE_COLOR[stage]}>{stageDeals.length}</Badge>
                </div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:8,padding:"0 6px"}}>
                {stageDeals.map((deal,idx)=>{
                  const urg=closeDateUrgency(deal.closedate);
                  const isDraggingThis=draggingId===deal.id;
                  const isOverThis=overStage===stage&&overIdx===idx;
                  return (
                    <div key={deal.id} draggable onDragStart={e=>handleDragStart(e,deal.id)} onDragEnd={handleDragEnd}
                      onDragOver={e=>{e.preventDefault();e.stopPropagation();handleDragOverStage(e,stage,idx);}}
                      onDrop={e=>{e.stopPropagation();handleDropOnStage(e,stage,idx);}}
                      style={{background:isOverThis?C.accentBg:C.surface,border:`1px solid ${isOverThis?C.accent+"60":C.border}`,borderTop:`3px solid ${STAGE_COLOR[deal.stage]}`,borderRadius:10,padding:"14px 14px 12px",cursor:"grab",opacity:isDraggingThis?.3:1,transition:"all .15s",userSelect:"none"}}>
                      {/* Client name + deal name */}
                      <div style={{marginBottom:6}}>
                        <div style={{fontSize:11,fontWeight:700,color:STAGE_COLOR[deal.stage],textTransform:"uppercase",letterSpacing:.5,marginBottom:2}}>{deal.clientName}</div>
                        <div style={{fontSize:13,fontWeight:600,color:C.text,lineHeight:1.4}}>{deal.name}</div>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                        <span style={{fontSize:11,color:C.textMuted,textTransform:"uppercase",letterSpacing:.5}}>Valor</span>
                        <span style={{fontSize:16,fontWeight:700,color:deal.value>0?C.accent:C.textMuted}}>{fmt(deal.value)}</span>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                        <span style={{fontSize:11,color:C.textMuted,textTransform:"uppercase",letterSpacing:.5}}>Cierre</span>
                        <div style={{display:"flex",alignItems:"center",gap:6}}>
                          <span style={{fontSize:12,color:urg?.color||C.textDim,fontWeight:urg?.label?700:400}}>{fmtDate(deal.closedate)}</span>
                          {urg?.label&&<Badge color={urg.color}>{urg.label}</Badge>}
                        </div>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10,paddingTop:10,borderTop:`1px solid ${C.border}`}}>
                        <span style={{fontSize:10,color:C.textMuted}}>#{deal.id.slice(-6)}</span>
                        <a href={"https://app.hubspot.com/contacts/7423287/record/0-3/"+deal.id} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} style={{fontSize:10,color:C.accentDim,textDecoration:"none",fontWeight:600,padding:"2px 8px",border:`1px solid ${C.accentDim}40`,borderRadius:4}}>Ver en HS ↗</a>
                      </div>
                    </div>
                  );
                })}
                {stageDeals.length===0&&(
                  <div style={{textAlign:"center",padding:"24px 0",color:isDropTarget?STAGE_COLOR[stage]:C.textMuted,fontSize:12,border:`2px dashed ${isDropTarget?STAGE_COLOR[stage]+"60":C.border}`,borderRadius:8,transition:"all .15s"}}>
                    {isDropTarget?"Soltar aquí":"Sin negocios"}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{marginTop:12,fontSize:11,color:C.textMuted,textAlign:"right"}}>⠿ Arrastra las tarjetas entre columnas para mover de etapa · 🔒 Sincronizado con HubSpot</div>
    </div>
  );
}

// ─── CLIENTS VIEW ────────────────────────────────────────────────────
function ClientsView({clients,setClients,deals,onBack}) {
  const [active,setActive]=useState(clients[0]?.id);
  const [showAdd,setShowAdd]=useState(false);
  const [showAddClient,setShowAddClient]=useState(false);
  const [search,setSearch]=useState("");
  const [newTodo,setNewTodo]=useState({text:"",emoji:"📋",source:"manual",priority:"Alta",date:"",notes:""});
  const [newClient,setNewClient]=useState({name:"",contact:""});

  const client=clients.find(c=>c.id===active);
  const deal=deals.find(d=>d.id===client?.dealId);

  const toggleDone  =(cid,tid)       =>setClients(cs=>cs.map(c=>c.id===cid?{...c,todos:c.todos.map(t=>t.id===tid?{...t,done:!t.done}:t)}:c));
  const updateTodo  =(cid,tid,patch) =>setClients(cs=>cs.map(c=>c.id===cid?{...c,todos:c.todos.map(t=>t.id===tid?{...t,...patch}:t)}:c));
  const removeTodo  =(cid,tid)       =>setClients(cs=>cs.map(c=>c.id===cid?{...c,todos:c.todos.filter(t=>t.id!==tid)}:c));
  const reorderTodos=(cid,from,to)   =>setClients(cs=>cs.map(c=>{if(c.id!==cid)return c;const a=[...c.todos];const[i]=a.splice(from,1);a.splice(to,0,i);return{...c,todos:a};}));
  const updateContact=(cid,val)      =>setClients(cs=>cs.map(c=>c.id===cid?{...c,contact:val}:c));

  const addTodo=()=>{ if(!newTodo.text)return; setClients(cs=>cs.map(c=>c.id===active?{...c,todos:[...c.todos,{id:Date.now(),...newTodo,done:false}]}:c)); setNewTodo({text:"",emoji:"📋",source:"manual",priority:"Alta",date:"",notes:""}); setShowAdd(false); };
  const addClient=()=>{ if(!newClient.name)return; const nc={id:"custom-"+Date.now(),name:newClient.name,dealName:"",contact:newClient.contact,dealId:null,dealStage:null,dealValue:0,todos:[]}; setClients(cs=>[...cs,nc]); setActive(nc.id); setNewClient({name:"",contact:""}); setShowAddClient(false); };

  const filtered=clients.filter(c=>c.name.toLowerCase().includes(search.toLowerCase()));
  const sorted=[...client?.todos||[]].sort((a,b)=>{if(a.done!==b.done)return a.done?1:-1;const p=PRIORITY_ORDER[a.priority]-PRIORITY_ORDER[b.priority];return p!==0?p:(a.date||"9")<(b.date||"9")?-1:1;});

  const groups = {SQL:[],Opportunity:[],Closing:[],Sin_etapa:[]};
  filtered.forEach(c=>{ const s=c.dealStage; if(s&&groups[s]) groups[s].push(c); else groups["Sin_etapa"].push(c); });

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:24}}><BackBtn onClick={onBack} /><div style={{fontSize:18,fontWeight:700,color:C.text}}>Clientes & Negocios</div></div>
      <div style={{display:"grid",gridTemplateColumns:"260px 1fr",gap:16}}>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          <Card style={{padding:12}}>
            <SectionTitle action={<button onClick={()=>setShowAddClient(!showAddClient)} style={{background:"none",border:"none",color:C.accent,cursor:"pointer",fontSize:20,lineHeight:1}}>+</button>}>Clientes</SectionTitle>
            {showAddClient&&(
              <div style={{marginBottom:12,display:"flex",flexDirection:"column",gap:6}}>
                <input placeholder="Nombre cliente" value={newClient.name} onChange={e=>setNewClient(f=>({...f,name:e.target.value}))} style={iStyle} />
                <input placeholder="Contacto" value={newClient.contact} onChange={e=>setNewClient(f=>({...f,contact:e.target.value}))} style={iStyle} />
                <Btn onClick={addClient} variant="accent" style={{padding:"6px"}}>Agregar</Btn>
              </div>
            )}
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar cliente..." style={{...iStyle,marginBottom:12}} />
            {Object.entries(groups).map(([stage,items])=>{
              if(items.length===0) return null;
              const label=stage==="Sin_etapa"?"Sin etapa":stage;
              const col=STAGE_COLOR[stage]||C.textMuted;
              return (
                <div key={stage} style={{marginBottom:8}}>
                  <div style={{fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:col,marginBottom:4,paddingLeft:4}}>{label} · {items.length}</div>
                  {items.map(c=>{
                    const pending=c.todos.filter(t=>!t.done);
                    const ha=pending.filter(t=>t.priority==="Alta").length;
                    const isActive=c.id===active;
                    return (
                      <div key={c.id} onClick={()=>setActive(c.id)} style={{padding:"9px 12px",borderRadius:8,cursor:"pointer",marginBottom:3,background:isActive?C.accentBg:"transparent",border:`1px solid ${isActive?C.accent+"40":"transparent"}`,transition:"all .15s"}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                          <div style={{minWidth:0,flex:1}}>
                            <div style={{fontSize:13,fontWeight:700,color:isActive?C.accent:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name}</div>
                            {c.dealName&&<div style={{fontSize:10,color:C.textMuted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginTop:1}}>{c.dealName}</div>}
                            <div style={{fontSize:10,color:C.textMuted,marginTop:1}}>{c.contact||"Sin contacto"} · {pending.length} pend.</div>
                          </div>
                          {ha>0&&<span style={{background:C.danger,color:"white",borderRadius:10,fontSize:10,fontWeight:700,padding:"2px 6px",flexShrink:0,marginLeft:4}}>{ha}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </Card>
        </div>

        {client&&(
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <Card style={{padding:"16px 20px"}}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:16}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:20,fontWeight:800,color:C.text,marginBottom:2}}>{client.name}</div>
                  {client.dealName&&<div style={{fontSize:13,color:C.textDim,marginBottom:8}}>{client.dealName}</div>}
                  <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                    {client.dealStage&&<Badge color={STAGE_COLOR[client.dealStage]||C.textMuted} bg={STAGE_BG[client.dealStage]||"transparent"}>{client.dealStage}</Badge>}
                    {client.dealValue>0&&<span style={{fontSize:14,fontWeight:700,color:C.accent}}>{fmt(client.dealValue)}</span>}
                    {deal?.closedate&&<span style={{fontSize:12,color:C.textMuted}}>Cierre: {fmtDate(deal.closedate)}</span>}
                  </div>
                </div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <span style={{fontSize:11,color:C.textMuted}}>Contacto:</span>
                    <InlineEdit value={client.contact||"Agregar contacto"} onChange={v=>updateContact(client.id,v)} style={{fontSize:12,color:C.textDim}} />
                  </div>
                  {client.dealId&&(
                    <a href={"https://app.hubspot.com/contacts/7423287/record/0-3/"+client.dealId} target="_blank" rel="noopener noreferrer" style={{fontSize:11,color:C.accentDim,textDecoration:"none",border:`1px solid ${C.accentDim}40`,borderRadius:6,padding:"3px 10px",fontWeight:600}}>Ver en HubSpot ↗</a>
                  )}
                </div>
              </div>
            </Card>

            <Card>
              <SectionTitle action={<Btn onClick={()=>setShowAdd(!showAdd)} variant="accent">+ Tarea</Btn>}>
                Tareas · {sorted.filter(t=>!t.done).length} pendientes
              </SectionTitle>
              {showAdd&&(
                <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:16,marginBottom:16,display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  <div style={{gridColumn:"1/-1",display:"flex",gap:8,alignItems:"center"}}>
                    <EmojiPicker value={newTodo.emoji} onChange={v=>setNewTodo(f=>({...f,emoji:v}))} />
                    <input value={newTodo.text} onChange={e=>setNewTodo(f=>({...f,text:e.target.value}))} placeholder="Describe la tarea..." style={{...iStyle,flex:1}} />
                  </div>
                  <div><div style={{fontSize:11,color:C.textMuted,marginBottom:4}}>Fuente</div><select value={newTodo.source} onChange={e=>setNewTodo(f=>({...f,source:e.target.value}))} style={iStyle}>{["email","whatsapp","llamada","reunion","manual"].map(s=><option key={s}>{s}</option>)}</select></div>
                  <div><div style={{fontSize:11,color:C.textMuted,marginBottom:4}}>Prioridad</div><select value={newTodo.priority} onChange={e=>setNewTodo(f=>({...f,priority:e.target.value}))} style={iStyle}>{["Alta","Media","Baja"].map(p=><option key={p}>{p}</option>)}</select></div>
                  <div>
                    <div style={{fontSize:11,color:C.textMuted,marginBottom:4}}>Fecha límite</div>
                    <DatePickerCell value={newTodo.date} onChange={v=>setNewTodo(f=>({...f,date:v}))} />
                  </div>
                  <div style={{gridColumn:"1/-1",display:"flex",gap:8}}><Btn onClick={addTodo} variant="accent">Agregar</Btn><Btn onClick={()=>setShowAdd(false)}>Cancelar</Btn></div>
                </div>
              )}
              <DraggableTodoList todos={sorted} clientId={client.id} onToggle={toggleDone} onUpdate={updateTodo} onRemove={removeTodo} onReorder={reorderTodos} showClient={false} />
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── CALENDAR STRIP ──────────────────────────────────────────────────
const HOUR_COLORS=[C.accent,C.blue,C.success,C.warn,C.purple,C.danger];
function CalendarStrip() {
  const calDay=getCalendarDay();
  const label=isWorkdayOver()?"Mañana":"Hoy";
  const dayMeetings=MEETINGS_RAW.filter(m=>meetingDateStr(m.start)===calDay).sort((a,b)=>new Date(a.start)-new Date(b.start));
  const allH=dayMeetings.length?Array.from(new Set(dayMeetings.flatMap(m=>{const sh=new Date(m.start).getUTCHours()-4;const eh=new Date(m.end).getUTCHours()-4;return Array.from({length:eh-sh+2},(_,i)=>sh+i);}))).sort((a,b)=>a-b):[];
  const minH=allH.length?Math.min(...allH)-.5:8;
  const maxH=allH.length?Math.max(...allH)+1.5:18;
  const totalH=maxH-minH;
  const pxH=56;
  return (
    <Card style={{marginTop:24}}>
      <SectionTitle>📅 {label} — {formatDayLabel(calDay)}{isWorkdayOver()&&<span style={{fontSize:10,color:C.success,marginLeft:8,background:C.successBg,border:`1px solid ${C.success}40`,borderRadius:10,padding:"1px 8px"}}>Día terminado ✓</span>}</SectionTitle>
      {dayMeetings.length===0
        ?<div style={{textAlign:"center",padding:"24px 0",color:C.textMuted,fontSize:13}}>Sin reuniones {label.toLowerCase()} 🎉</div>
        :<div style={{position:"relative",height:totalH*pxH+24,marginTop:8}}>
          {Array.from({length:Math.ceil(totalH)+1},(_,i)=>{const h=Math.floor(minH)+i;if(h<0||h>23)return null;return <div key={h} style={{position:"absolute",top:(h-minH)*pxH,left:0,right:0,display:"flex",alignItems:"center",gap:8,opacity:.4}}><span style={{fontSize:10,color:C.textMuted,minWidth:36,textAlign:"right"}}>{String(h).padStart(2,"0")}:00</span><div style={{flex:1,height:1,background:C.border}} /></div>;})}
          {!isWorkdayOver()&&(()=>{const now=getNowCL();const nowH=now.getHours()+(now.getMinutes()/60);if(nowH>=minH&&nowH<=maxH)return <div style={{position:"absolute",left:44,right:0,top:(nowH-minH)*pxH,display:"flex",alignItems:"center",gap:4,zIndex:10}}><div style={{width:8,height:8,borderRadius:"50%",background:C.danger,flexShrink:0}} /><div style={{flex:1,height:2,background:C.danger,opacity:.7}} /></div>;return null;})()}
          {dayMeetings.map((m,i)=>{const sH=new Date(m.start).getUTCHours()-4+(new Date(m.start).getUTCMinutes()/60);const eH=new Date(m.end).getUTCHours()-4+(new Date(m.end).getUTCMinutes()/60);const top=(sH-minH)*pxH;const height=Math.max((eH-sH)*pxH-4,24);const color=HOUR_COLORS[i%HOUR_COLORS.length];return <div key={m.id} style={{position:"absolute",left:52,right:0,top,height,background:color+"22",border:`1px solid ${color}50`,borderLeft:`3px solid ${color}`,borderRadius:8,padding:"4px 10px",overflow:"hidden"}}><div style={{fontSize:12,fontWeight:600,color:C.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{m.title}</div><div style={{fontSize:10,color,marginTop:1}}>{fmtTime(m.start)} – {fmtTime(m.end)}{m.location?" · "+m.location:""}</div></div>;})}
        </div>
      }
    </Card>
  );
}

// ─── DASHBOARD ───────────────────────────────────────────────────────
function DashboardView({clients,setClients,setTab}) {
  const [priorityFilter,setPriorityFilter]=useState("Todas");
  const [sortBy,setSortBy]=useState("priority+date");

  const allTodos=clients.flatMap(c=>c.todos.filter(t=>!t.done).map(t=>({...t,clientName:c.name,clientId:c.id})));
  const filtered=allTodos.filter(t=>priorityFilter==="Todas"||t.priority===priorityFilter);

  const sorted=[...filtered].sort((a,b)=>{
    if(sortBy==="priority+date"){
      const p=PRIORITY_ORDER[a.priority]-PRIORITY_ORDER[b.priority];
      if(p!==0) return p;
      if(!a.date&&!b.date) return 0;
      if(!a.date) return 1;
      if(!b.date) return -1;
      return a.date<b.date?-1:1;
    }
    if(sortBy==="date"){
      if(!a.date&&!b.date) return 0;
      if(!a.date) return 1;
      if(!b.date) return -1;
      return a.date<b.date?-1:1;
    }
    return a.clientName.localeCompare(b.clientName);
  });

  const toggleDone  =(cid,tid)       =>setClients(cs=>cs.map(c=>c.id===cid?{...c,todos:c.todos.map(t=>t.id===tid?{...t,done:!t.done}:t)}:c));
  const updateTodo  =(cid,tid,patch) =>setClients(cs=>cs.map(c=>c.id===cid?{...c,todos:c.todos.map(t=>t.id===tid?{...t,...patch}:t)}:c));
  const reorderTodos=()=>{};  // reorder disabled in transversal view

  const alta=allTodos.filter(t=>t.priority==="Alta").length;
  const overdue=allTodos.filter(t=>isOverdue(t.date)).length;
  const todayCount=allTodos.filter(t=>isToday(t.date)).length;
  const totalPipeline=INITIAL_DEALS.reduce((s,d)=>s+d.value,0);
  const closing=INITIAL_DEALS.filter(d=>d.stage==="Closing");

  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24}}>
        {[{label:"Alta Prioridad",val:alta,color:C.danger,icon:"🔴"},{label:"Vencidas",val:overdue,color:overdue>0?C.danger:C.success,icon:"⏰"},{label:"Para hoy",val:todayCount,color:C.warn,icon:"📅"},{label:"Pipeline Total",val:fmt(totalPipeline),color:C.accent,icon:"◆",sub:INITIAL_DEALS.length+" negocios"}].map(({label,val,color,icon,sub})=>(
          <Card key={label}><div style={{fontSize:11,color:C.textMuted,letterSpacing:1,textTransform:"uppercase",marginBottom:8,display:"flex",alignItems:"center",gap:6}}><span>{icon}</span>{label}</div><div style={{fontSize:26,fontWeight:700,color}}>{val}</div>{sub&&<div style={{fontSize:11,color:C.textMuted,marginTop:4}}>{sub}</div>}</Card>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:16}}>
        <div>
          {/* Header + controls */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:8}}>
            <span style={{fontSize:11,fontWeight:700,letterSpacing:2,color:C.accentDim,textTransform:"uppercase"}}>Tareas pendientes ({sorted.length})</span>
            <div style={{display:"flex",gap:6,alignItems:"center"}}>
              <span style={{fontSize:11,color:C.textMuted}}>Ordenar:</span>
              {[["priority+date","Prioridad + Fecha"],["date","Fecha"],["client","Cliente"]].map(([v,l])=>(
                <button key={v} onClick={()=>setSortBy(v)} style={{background:sortBy===v?C.accentBg:"transparent",border:`1px solid ${sortBy===v?C.accent+"60":C.border}`,color:sortBy===v?C.accent:C.textMuted,borderRadius:6,padding:"4px 10px",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{l}</button>
              ))}
            </div>
          </div>

          {/* Priority filters */}
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
            <FilterPill label="Todas" active={priorityFilter==="Todas"} onClick={()=>setPriorityFilter("Todas")} count={allTodos.length} />
            {["Alta","Media","Baja"].map(p=><FilterPill key={p} label={p} active={priorityFilter===p} color={PRIORITY_COLOR[p]} count={allTodos.filter(t=>t.priority===p).length} onClick={()=>setPriorityFilter(p)} />)}
          </div>

          {/* Flat transversal task list */}
          {sorted.length===0
            ?<Card style={{textAlign:"center",padding:40,color:C.textMuted,fontSize:13}}>Sin tareas que coincidan ✓</Card>
            :<div style={{display:"flex",flexDirection:"column",gap:6}}>
              {sorted.map((todo,idx)=>{
                const dl=dateLabel(todo.date);
                return (
                  <div key={`${todo.clientId}-${todo.id}`} style={{
                    background:C.bg,borderRadius:10,border:`1px solid ${C.border}`,
                    borderLeft:`3px solid ${PRIORITY_COLOR[todo.priority]}`,
                    transition:"all .15s"
                  }}>
                    <div style={{display:"flex",alignItems:"center",gap:10,padding:"11px 14px"}}>
                      <input type="checkbox" checked={todo.done} onChange={()=>toggleDone(todo.clientId,todo.id)} style={{accentColor:C.accent,width:15,height:15,cursor:"pointer",flexShrink:0}} />
                      <span style={{fontSize:16,flexShrink:0}}>{todo.emoji||"📋"}</span>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:13,color:C.text,fontWeight:500}}>{todo.text}</div>
                        {/* Client tag */}
                        <div style={{marginTop:3,display:"flex",alignItems:"center",gap:6}}>
                          <span style={{fontSize:10,fontWeight:700,color:STAGE_COLOR[clients.find(c=>c.id===todo.clientId)?.dealStage]||C.accentDim,background:(STAGE_BG[clients.find(c=>c.id===todo.clientId)?.dealStage]||C.accentBg),border:`1px solid ${(STAGE_COLOR[clients.find(c=>c.id===todo.clientId)?.dealStage]||C.accent)+"30"}`,borderRadius:4,padding:"1px 6px"}}>{todo.clientName}</span>
                          {todo.notes&&<span style={{fontSize:10,color:C.textMuted}}>📝</span>}
                        </div>
                      </div>
                      <div onClick={e=>e.stopPropagation()}>
                        <DatePickerCell value={todo.date} onChange={v=>updateTodo(todo.clientId,todo.id,{date:v})} />
                      </div>
                      {dl&&<span style={{fontSize:10,color:dl.color,fontWeight:600,whiteSpace:"nowrap",flexShrink:0,minWidth:48,textAlign:"right"}}>{dl.text}</span>}
                      <Badge color={PRIORITY_COLOR[todo.priority]} bg={PRIORITY_BG[todo.priority]}>{todo.priority}</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          }
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Card>
            <SectionTitle action={<button onClick={()=>setTab("pipeline")} style={{background:"none",border:"none",color:C.accentDim,cursor:"pointer",fontSize:11,fontFamily:"inherit",fontWeight:600}}>Ver todo →</button>}>🔥 Por cerrar</SectionTitle>
            {closing.length===0?<div style={{fontSize:12,color:C.textMuted}}>Sin negocios en cierre</div>:closing.map(d=><a key={d.id} href={"https://app.hubspot.com/contacts/7423287/record/0-3/"+d.id} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}><div style={{padding:"9px 0",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:11,fontWeight:700,color:STAGE_COLOR["Closing"]}}>{d.clientName}</div>
                <div style={{fontSize:11,fontWeight:500,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.name}</div>
              </div>
              <span style={{fontSize:13,fontWeight:700,color:C.success,flexShrink:0}}>{fmt(d.value)}</span>
            </div></a>)}
          </Card>
          <Card>
            <SectionTitle action={<button onClick={()=>setTab("clients")} style={{background:"none",border:"none",color:C.accentDim,cursor:"pointer",fontSize:11,fontFamily:"inherit",fontWeight:600}}>Gestionar →</button>}>👤 Clientes con tareas</SectionTitle>
            {clients.filter(c=>c.todos.some(t=>!t.done)).map(c=>{const pending=c.todos.filter(t=>!t.done);const ha=pending.filter(t=>t.priority==="Alta").length;return <div key={c.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${C.border}`}}><div><div style={{fontSize:12,fontWeight:700,color:C.text}}>{c.name}</div>{c.dealName&&<div style={{fontSize:10,color:C.textMuted}}>{c.dealName}</div>}<div style={{fontSize:11,color:C.textMuted}}>{pending.length} pendientes</div></div>{ha>0&&<Badge color={C.danger} bg={C.dangerBg}>{ha} alta</Badge>}</div>;})}
          </Card>
        </div>
      </div>
      <CalendarStrip />
    </div>
  );
}

// ─── INBOX ───────────────────────────────────────────────────────────
function InboxView({clients,setClients,onBack}) {
  const [inbox,setInbox]=useState("");const[loading,setLoading]=useState(false);const[parsed,setParsed]=useState(null);const[error,setError]=useState(null);const[applied,setApplied]=useState(false);
  const process=async()=>{
    if(!inbox.trim())return;
    setLoading(true);setError(null);setParsed(null);setApplied(false);
    try{
      const prompt="Eres un asistente ejecutivo. Extrae tareas. Devuelve SOLO JSON sin backticks.\nClientes: "+clients.map(c=>c.name).join(", ")+"\nNotas: "+inbox+"\nJSON: {\"tasks\":[{\"text\":\"\",\"priority\":\"Alta|Media|Baja\",\"client\":\"nombre o null\",\"source\":\"email|whatsapp|llamada|reunion|manual\",\"date\":\"YYYY-MM-DD o null\"}],\"summary\":\"resumen 1 linea\"}";
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:prompt}]})});
      const data=await res.json();
      const raw=data.content?.[0]?.text||"";
      const match=raw.replace(/```json|```/g,"").trim().match(/\{[\s\S]*\}/);
      if(match)setParsed(JSON.parse(match[0]));else setError("No se pudo parsear.");
    }catch{setError("Error al conectar con Claude.");}
    setLoading(false);
  };
  const apply=()=>{
    if(!parsed?.tasks)return;
    setClients(cs=>{let u=[...cs];parsed.tasks.forEach(task=>{const idx=u.findIndex(c=>task.client&&c.name.toLowerCase().includes(task.client.toLowerCase()));if(idx>=0)u[idx]={...u[idx],todos:[...u[idx].todos,{id:Date.now()+Math.random(),text:task.text,emoji:"📋",source:task.source||"manual",priority:task.priority||"Media",date:task.date||"",notes:"",done:false}]};});return u;});
    setApplied(true);setInbox("");
  };
  return (
    <div>
      <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:24}}><BackBtn onClick={onBack} /><div style={{fontSize:18,fontWeight:700,color:C.text}}>Inbox IA</div></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <Card>
          <SectionTitle>✦ Captura rápida</SectionTitle>
          <div style={{fontSize:12,color:C.textMuted,marginBottom:12}}>Pega notas de correos, WhatsApp, llamadas... Claude las organiza.</div>
          <textarea value={inbox} onChange={e=>setInbox(e.target.value)} rows={10} placeholder={"Ej:\n• Llamó Carlos de eClass, quiere reunión el viernes\n• Revisar propuesta INACAP antes del jueves"} style={{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:14,color:C.text,fontSize:13,fontFamily:"inherit",resize:"vertical",boxSizing:"border-box",lineHeight:1.6,outline:"none"}} />
          <div style={{display:"flex",gap:8,marginTop:12}}>
            <Btn onClick={process} variant="accent" style={{flex:1,padding:"10px 0"}} disabled={loading}>{loading?"⏳ Procesando...":"✦ Procesar con Claude"}</Btn>
            <Btn onClick={()=>{setInbox("");setParsed(null);setError(null);}}>Limpiar</Btn>
          </div>
        </Card>
        <Card>
          <SectionTitle>Resultado</SectionTitle>
          {!parsed&&!loading&&!error&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:200,color:C.textMuted,gap:8}}><span style={{fontSize:36}}>✦</span><span style={{fontSize:13}}>El resultado aparecerá aquí</span></div>}
          {loading&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:200,color:C.accent,gap:8}}><span style={{fontSize:28}}>◌</span><span style={{fontSize:13}}>Analizando notas...</span></div>}
          {error&&<div style={{color:C.danger,fontSize:13}}>{error}</div>}
          {parsed&&!loading&&(
            <div>
              {parsed.summary&&<div style={{background:C.accentBg,border:`1px solid ${C.accent}30`,borderRadius:8,padding:"10px 14px",marginBottom:14,fontSize:13,color:C.accent}}>{parsed.summary}</div>}
              <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
                {parsed.tasks?.map((t,i)=><div key={i} style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:"10px 14px",display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:14}}>{SOURCE_ICON[t.source]||"•"}</span><div style={{flex:1}}><div style={{fontSize:13,color:C.text}}>{t.text}</div><div style={{fontSize:11,color:C.accentDim,marginTop:2}}>{t.client&&"→ "+t.client}{t.date&&" · "+t.date}</div></div><Badge color={PRIORITY_COLOR[t.priority]} bg={PRIORITY_BG[t.priority]}>{t.priority}</Badge></div>)}
              </div>
              {!applied?<Btn onClick={apply} variant="accent" style={{width:"100%",padding:"10px 0"}}>✓ Agregar a clientes</Btn>:<div style={{textAlign:"center",color:C.success,fontSize:13,fontWeight:600,padding:"10px 0"}}>✓ Tareas aplicadas correctamente</div>}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────
const NAV=[{id:"dashboard",label:"Dashboard",icon:"◈"},{id:"pipeline",label:"Pipeline",icon:"◆"},{id:"clients",label:"Clientes",icon:"◉"},{id:"inbox",label:"Inbox IA",icon:"✦"}];

export default function App() {
  const [tab,setTab]=useState("dashboard");
  const [deals,setDeals]=useState(()=>{
    try{const s=localStorage.getItem("deals");return s?JSON.parse(s):INITIAL_DEALS;}catch{return INITIAL_DEALS;}
  });
  const [clients,setClients]=useState(()=>{
    try{const s=localStorage.getItem("clients");return s?JSON.parse(s):INITIAL_CLIENTS;}catch{return INITIAL_CLIENTS;}
  });

  useEffect(()=>{localStorage.setItem("deals",JSON.stringify(deals));},[deals]);
  useEffect(()=>{localStorage.setItem("clients",JSON.stringify(clients));},[clients]);
  const todayLabel=new Date().toLocaleDateString("es-CL",{weekday:"long",day:"numeric",month:"long"});
  return (
    <div style={{fontFamily:"'DM Sans','Helvetica Neue',sans-serif",background:C.bg,minHeight:"100vh",color:C.text}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-thumb{background:#2e3140;border-radius:4px;}
        input::placeholder,textarea::placeholder{color:#4b5563;}
        select option{background:#111318;color:#e8eaf0;}
      `}</style>
      <div style={{borderBottom:`1px solid ${C.border}`,padding:"0 32px",display:"flex",alignItems:"center",height:56,position:"sticky",top:0,background:C.bg,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginRight:32}}><span style={{fontSize:18,color:C.accent}}>✦</span><span style={{fontSize:14,fontWeight:700,letterSpacing:1}}>EXEC OS</span></div>
        <div style={{display:"flex",gap:2,flex:1}}>
          {NAV.map(n=><button key={n.id} onClick={()=>setTab(n.id)} style={{background:tab===n.id?C.accentBg:"transparent",border:`1px solid ${tab===n.id?C.accent+"40":"transparent"}`,borderRadius:8,padding:"6px 16px",cursor:"pointer",color:tab===n.id?C.accent:C.textMuted,fontSize:13,fontWeight:tab===n.id?600:400,fontFamily:"inherit",display:"flex",alignItems:"center",gap:6,transition:"all .15s"}}><span>{n.icon}</span> {n.label}</button>)}
        </div>
        <div style={{fontSize:12,color:C.textMuted,textTransform:"capitalize"}}>{todayLabel}</div>
      </div>
      <div style={{padding:"24px 32px",maxWidth:1200,margin:"0 auto"}}>
        {tab==="dashboard"&&<DashboardView clients={clients} setClients={setClients} setTab={setTab} />}
        {tab==="pipeline" &&<PipelineView  deals={deals} setDeals={setDeals} onBack={()=>setTab("dashboard")} />}
        {tab==="clients"  &&<ClientsView   clients={clients} setClients={setClients} deals={deals} onBack={()=>setTab("dashboard")} />}
        {tab==="inbox"    &&<InboxView     clients={clients} setClients={setClients} onBack={()=>setTab("dashboard")} />}
      </div>
    </div>
  );
}