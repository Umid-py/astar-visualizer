const rows=25, cols=30;
let grid=[];
let startNode=null,endNode=null;
let mouseDown=false;
let clickStage=0;
let visitedCounter=0;

document.body.onmousedown=()=>mouseDown=true;
document.body.onmouseup=()=>mouseDown=false;

document.addEventListener("keydown",e=>{
    if(e.code==="Space") startSearch();
    if(e.key==="c"||e.key==="C") resetGrid();
});

function createGrid(){
    const gridDiv=document.getElementById("grid");
    gridDiv.innerHTML="";
    grid=[];

    for(let r=0;r<rows;r++){
        let row=[];
        for(let c=0;c<cols;c++){
            const cell=document.createElement("div");
            cell.className="cell";
            gridDiv.appendChild(cell);

            let node={
                r,c,f:0,g:Infinity,h:0,
                neighbors:[],parent:null,
                wall:false,element:cell
            };

            cell.onmousedown=()=>handleClick(node);
            cell.onmouseover=()=>{ if(mouseDown && clickStage>=2) addWall(node); };

            row.push(node);
        }
        grid.push(row);
    }
    addNeighbors();
}

function handleClick(node){
    if(clickStage===0){
        startNode=node;
        node.element.classList.add("start");
        clickStage++;
    } else if(clickStage===1 && node!==startNode){
        endNode=node;
        node.element.classList.add("end");
        clickStage++;
    } else if(clickStage>=2){
        addWall(node);
    }
}

function addWall(node){
    if(node!==startNode && node!==endNode){
        node.wall=true;
        node.element.classList.add("wall");
    }
}

function addNeighbors(){
    for(let r=0;r<rows;r++){
        for(let c=0;c<cols;c++){
            let n=grid[r][c];
            for(let dr=-1;dr<=1;dr++){
                for(let dc=-1;dc<=1;dc++){
                    if(dr===0 && dc===0) continue;
                    let nr=r+dr,nc=c+dc;
                    if(nr>=0 && nc>=0 && nr<rows && nc<cols)
                        n.neighbors.push(grid[nr][nc]);
                }
            }
        }
    }
}

function heuristic(a,b){
    return Math.hypot(a.r-b.r,a.c-b.c);
}

async function startSearch(){
    if(!startNode||!endNode) return alert("Start va End tanlang!");

    let open=[startNode];
    startNode.g=0;

    while(open.length>0){
        let current=open.reduce((a,b)=>a.f<b.f?a:b);

        if(current===endNode){
            drawPath(current);
            return;
        }

        open=open.filter(n=>n!==current);

        for(let neighbor of current.neighbors){
            if(neighbor.wall) continue;

            let tempG=current.g+heuristic(current,neighbor);

            if(tempG<neighbor.g){
                neighbor.parent=current;
                neighbor.g=tempG;
                neighbor.h=heuristic(neighbor,endNode);
                neighbor.f=neighbor.g+neighbor.h;

                if(!open.includes(neighbor)){
                    open.push(neighbor);
                    if(neighbor!==endNode){
                        neighbor.element.classList.add("visited");
                        visitedCounter++;
                        document.getElementById("visitedCount").innerText=visitedCounter;
                    }
                }
            }
        }
        await sleep(15);
    }
    alert("Yo‘l topilmadi");
}

function drawPath(node){
    let length=0;
    while(node.parent){
        node=node.parent;
        node.element.classList.add("path");
        length++;
    }
    document.getElementById("pathLength").innerText=length;
}

function resetGrid(){
    clickStage=0;
    startNode=null;
    endNode=null;
    visitedCounter=0;
    document.getElementById("visitedCount").innerText=0;
    document.getElementById("pathLength").innerText=0;
    createGrid();
}

function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }

createGrid();
