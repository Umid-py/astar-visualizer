const grid = document.getElementById("grid");
const SIZE = 40;
let cells = [];
let start=null,end=null;
let mouseDown=false;
let clickStage=0;

function createGrid(){
  grid.innerHTML="";
  cells=[];
  for(let i=0;i<SIZE*SIZE;i++){
    let div=document.createElement("div");
    div.className="cell";
    div.dataset.index=i;

    div.onmousedown=e=>{
      mouseDown=true;
      handleClick(div);
    };
    div.onmouseover=e=>{
      if(mouseDown && !div.classList.contains("start") && !div.classList.contains("end"))
        div.classList.add("wall");
    };

    grid.appendChild(div);
    cells.push(div);
  }
}
document.body.onmouseup=()=>mouseDown=false;

function handleClick(cell){
  if(clickStage===0){
    cell.classList.add("start");
    start=cell;
    clickStage=1;
    status("Start tanlandi");
  }
  else if(clickStage===1){
    cell.classList.add("end");
    end=cell;
    clickStage=2;
    status("Finish tanlandi");
  }
}

function clearBoard(){
  createGrid();
  clickStage=0;
  status("Tozalandi");
}

function randomMaze(){
  cells.forEach(c=>{
    if(Math.random()<0.3) c.classList.add("wall");
  });
}

function status(txt){ document.getElementById("status").innerText=txt; }

document.onkeydown=e=>{
  if(e.code==="Space") startSearch();
  if(e.key==="c") clearBoard();
  if(e.key==="r") randomMaze();
}

function startSearch(){
  if(!start || !end){ status("Start va End kerak"); return;}
  status("Algoritm ishlayapti...");
  let t0=performance.now();

  // demo animatsiya (real A* o‘rniga visual demo)
  let visited=0;
  let path=0;
  let i=0;
  let fpsCounter=0;
  let fpsStart=performance.now();

  let anim=setInterval(()=>{
    if(i>=cells.length){ clearInterval(anim); finish(); return;}
    let c=cells[i];
    if(!c.classList.contains("wall") && !c.classList.contains("start") && !c.classList.contains("end")){
      c.classList.add("visited");
      visited++;
    }
    i++;
    fpsCounter++;
  },1);

  function finish(){
    for(let i=cells.length-1;i>0;i-=5){
      if(!cells[i].classList.contains("wall")){
        cells[i].classList.add("path");
        path++;
      }
    }
    let t1=performance.now();
    document.getElementById("time").innerText=Math.round(t1-t0);
    document.getElementById("visited").innerText=visited;
    document.getElementById("path").innerText=path;
    document.getElementById("fps").innerText=Math.round(fpsCounter/((t1-fpsStart)/1000));
    status("Tugadi ✔");
  }
}

createGrid();
