
var messages = {
	start : "Press OK to start",
	die : function (score) {
		return "You died! Score: "+score;
	}

}


function LevelCreator(width,height){
	this.width = width;
	this.height = height;
	this.level = [[]];

]



function PetoMatsi(canvasId) {


var colors = {0:"blue",
			  1:"red",
			  2:"yellow",
			  3:"white"};


function createDefaultFrame(width,height){
	var tb =[[]];
	
	for (h = 0;h < height ; h++ )
	{
     tb[h] = new Array();
	 for (w = 0; w < width; w++){

		if (h == 0 || h == (height - 1) || w == 0 || w == (width -1))
		{
			tb[h][w] = 1;
		} else {
			tb[h][w] = 0;
		}
	 }
	}
	return tb;
}

var tbl = createDefaultFrame(80,50);

function createCanvas(canvasId,width,height) {
	var example = document.getElementById(canvasId);
    example.width = width;
	example.height = height;
	var context = example.getContext('2d');
    context.fillStyle = "rgb(0,0,0)";
    context.fillRect(0, 0, example.width, example.height);
	return context;
}


function Mato(x,y) {
	this.direction = "e";
	this.startX = x;
	this.startY = y;
	this.endX = x;
	this.endY = y;
    this.size = 5;
    this.body = [[x,y]];
	this.dlock = true;
	this.move = function(){	
		if (this.body.length > this.size)
		{
			this.body.shift();
		}

		var nsd = m(this.direction);
		this.startX += nsd[0];
		this.startY += nsd[1];
		
		this.body.push([this.startX,this.startY]);
		
		var ned = this.body[0];
		this.endX = ned[0];
		this.endY = ned[1];
		this.dlock = false;
	}

	this.down = function(){
		this.changeDir("s","n");
	}

	this.up = function (){
		this.changeDir("n","s");
	}

	this.left = function (){
		this.changeDir("w","e");
	}

	this.right = function (){
		this.changeDir("e","w");
	}


    this.changeDir = function(next,notallowed){
		if(!this.dlock)
		{
		this.direction = _changeDir(next,notallowed,this.direction);
		this.dlock = true;
		}
	}

	this.print = function (){
		alert(this.startX+" "+this.startY+" | "+this.endY+" "+this.endX);
	}

	this.hitself = function (){
		if (this.body.length == 1)
		{
			return false;
		} else {
		for (i = 0; i < this.body.length-2 ; i++)
		{
			if(this.startX == this.body[i][0] &&
			   this.startY == this.body[i][1]){
					return true;
			   }
		}
		return false;
		}
	}

	this.grow = function (){
		this.size+=3;
	}

	function _changeDir(nextDir,notAllowed,currentDir){
		if (currentDir == notAllowed)
		{
		   return currentDir;
		} else {
			return nextDir;
		}
	}

	function m(dir){
			var x = 0;
			var y = 0;
			switch(dir){
			case "e": x++;break;
			case "n": y--;break;
			case "w": x--;break;
			case "s": y++;break;
			default: throw new Error("Invalid direction");break;
			}
			return [x,y];
	}
			
}

function Namu(x,y){
	this.x = x;
	this.y = y;
}

function randomNom(){
	do
	{
	var y = Math.floor(height*Math.random());
	var x = Math.floor(width*Math.random());
	}
	while (tbl[y][x] != 0);
	return new Namu(x,y);
}


height = tbl.length;
width = tbl[0].length;
size = 10;
ctx = createCanvas("game",width*size,height*size);




function draw(color,x,y) {
	ctx.fillStyle = colors[color];
	ctx.fillRect(x*size,y*size,size,size);
}



for (h = 0; h < height ; h++)
{
for (w = 0;  w < width;w++ )
{
	draw(tbl[h][w],w,h);
}
}



var mato = new Mato(5,5);

document.onkeydown=function(e){
 var e=window.event || e
 switch (e.keyCode)
 {
 case 37: mato.left();break;
 case 38: mato.up();break;
 case 39: mato.right();break;
 case 40: mato.down();break;
 
 }
}


var score = 0;

this.run = function (){

alert(messages.start);

nom = randomNom();

tbl[nom.y][nom.x] = 3


var id= setInterval(function(){
	
	
	if (tbl[mato.startY][mato.startX] == 1 || tbl[mato.startY][mato.startX] == 2)
	{
		alert(messages.die(score));
		clearInterval(id);
	} else {
	if (tbl[mato.startY][mato.startX] == 3)
	{
	   mato.grow();
	   score+=10;
	   nom = randomNom();
	   tbl[nom.y][nom.x] = 3
	   draw(3,nom.x,nom.y);
	}
	
	tbl[mato.endY][mato.endX] = 0;
	draw(0,mato.endX,mato.endY);
	tbl[mato.startY][mato.startX] = 2;
	draw(2,mato.startX,mato.startY);
	mato.move();
	}
},50);
}

}