const rows = 20;
const cols = 20;
let grid = [];
let startNode = null;
let endNode = null;

function createGrid() {
    const gridDiv = document.getElementById("grid");
    gridDiv.innerHTML = "";
    grid = [];

    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            cell.dataset.row = r;
            cell.dataset.col = c;

            cell.onclick = () => toggleCell(cell, r, c);
            gridDiv.appendChild(cell);

            row.push({
                r, c,
                f:0,g:0,h:0,
                neighbors:[],
                parent:null,
                wall:false,
                element: cell
            });
        }
        grid.push(row);
    }

    addNeighbors();
}

function toggleCell(cell,r,c){
    let node = grid[r][c];

    if(!startNode){
        startNode=node;
        cell.classList.add("start");
        return;
    }

    if(!endNode && node!==startNode){
        endNode=node;
        cell.classList.add("end");
        return;
    }

    node.wall=!node.wall;
    cell.classList.toggle("wall");
}

function addNeighbors(){
    for(let r=0;r<rows;r++){
        for(let c=0;c<cols;c++){
            let n=grid[r][c];
            if(r>0) n.neighbors.push(grid[r-1][c]);
            if(r<rows-1) n.neighbors.push(grid[r+1][c]);
            if(c>0) n.neighbors.push(grid[r][c-1]);
            if(c<cols-1) n.neighbors.push(grid[r][c+1]);
        }
    }
}

function heuristic(a,b){
    return Math.abs(a.r-b.r)+Math.abs(a.c-b.c);
}

async function startSearch(){
    let open=[startNode];
    let closed=[];

    while(open.length>0){
        let current=open.reduce((a,b)=> a.f<b.f?a:b);

        if(current===endNode){
            drawPath(current);
            return;
        }

        open=open.filter(n=>n!==current);
        closed.push(current);

        for(let neighbor of current.neighbors){
            if(closed.includes(neighbor)||neighbor.wall) continue;

            let tempG=current.g+1;
            let newPath=false;

            if(open.includes(neighbor)){
                if(tempG<neighbor.g){
                    neighbor.g=tempG;
                    newPath=true;
                }
            } else{
                neighbor.g=tempG;
                open.push(neighbor);
                newPath=true;
            }

            if(newPath){
                neighbor.h=heuristic(neighbor,endNode);
                neighbor.f=neighbor.g+neighbor.h;
                neighbor.parent=current;
            }
        }

        if(current!==startNode)
            current.element.classList.add("visited");

        await sleep(30);
    }

    alert("Yo‘l topilmadi 😢");
}

function drawPath(node){
    let temp=node;
    while(temp.parent){
        temp.element.classList.add("path");
        temp=temp.parent;
    }
}

function sleep(ms){
    return new Promise(r=>setTimeout(r,ms));
}

function clearGrid(){
    startNode=null;
    endNode=null;
    createGrid();
}

createGrid();
