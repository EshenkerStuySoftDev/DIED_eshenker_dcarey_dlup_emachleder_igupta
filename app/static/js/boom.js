var c = document.getElementById("board");
document.getElementById("restart").onclick = function() {
	restart();
}
var wd = c.width;
var ht = c.height;
var ctx = c.getContext("2d");
var lost = false;
var won = false;
var correct = 0;
var wrong = 0;
var time = 0;

var boardsize = 10;
var mineamount = 10;
var gameboard;
var timeouts = [];
//then, store when you create them

function main(){
	
	timeouts.push(setTimeout(updatetimer,1000));
	document.getElementById("info").innerHTML = "boardsize = " + boardsize + " <br> mineamount = " + mineamount;
	ctx.fillStyle = "gray";
	ctx.fillRect(0,0,wd,ht);
	drawBoard();
	gameboard = Board();
	gameboard = prime(gameboard);
	gameboard = findneighbors(gameboard);
}

function restart(){
	for (var i = 0; i < timeouts.length; i++) {
		clearTimeout(timeouts[i]);
	}
	timeouts = [];
	lost = false;
	won = false;
	correct = 0;
	wrong = 0;
	time = 0;
	document.getElementById("status").innerHTML = "Make a Move!";
	document.getElementById("time").innerHTML = "Time Passed: " + time + " seconds.";
	main();
}



function updatetimer(){
	if (!won && !lost) {
		time++;
		document.getElementById("time").innerHTML = "Time Passed: " + time + " seconds.";
		timeouts.push(setTimeout(updatetimer,1000));
	}
}

function drawBoard(){
	ctx.strokeStyle = "black";
	ctx.lineWidth = 2;
	for (var x = 0; x < boardsize; x++){
		ctx.beginPath();
		ctx.moveTo(x*wd/boardsize,0);
		ctx.lineTo(x*wd/boardsize,ht);
		ctx.stroke();
	}
	for (var x = 0; x < boardsize; x++){
		ctx.beginPath();
		ctx.moveTo(0,x*ht/boardsize);
		ctx.lineTo(wd,x*ht/boardsize);
		ctx.stroke();
	}

}

function Cell(row, column, opened, flagged, primed, neighborMineCount) 
{
	return {
		id: row + ":" + column,
		row: row,
		column: column,	
		opened: opened,
		primed: primed,
		neighborMineCount: neighborMineCount,
		flagged: flagged
		
	}
}

function Board()
{
	var board = {};
	for(var row = 0; row < boardsize; row++)
	{
		for(var column = 0; column < boardsize; column++)
		{
			board[row + ":" + column] = Cell(row, column, false, false, 0, false);
		}
	}
	return board;
}

let prime = function(board)
{
	let mineloc = [];
	for(let i = 0; i < mineamount; i++)
	{
		let row = getRandomInteger(0, boardsize);
		let column = getRandomInteger(0, boardsize);
		let cell = row + ":" + column;
		while(mineloc.includes(cell))
		{
			row = getRandomInteger(0, boardsize);
			column = getRandomInteger(0, boardsize);
			cell = row + ":" + column;
		}
		mineloc.push(cell);
		board[cell].primed = true;
	}
	return board;
}

let getRandomInteger = function(min, max)
{
	return Math.floor(Math.random() * (max - min)) + min;
}

let findneighbors = function(board)
{
	let cell;
	let neighborMineCount = 0;
	for(let row = 0; row < boardsize; row++)
	{
		for(let column = 0; column < boardsize; column++)
		{
			let id = row + ":" + column;
			cell = board[id];
			if(!cell.primed)
			{

				let neighbors = getNeighbors(id);
				neighborMineCount = 0;
				for(let i = 0; i < neighbors.length; i++)
				{
					let cell = gameboard[neighbors[i]];
					let primed = 0;
					if(typeof cell != 'undefined')
					{
						if (cell.primed){
							primed = 1;
						} else {
							primed = 0;
						}
					}

					neighborMineCount += primed;
				}
				cell.neighborMineCount = neighborMineCount;
			}
		}
	}
	return board;
}

let getNeighbors = function(id)
{
	id = id.split(":");
	let row = parseInt(id[0]);
	let column = parseInt(id[1]);

	let neighbors = [];
	neighbors.push((row - 1) + ":" + (column - 1));
	neighbors.push(row + ":" + (column - 1));
	neighbors.push((row + 1) + ":" + (column - 1));
	neighbors.push((row - 1) + ":" + column);
	neighbors.push(row + ":" + (column + 1));
	neighbors.push((row + 1) + ":" + column);
	neighbors.push((row - 1) + ":" + (column + 1));
	neighbors.push((row + 1) + ":" + (column + 1));

	for(let i = 0; i < neighbors.length; i++)
	{ 
		var loc = neighbors[i].split(":");
		if (loc[0] < 0 || loc[0] >= boardsize || loc[1] < 0 || loc[1] >= boardsize) 
		{
			neighbors.splice(i, 1); 
			i--;
		}
	}
	return neighbors
}

let isprimed = function(board, id)
{	
	let cell = board[id];
	let primed = 0;

	if(typeof cell != 'undefined')
	{

		if (cell.primed){
			primed = 1;
		} else {
			primed = 0;
		}
	}
	return primed;
}

let boardclicked = (e) => {
	if (!lost && !won) {

		let x = e.offsetX;
		let y = e.offsetY;

		x = Math.floor(x/(wd/boardsize));
		y = Math.floor(y/(ht/boardsize));

		if (gameboard[x+":"+y].primed) {
			ctx.fillStyle = "black";
			ctx.fillRect(x*(wd/boardsize),y*(ht/boardsize),(wd/boardsize),(ht/boardsize));
			
			gamelost(x+":"+y);
		} else {

			checktile(x+":"+y);
		}

		//for reseting grid
		drawBoard();
	}
  }

c.addEventListener('click', boardclicked);

let boardrightclicked = (e) => {
	e.preventDefault();
	if (!lost && !won) {

		let x = e.offsetX;
		let y = e.offsetY;

		x = Math.floor(x/(wd/boardsize));
		y = Math.floor(y/(ht/boardsize));
		if (!gameboard[x+":"+y].opened){

			if (!gameboard[x+":"+y].flagged) {
				gameboard[x+":"+y].flagged = true;
				ctx.fillStyle = "red";
				ctx.fillRect(x*(wd/boardsize)+(wd/boardsize)/4,y*(ht/boardsize)+(wd/boardsize)/4,(wd/boardsize)/2,(ht/boardsize)/2);
				if (gameboard[x+":"+y].primed) {
					correct++;
					if (correct >= mineamount){
						gamewon();
					}
					
				} else {
					wrong++;
				}
				
			} else if (gameboard[x+":"+y].flagged){
				gameboard[x+":"+y].flagged = false;
				ctx.fillStyle = "grey";
				ctx.fillRect(x*(wd/boardsize),y*(ht/boardsize),(wd/boardsize),(ht/boardsize));
				if (gameboard[x+":"+y].primed) {
					correct--;
					
				} else {
					wrong--;
				}
				
			}
		}

		//for reseting grid
		drawBoard();
	}
  }

c.addEventListener('contextmenu', boardrightclicked);

needtobechecked = [];

function checktile(tileid){

	id = tileid.split(":");
	let x = parseInt(id[0]);
	let y = parseInt(id[1]);
	gameboard[x+":"+y].opened = true;
	ctx.fillStyle = "lightgrey";
	ctx.fillRect(x*(wd/boardsize),y*(ht/boardsize),(wd/boardsize),(ht/boardsize));

	if (gameboard[x+":"+y].neighborMineCount > 0){
		var textsize = Math.floor(wd/boardsize);
		ctx.font = textsize + 'px serif';
		ctx.fillStyle = "blue";
		ctx.fillText(gameboard[x+":"+y].neighborMineCount.toString(), x*(wd/boardsize)+(wd/boardsize)/4,(y+1)*(ht/boardsize)-(ht/boardsize)/5);
	} else {
		let neighbors = getNeighbors(x+":"+y);
		neighborMineCount = 0;
		for(let i = 0; i < neighbors.length; i++)
		{

			if (!gameboard[neighbors[i]].opened){

				checktile(neighbors[i]);
			}
			
			
		}
	}	
}

function gamewon(){

	document.getElementById("status").innerHTML = "You won in " + time + " seconds!";
	won = true;
}

function gamelost(loseid){
	clearTimeout();
	lost = true;
	document.getElementById("status").innerHTML = "You lost after " + time + " seconds.";
	let cell;
	let neighborMineCount = 0;
	for(let x = 0; x < boardsize; x++)
	{
		for(let y = 0; y < boardsize; y++)
		{
			let id = x + ":" + y;
			if (id != loseid){
				cell = gameboard[id];
				if (cell.primed == true) {
					ctx.fillStyle = "black";
					ctx.fillRect(x*(wd/boardsize),y*(ht/boardsize),(wd/boardsize),(ht/boardsize));
				} else if (cell.neighborMineCount > 0){
					ctx.fillStyle = "lightgrey";
					ctx.fillRect(x*(wd/boardsize),y*(ht/boardsize),(wd/boardsize),(ht/boardsize));
					var textsize = Math.floor(wd/boardsize);
					ctx.font = textsize + 'px serif';
					ctx.fillStyle = "blue";
					ctx.fillText(gameboard[x+":"+y].neighborMineCount.toString(), x*(wd/boardsize)+(wd/boardsize)/4,(y+1)*(ht/boardsize)-(ht/boardsize)/5);

				} else {
					ctx.fillStyle = "lightgrey";
					ctx.fillRect(x*(wd/boardsize),y*(ht/boardsize),(wd/boardsize),(ht/boardsize));
				}
			}
			

		}
	}
	cell = gameboard[loseid];
	loseid = loseid.split(":");
	let x = parseInt(loseid[0]);
	let y = parseInt(loseid[1]);
	ctx.fillStyle = "black";
	ctx.fillRect(x*(wd/boardsize),y*(ht/boardsize),(wd/boardsize),(ht/boardsize));
	ctx.strokeStyle = "red";
	ctx.beginPath();
	ctx.moveTo(x*(wd/boardsize),y*(ht/boardsize));
	ctx.lineTo((1+x)*(wd/boardsize),(y+1)*(ht/boardsize));
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo((1+x)*(wd/boardsize),y*(ht/boardsize));
	ctx.lineTo(x*(wd/boardsize),(y+1)*(ht/boardsize));
	ctx.stroke();
}

main();
