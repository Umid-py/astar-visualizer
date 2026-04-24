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
  this.wall=false; this.g=Infinity;
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

async function startSearch(){
 if(!startNode||!endNode) return alert("Start/End qo‘ying");

 let t0=performance.now();
 let open=[startNode];
 startNode.g=0;
 visitedCount=0;

 while(open.length){
  let current=open.reduce((a,b)=>a.g<b.g?a:b);
  if(current===endNode){ drawPath(); break; }

  open=open.filter(n=>n!==current);

  for(let n of current.neighbors()){
   if(n.wall) continue;
   let temp=current.g+1;
   if(temp<n.g){
    n.g=temp; n.parent=current;
    if(!open.includes(n)){
     open.push(n);
     n.el.classList.add("visited");
     visitedCount++;
    }
   }
  }
  updateFPS();
  await sleep(10);
 }

 document.getElementById("time").innerText=Math.round(performance.now()-t0);
 document.getElementById("visited").innerText=visitedCount;
}

function drawPath(){
 let n=endNode,len=0;
 while(n.parent){
  n=n.parent;
  n.el.classList.add("path");
  len++;
 }
 document.getElementById("path").innerText=len;
}

function randomMaze(){
 grid.flat().forEach(n=>{
  if(Math.random()<0.3 && n!==startNode && n!==endNode){
   n.wall=true; n.el.classList.add("wall");
  }
 });
}

function clearBoard(){ location.reload(); }

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
