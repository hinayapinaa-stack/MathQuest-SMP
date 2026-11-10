import React, { useEffect, useState } from "react";
import { collection, onSnapshot, doc, setDoc, getDocs, writeBatch } from "firebase/firestore";
import { db } from "./firebase";

const adventures = [
  { id:"integers", name:"Pulau Bilangan Bulat", detail:"10 soal • Operasi bilangan bulat", icon:"🌳", color:"#5bd88b", questions:[
    ["-8 + 13 = ?", "5", ["-5","21","5","-21"]],
    ["7 - 12 = ?", "-5", ["5","-19","-5","19"]],
    ["(-4) × 6 = ?", "-24", ["24","-10","-24","10"]],
    ["(-36) ÷ (-6) = ?", "6", ["-6","6","-30","30"]],
    ["15 + (-9) = ?", "6", ["24","-6","6","-24"]],
    ["(-3)² = ?", "9", ["-9","6","9","-6"]],
    ["20 ÷ (-5) = ?", "-4", ["4","-4","15","-15"]],
    ["-2 + (-11) = ?", "-13", ["13","-9","-13","9"]],
    ["5 × (-7) = ?", "-35", ["35","-12","-35","12"]],
    ["18 - (-4) = ?", "22", ["14","-22","22","-14"]]
  ]},
  { id:"fractions", name:"Lembah Pecahan", detail:"10 soal • Operasi pecahan", icon:"🏝️", color:"#58b9ff", questions:[
    ["1/2 + 1/4 = ?", "3/4", ["2/6","3/4","1/6","1"]],
    ["2/3 - 1/3 = ?", "1/3", ["1/3","1/6","2/3","1"]],
    ["1/2 × 1/3 = ?", "1/6", ["1/5","2/6","1/6","1/3"]],
    ["3/4 ÷ 1/2 = ?", "3/2", ["3/8","1/2","3/2","2/3"]],
    ["2/5 + 1/5 = ?", "3/5", ["3/10","3/5","1/5","2/5"]],
    ["5/6 - 1/6 = ?", "2/3", ["4/6","2/3","1/3","5/6"]],
    ["2/3 × 3/4 = ?", "1/2", ["1/2","6/7","5/12","2/4"]],
    ["1/4 + 1/2 = ?", "3/4", ["2/6","1/4","3/4","1"]],
    ["4/5 ÷ 2 = ?", "2/5", ["2/5","4/10","1/5","2/3"]],
    ["7/8 - 3/8 = ?", "1/2", ["4/8","1/2","3/5","5/8"]]
  ]},
  { id:"ratio", name:"Kota Perbandingan", detail:"10 soal • Rasio dan skala", icon:"🏔️", color:"#b78aff", questions:[
    ["Perbandingan 2:4 disederhanakan menjadi…","1:2",["2:1","1:2","1:4","4:2"]],
    ["Skala 1:100, 2 cm di peta = … cm sebenarnya","200",["100","20","200","2"]],
    ["3:6 setara dengan…","1:2",["1:3","2:1","1:2","3:2"]],
    ["Jika 2 pensil Rp4.000, 5 pensil = …","Rp10.000",["Rp8.000","Rp10.000","Rp12.000","Rp5.000"]],
    ["Perbandingan 5:10 dalam bentuk sederhana…","1:2",["1:2","2:1","5:2","1:5"]],
    ["Skala 1:500, 4 cm = … cm sebenarnya","2000",["500","1000","2000","250"]],
    ["8:12 disederhanakan…","2:3",["3:2","2:3","4:6","1:3"]],
    ["Jika 3 kg beras Rp36.000, 1 kg = …","Rp12.000",["Rp9.000","Rp12.000","Rp18.000","Rp36.000"]],
    ["10:15 disederhanakan…","2:3",["2:3","3:2","1:5","5:1"]],
    ["Skala 1:1.000, 3 cm = … m sebenarnya","30",["3","300","30","3000"]]
  ]},
  { id:"algebra", name:"Benteng Aljabar", detail:"10 soal • Bentuk aljabar", icon:"🏰", color:"#ffc45b", questions:[
    ["2x + 3x = ?", "5x", ["5","6x","5x","x"]],
    ["Jika x=4, 2x+1 = ?", "9", ["8","9","7","6"]],
    ["y + 5 = 12, y = ?", "7", ["17","5","7","-7"]],
    ["3a - a = ?", "2a", ["3a","2a","a","4a"]],
    ["Jika x=3, x² = ?", "9", ["6","9","3","12"]],
    ["4x = 20, x = ?", "5", ["4","5","16","80"]],
    ["2(x+3) = ?", "2x+6", ["2x+3","x+6","2x+6","2x"]],
    ["7b + 2b = ?", "9b", ["9","14b","9b","5b"]],
    ["a - 8 = 2, a = ?", "10", ["6","-6","10","16"]],
    ["5x - 2x = ?", "3x", ["7x","3x","3","x"]]
  ]}
];

export default function App(){
  const [name,setName]=useState(localStorage.getItem("mq-name")||"Pemain");
  const [group,setGroup]=useState(localStorage.getItem("mq-group")||"Kelompok 1");
  const [scores,setScores]=useState([]);
  const [game,setGame]=useState(null);
  const [index,setIndex]=useState(0);
  const [points,setPoints]=useState(0);
  const [feedback,setFeedback]=useState("");
  const [adminKey,setAdminKey]=useState("");
  const [adminOpen,setAdminOpen]=useState(false);
  const [configError,setConfigError]=useState(false);

  useEffect(()=>{
    const unsub=onSnapshot(collection(db,"leaderboard"),snap=>{
      setScores(snap.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(b.score||0)-(a.score||0)));
      setConfigError(false);
    },()=>setConfigError(true));
    return unsub;
  },[]);

  function enterAdventure(a){
    localStorage.setItem("mq-name",name); localStorage.setItem("mq-group",group);
    setGame(a);setIndex(0);setPoints(0);setFeedback("");
  }
  async function answer(choice){
    if(feedback) return;
    const correct=choice===game.questions[index][1];
    const nextPoints=points+(correct?10:0);
    setPoints(nextPoints);setFeedback(correct?"Benar! +10 poin 🎉":"Belum tepat, tetap semangat!");
    if(index===game.questions.length-1){
      try{
        const id=group.toLowerCase().replaceAll(" ","-");
        const old=scores.find(s=>s.id===id)?.score||0;
        await setDoc(doc(db,"leaderboard",id),{group,score:old+nextPoints,updatedAt:new Date().toISOString()},{merge:true});
      }catch(e){setFeedback("Skor dihitung, tetapi belum tersimpan. Periksa konfigurasi Firebase.");}
    }
  }
  async function resetScores(){
    // Untuk demo. Atur akses admin melalui Firebase Authentication + Security Rules sebelum deploy publik.
    if(adminKey!==import.meta.env.VITE_ADMIN_KEY){alert("Kunci admin salah.");return;}
    const snap=await getDocs(collection(db,"leaderboard"));
    const batch=writeBatch(db);snap.docs.forEach(d=>batch.delete(d.ref));await batch.commit();
    setAdminOpen(false);setAdminKey("");alert("Peringkat telah direset.");
  }
  if(game){
    const q=game.questions[index];
    return <main className="quiz"><button className="back" onClick={()=>setGame(null)}>← Kembali</button><h1>{game.icon} {game.name}</h1><p>Soal {index+1} dari 10 • {name} ({group})</p><div className="progress"><span style={{width:`${(index+1)*10}%`}}/></div><section className="question"><h2>{q[0]}</h2><div className="answers">{q[2].map((a,i)=><button key={i} disabled={!!feedback} onClick={()=>answer(a)}>{a}</button>)}</div>{feedback&&<div className="feedback">{feedback}{index===9?<><h3>Selesai! Total poin: {points}</h3><button onClick={()=>setGame(null)}>Kembali ke petualangan</button></>:<button onClick={()=>{setIndex(index+1);setFeedback("");}}>Soal berikutnya →</button>}</div>}</section></main>
  }
  return <main className="app"><header><div className="profile"><span>🧑‍🎓</span><div><input value={name} onChange={e=>setName(e.target.value)} aria-label="Nama pemain"/><select value={group} onChange={e=>setGroup(e.target.value)}>{[1,2,3,4,5,6].map(n=><option key={n}>Kelompok {n}</option>)}</select></div></div><div className="hero"><h1>🎮 MathQuest SMP</h1><p>Belajar, bermain, dan berkompetisi!</p></div><button className="admin" onClick={()=>setAdminOpen(!adminOpen)}>⚙️ Reset Peringkat (Admin)</button></header>
    {adminOpen&&<div className="adminPanel"><input type="password" placeholder="Kunci admin" value={adminKey} onChange={e=>setAdminKey(e.target.value)}/><button onClick={resetScores}>Reset semua skor</button><small>Set VITE_ADMIN_KEY di file .env. Amankan reset dengan Firebase Authentication dan rules sebelum dipublikasikan.</small></div>}
    <section className="leaderboard"><h2>🏆 Peringkat Pemain</h2>{configError&&<p className="error">Firebase belum terhubung. Isi konfigurasi di src/firebase.js.</p>}{scores.length===0?<p>Belum ada skor. Jadilah kelompok pertama!</p>:<div className="rank">{scores.slice(0,5).map((s,i)=><article key={s.id}><strong>{["🥇","🥈","🥉","🏅","🏅"][i]}</strong><b>{s.group}</b><span>{s.score||0} poin</span></article>)}</div>}</section>
    <h2 className="choose">🗺️ Pilih Petualangan</h2><section className="adventures">{adventures.map(a=><article className="adventure" key={a.id} style={{"--accent":a.color}}><div className="illustration">{a.icon}</div><h3>{a.name}</h3><p>{a.detail}</p><button onClick={()=>enterAdventure(a)}>▶ Mulai</button></article>)}</section><footer>MathQuest SMP • Skor contoh tidak ditampilkan; peringkat berasal dari Firebase.</footer>
  </main>
}
