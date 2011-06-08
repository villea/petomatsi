
var messages = {
    start : "Press OK to start",
    endLevel : "Level cleared. Prepare for next level",
    win : "You cleared all the levels! Grats!",
    die : "You died ! :("

}


var levelutil = {
    baseLevel : function(width,height){
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
}

function required(param,message){
    if (!param || param.length == 0)
    {
        throw new Error(message);
    }
}


function LevelManager(levelArray) {
  this.levelArray = levelArray;
  
  var currentIndex = 0;
  var lastLevelIndex = levelArray.length - 1;

  this.setNextLevel = function () {
       if (this.isLastLevel())
       {
           throw new Error("Current level is last one");
       } else {
           currentIndex++;
       }
  }

  this.getCurrentLevel = function () {
      return this.levelArray[currentIndex];
  }

  this.isLastLevel = function () {
     return currentIndex == lastLevelIndex;
  }
}


function PetoMatsi(canvasId,params) {

required(params.levels,"No levels for the game!");

var customColors = params.colors || {};
var colors = {0:customColors.empty || "blue",
              1:customColors.border || "red",
              2:customColors.mato || "yellow",
              3:customColors.nom || "white"};

var levelmanager = new LevelManager(params.levels);
var tbl = levelmanager.getCurrentLevel();
var mato = new Mato(1,1);
var score = 0;
var maxScore = params.maxScore || 9;
var speed = params.speed || 50;

var height = tbl.length;
var width = tbl[0].length;
var blockSize = params.blockSize || 10;

var ctx = createCanvas(canvasId,width*blockSize,height*blockSize);
var nom = null;


updateNom();
initControls();
drawLevel();

function initControls() {
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

}

function reset() {
   score = 0;
   tbl = levelmanager.getCurrentLevel();
   height = tbl.length;
   width = tbl[0].length;
   mato = new Mato(1,1);
   updateNom();
   ctx = createCanvas(canvasId,width*blockSize,height*blockSize);
   drawLevel();
}

function createCanvas(canvasId,width,height) {
    var c = document.getElementById(canvasId);
    c.width = width;
    c.height = height;
    var context = c.getContext('2d');
    context.fillStyle = "rgb(0,0,0)";
    context.fillRect(0, 0, c.width, c.height);
    return context;
}


function Mato(x,y) {
    this.direction = "r";
    this.startX = x;
    this.startY = y;
    this.endX = x;
    this.endY = y;
    this.size = 5;
    this.growAmount = 3;
    this.body = [[x,y]];
    //direction lock ensures that directions changes only
	//synchronized with game speed
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
        this.changeDir("d","u");
    }

    this.up = function (){
        this.changeDir("u","d");
    }

    this.left = function (){
        this.changeDir("l","r");
    }

    this.right = function (){
        this.changeDir("r","l");
    }


    this.changeDir = function(next,notallowed){
        if(!this.dlock)
        {
        this.direction = getAllowedDir(next,notallowed,this.direction);
        this.dlock = true;
        }
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
        this.size+=this.growAmount;
    }

    this.isDead = function () {
        return tbl[mato.startY][mato.startX] == 1 || tbl[mato.startY][mato.startX] == 2;
    }

    this.gotNom = function () {
        return tbl[mato.startY][mato.startX] == 3;
    }

    function getAllowedDir(nextDir,notAllowed,currentDir){
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
            case "r": x++;break;
            case "u": y--;break;
            case "l": x--;break;
            case "d": y++;break;
            default: throw new Error("Invalid direction");break;
            }
            return [x,y];
    }
            
}

function Nom(x,y){
    this.x = x;
    this.y = y;
}

function randomNom(){
    //TODO: This will suck when worm gets too long
    do
    {
    var y = Math.floor(height*Math.random());
    var x = Math.floor(width*Math.random());
    }
    while (tbl[y][x] != 0);
    return new Nom(x,y);
}

function draw(color,x,y) {
    ctx.fillStyle = colors[color];
    ctx.fillRect(x*blockSize,y*blockSize,blockSize,blockSize);
}



function drawLevel() {
    for (h = 0; h < height ; h++)
    {
      for (w = 0;  w < width;w++ )
      {
        draw(tbl[h][w],w,h);
      } 
    }
}

this.run = function (){
alert(messages.start);
var id= setInterval(function(){
    if (mato.isDead())
    {
        alert(messages.die);
        clearInterval(id);
    } else {
    if (mato.gotNom())
    {
       if (isLevelCleared())
       {
         if (isLastLevel())
         {
           alert(messages.win); 
           clearInterval(id);
         } else {
           alert(messages.endLevel);
           levelmanager.setNextLevel();
           reset();
         }
       } else {
         mato.grow();
         score+=1;
         nom = randomNom();
         tbl[nom.y][nom.x] = 3
         draw(3,nom.x,nom.y);
       }
    }
    updateMato();
    }
},speed);
}

function isLastLevel() {
       return levelmanager.isLastLevel();
}

function isLevelCleared() {
       return score == maxScore;
}

function updateNom(){
    nom = randomNom();
    tbl[nom.y][nom.x] = 3
}

function updateMato() {
    tbl[mato.endY][mato.endX] = 0;
    draw(0,mato.endX,mato.endY);
    tbl[mato.startY][mato.startX] = 2;
    draw(2,mato.startX,mato.startY);
    mato.move();
}

}