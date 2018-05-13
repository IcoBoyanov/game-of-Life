
var width = grid_size * 50;
var height = grid_size * 50;
var grid_size = 10;
var game_fps = 250;
var anim_speed = 25;


var canvas = document.getElementById('canvas');
canvas.width = width;
canvas.height = height;
var ctx = canvas.getContext('2d');

ctx.fillStyle = 'green';


var time = new Number();
var isPlaying = false;

var rows = height/grid_size;
var cols = width/grid_size;
grid = new Array(rows);
for (var i = 0; i < rows; i++) {
	grid[i] = new Array(cols);
}

for (var i = 0; i < rows; i++) {
	for (var j = 0; j < cols; j++) {
		grid[i][j] = 0;
	}
}
var temp = Grid(rows, cols);

// HTML Elements
var gen_count = document.getElementById('gen_count');
var cell_count = document.getElementById('cell_count');

// stats
var liveCells = 0;


function init()
{

	var grid = Grid(rows, cols);
	drawGrid(grid);
}

function draw()
{
	console.log("draw");
	drawGrid();

	gen_count.innerText = parseInt(gen_count.innerText) +1;

	// do some stuff
	temp = updateGrid(temp);


	grid = temp.slice();
}

function Grid( rows, cols)
{

	grid = new Array(rows);
	for (var i = 0; i < rows; i++) {
		grid[i] = new Array(cols);
	}

	for (var i = 0; i < rows; i++) {
		for (var j = 0; j < cols; j++) {
			grid[i][j] = 0;
		}
	}
	return grid;
}

function drawGrid()
{

	cell_count.innerText = "" +liveCells;
	for (var i = 0; i < rows; i++) {
		for (var j = 0; j < cols; j++) {
			
			if(grid[i][j] > 0)
			{
				// blue color represents older cells
				// green represents the new cells
				if (grid[i][j] < Math.floor(230 / anim_speed)) {
					ctx.fillStyle = 'rgb(0,'+ (255 - grid[i][j]*anim_speed)+','+ (grid[i][j]*anim_speed)+')';
				}
				else
				{
					ctx.fillStyle = 'rgb(0,20,220)';	
				}
			}
			else
			{
				ctx.fillStyle = 'rgb(230,230,230)';

			}
			ctx.fillRect(j*grid_size, i*grid_size, grid_size-1, grid_size-1);

			// make a function that transitions smoothly from one color to another
			//popCell(i,j);

		}
	}
}

function randomSeed()
{
	for (var i = 0; i < rows; i++) {
		for (var j = 0; j < cols; j++) {
			if(Math.random(1998)*100 <= 20)
			{
				grid[i][j] = 1;
			}
		}
	}
	drawGrid();
}


function stopGame()
{
	isPlaying = false;
	window.clearInterval(time);
}

function startGame()
{

	isPlaying = true;
	time = window.setInterval(draw, game_fps);
}

init();

// click events

canvas.addEventListener('click', function (e) {
	// body...

	toggleCel(e.offsetX, e.offsetY);
	
});


function toggleCel(mX,mY)
{
	let cellCol = Math.floor(mX / grid_size);
	let cellRow = Math.floor(mY / grid_size);
	if (grid[cellRow][cellCol] == 1)
	{
		grid[cellRow][cellCol] = 0;
		liveCells -=1;
	}
	else
	{
		grid[cellRow][cellCol] = 1;
		liveCells +=1;
	
	}
	drawGrid();
}

function ageCell(row,col,i)
{
	setTimeout(function () {    //  call a 3s setTimeout when the loop is called
		//console.log(i);
		if (anim_speed/ (i) > 1 ) {
			ctx.fillStyle = 'rgb(0,'+ (255 - grid[row][col]*anim_speed)+','+ (grid[row][col]*anim_speed)+')';
				
		}else{
			console.log('rgb(0,'+ (255 -( (grid[row][col] - 1)*anim_speed + i))+','+ ( (grid[row][col] -1 )*anim_speed +i)+')');
			ctx.fillStyle = 'rgb(0,'+ (255 -( (grid[row][col] - 1)*anim_speed + i))+','+ ( (grid[row][col] -1 )*anim_speed +i)+')';	
		}
					
		ctx.fillRect(col*grid_size, row*grid_size, grid_size-1, grid_size-1);
		//  your code here
	    i++;                     //  increment the counter
	    if (i < anim_speed) {            //  if the counter < 10, call the loop function
	        ageCell(col,row,i);             //  ..  again which will trigger another 
	    }                        //  ..  setTimeout()
	   }, Math.floor(game_fps / anim_speed*2))

}
function killCell(row,col,i)
{
	setTimeout(function () {    //  call a 3s setTimeout when the loop is called
	      
			
		if (i*anim_speed > 230) {
			ctx.fillStyle = 'rgb(0,230,230)';
		}else{

		ctx.fillStyle = 'rgb(' +(i * anim_speed)+ ',240,240)';	
		}
					
		ctx.fillRect(col*grid_size, row*grid_size, grid_size-1, grid_size-1);
		//  your code here
	    i++;                     //  increment the counter
	    if (i < anim_speed) {            //  if the counter < 10, call the loop function
	        killCell(col,row,i);             //  ..  again which will trigger another 
	    }                        //  ..  setTimeout()
	   }, Math.floor(game_fps / anim_speed*2))

}

// math part

function updateGrid(curr_grid)
{
	// cells to die
	for (var i = 0; i < rows ; i++) {
		for (var j = 0; j < cols ; j++) {
			let neighbours = countNeighbours(i,j);
			if (grid[i][j] >= 1)
			{
				if (neighbours <2 || neighbours >3) {
					// dies
					//killCell(i,j,1); // too heavy to work
					curr_grid[i][j] = 0;
					liveCells -=1;
				}else{
					// stays alive
					//ageCell(i,j,1); // too heavy to work
					curr_grid[i][j] = grid[i][j]+1;
				}
			}else{
				if (neighbours == 3) {
					// birth
					curr_grid[i][j] = 1;
					liveCells +=1;
				}
				else{
					// stays dead
					curr_grid[i][j] = 0;
				}
			}
		}
	}

	// cells birth

	return curr_grid;
}

function countNeighbours(row,col)
{
	let count = 0;
	for (var i = row -1; i <= row +1; i++) {
		for (var j = col -1; j <= col +1; j++) {
			if (i < 0 || i > rows - 1 ||
				j < 0 || j > cols - 1) {
				continue;
			}
			count += (grid[i][j] != 0);
		}
	}
	return count - (grid[row][col] != 0);
}