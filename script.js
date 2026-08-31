const defaults=[
{name:"CyberGuard",desc:"Cybersecurity learning and scanner app with password tools, phishing URL checks, security checklist, news and quizzes.",tech:["Flutter","Dart","Hive","REST APIs"],github:"https://github.com/abrar4465",live:"",image:"",mark:"CG"},
{name:"Eagle Eye Security",desc:"Flutter desktop shop-management concept for products, billing, sales reports and role-based dashboards.",tech:["Flutter","Dart","Hive","Desktop"],github:"https://github.com/abrar4465/eagle-eye-security",live:"",image:"",mark:"EE"},
{name:"Grain Marketplace",desc:"FYP marketplace concept connecting farmers and buyers through grain listings and competitive bidding.",tech:["Flutter","Backend","Database"],github:"",live:"",image:"",mark:"GM"}
];
let saved=JSON.parse(localStorage.getItem("abrarProjects3D")||"[]");
let projects=[...defaults,...saved];
const grid=document.getElementById("projectGrid");
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
const url=u=>{try{let x=new URL(u);return /^https?:$/.test(x.protocol)?x.href:"#"}catch{return "#"}};
function render(){grid.innerHTML=projects.map((p,i)=>`<article class="project glass"><div class="project-img">${p.image?`<img src="${p.image}" alt="${esc(p.name)} screenshot">`:`<div class="project-placeholder">${esc(p.mark||String(i+1).padStart(2,"0"))}</div>`}</div><div class="project-body"><h3>${esc(p.name)}</h3><p>${esc(p.desc)}</p><div class="chips">${(p.tech||[]).map(t=>`<span class="chip">${esc(t)}</span>`).join("")}</div><div class="links">${p.github?`<a href="${url(p.github)}" target="_blank">GitHub ↗</a>`:""}${p.live?`<a href="${url(p.live)}" target="_blank">Live demo ↗</a>`:""}</div></div></article>`).join("")}
render();

const pd=document.getElementById("projectDialog"), form=document.getElementById("projectForm"), files=document.getElementById("pImage");
document.getElementById("addBtn").onclick=()=>pd.showModal();
document.getElementById("closeDialog").onclick=()=>pd.close();
files.onchange=()=>{document.getElementById("preview").innerHTML="";[...files.files].slice(0,6).forEach(f=>{let r=new FileReader();r.onload=()=>document.getElementById("preview").insertAdjacentHTML("beforeend",`<img src="${r.result}" alt="preview">`);r.readAsDataURL(f)})};
form.onsubmit=async e=>{e.preventDefault();let imgs=[];for(const f of [...files.files].slice(0,3))imgs.push(await imageData(f));let p={name:pName.value.trim(),desc:pDesc.value.trim(),tech:pTech.value.split(",").map(x=>x.trim()).filter(Boolean),github:pGithub.value.trim(),live:pLive.value.trim(),image:imgs[0]||"",mark:pName.value.trim().slice(0,2).toUpperCase()};saved.push(p);localStorage.setItem("abrarProjects3D",JSON.stringify(saved));projects=[...defaults,...saved];render();form.reset();document.getElementById("preview").innerHTML="";pd.close()};
document.getElementById("resetBtn").onclick=()=>{if(confirm("Delete projects you added through this browser?")){localStorage.removeItem("abrarProjects3D");saved=[];projects=[...defaults];render();pd.close()}};
function imageData(file){return new Promise(resolve=>{let r=new FileReader();r.onload=()=>{let im=new Image();im.onload=()=>{let max=1000,s=Math.min(1,max/im.width),c=document.createElement("canvas");c.width=im.width*s;c.height=im.height*s;c.getContext("2d").drawImage(im,0,0,c.width,c.height);resolve(c.toDataURL("image/jpeg",.8))};im.src=r.result};r.readAsDataURL(file)})}

const profD=document.getElementById("profileDialog"), profFile=document.getElementById("profileFile");
document.getElementById("profileBtn").onclick=()=>profD.showModal();
document.getElementById("profileUpload").onclick=()=>profD.showModal();
document.getElementById("closeProfile").onclick=()=>profD.close();
profFile.onchange=()=>{let f=profFile.files[0];if(!f)return;let r=new FileReader();r.onload=()=>document.getElementById("profilePreview").innerHTML=`<img src="${r.result}" alt="profile preview">`;r.readAsDataURL(f)};
document.getElementById("profileForm").onsubmit=async e=>{e.preventDefault();let data=await imageData(profFile.files[0]);localStorage.setItem("abrarProfile3D",data);applyProfile(data);profD.close()};
document.getElementById("removeProfile").onclick=()=>{localStorage.removeItem("abrarProfile3D");applyProfile("");profD.close()};
function applyProfile(data){let box=document.getElementById("profileImage");box.querySelector("img")?.remove();if(data){let im=document.createElement("img");im.src=data;im.alt="Abrar Mughal profile";box.prepend(im)}}
applyProfile(localStorage.getItem("abrarProfile3D")||"");

document.getElementById("hamb").onclick=()=>{let n=document.querySelector("nav");n.style.display=n.style.display==="flex"?"none":"flex";n.style.position="absolute";n.style.top="60px";n.style.right="10px";n.style.flexDirection="column";n.style.padding="18px";n.style.borderRadius="15px";n.className="glass"};
