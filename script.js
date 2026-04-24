const rows=25, cols=40;
let grid=[], startNode=null, endNode=null;
let mouseDown=false, clickStage=0;
let visitedCount=0;
let frameCount=0, lastFPS=performance.now();

document.body.onmousedown=()=>mouseDown=true;
document.body.onmouseup=()=>mouseDown=false;

document.onkeydown=e=>{
 if(e.code==="Space") startSearch();
 if(e.key==="c") clearBoard();
 if(e.key==="r") randomMaze();
}

class Node{
 constructor(r,c,el){
  this.r=r; this.c=c; this.el=el;
  this.wall=false;
  this.g=Infinity;
  this.h=0;
  this.f=0;
  this.parent=null;
 }
 neighbors(){
  const dirs=[[1,0],[-1,0],[0,1],[0,-1]];
  return dirs.map(d=>grid[this.r+d[0]]?.[this.c+d[1]]).filter(Boolean);
 }
}

function createGrid(){
 const g=document.getElementById("grid");
 for(let r=0;r<rows;r++){
  grid[r]=[];
  for(let c=0;c<cols;c++){
   let el=document.createElement("div");
   el.className="cell";
   g.appendChild(el);
   let n=new Node(r,c,el);
   grid[r][c]=n;

   el.onmousedown=()=>setPoints(n);
   el.onmouseover=e=>{ if(e.buttons==1 && clickStage>=2) addWall(n); }
  }
 }
}
createGrid();

function setPoints(n){
 if(clickStage==0){startNode=n;n.el.classList.add("start");clickStage++;}
 else if(clickStage==1){endNode=n;n.el.classList.add("end");clickStage++;}
 else addWall(n);
}

function addWall(n){
 if(n!==startNode&&n!==endNode){
  n.wall=true;n.el.classList.add("wall");
 }
}

function heuristic(a,b){ return Math.abs(a.r-b.r)+Math.abs(a.c-b.c); }

function setStatus(text){
 document.getElementById("status").innerText=text;
}

function clearSearch(){
 grid.flat().forEach(n=>{
  n.g=Infinity; n.parent=null;
  n.el.classList.remove("visited","path");
 });
 visitedCount=0;
 document.getElementById("visited").innerText=0;
 document.getElementById("path").innerText=0;
}

async function startSearch(){
 if(!startNode||!endNode){ setStatus("Start va End qo‘ying ❗"); return; }

 clearSearch();
 setStatus("Qidirilmoqda...");
 let t0=performance.now();

 let open=[startNode];
 startNode.g=0;
 startNode.h=heuristic(startNode,endNode);
 startNode.f=startNode.h;

 while(open.length){
  let current=open.reduce((a,b)=>a.f<b.f?a:b);

  if(current===endNode){
   drawPath();
   document.getElementById("time").innerText=Math.round(performance.now()-t0);
   setStatus("Yo‘l topildi ✅");
   return;
  }

  open=open.filter(n=>n!==current);

  for(let n of current.neighbors()){
   if(n.wall) continue;
   let temp=current.g+1;

   if(temp<n.g){
    n.parent=current;
    n.g=temp;
    n.h=heuristic(n,endNode);
    n.f=n.g+n.h;

    if(!open.includes(n)){
     open.push(n);
     if(n!==endNode){
      n.el.classList.add("visited");
      visitedCount++;
     }
    }
   }
  }

  updateFPS();
  await sleep(10);
 }

 setStatus("Yo‘l mavjud emas ❌");
}

function drawPath(){
 let n=endNode,len=0;
 while(n.parent){
  n=n.parent;
  n.el.classList.add("path");
  len++;
 }
 document.getElementById("path").innerText=len;
 document.getElementById("visited").innerText=visitedCount;
}

function randomMaze(){
 grid.flat().forEach(n=>{
  if(Math.random()<0.3 && n!==startNode && n!==endNode){
   n.wall=true; n.el.classList.add("wall");
  }
 });
}

function clearBoard(){
 grid.flat().forEach(n=>{
  n.wall=false; n.parent=null; n.g=Infinity;
  n.el.className="cell";
 });
 startNode=null; endNode=null; clickStage=0;
 setStatus("Tozalandi");
}

function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }

function updateFPS(){
 frameCount++;
 let now=performance.now();
 if(now-lastFPS>1000){
  document.getElementById("fps").innerText=frameCount;
  frameCount=0;
  lastFPS=now;
 }
}
