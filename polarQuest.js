/*eslint-env browser*/

var FPS = 30;

var width = 800;
var height = 600;

var c = document.createElement('canvas');
c.width = width;
c.height = height;
c.style.border = '1px solid #d3d3d3';
//c.addEventListener("click", onClick, false);
document.body.appendChild(c);

var ctx = c.getContext("2d");

var groundHeight = 500;

function Point(x, y) {
    "use strict";
    this.x = x;
    this.y = y;
}

function Player(x, y) {
    "use strict";
    this.pos = new Point(x, y);
    this.color = "#FA5858";
    this.height = 30;
    this.width = 10;
    this.speed = 5;
    
    this.moveLeft = function () {
        this.pos.x -= this.speed;
    };
    
    this.moveRight = function () {
        this.pos.x += this.speed;
    };
    
    this.show = function () {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.pos.x, this.pos.y - this.height, this.width, this.height);
    };
}

var player = new Player(20, groundHeight);

function update() {
    "use strict";
}

function draw() {
    "use strict";
    ctx.fillStyle = "#2EFEF7";
    ctx.fillRect(0, 0, width, groundHeight);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, groundHeight, width, height);
    
    player.show();
}

setInterval(function () {
    "use strict";
    update();
    draw();
}, 1000 / FPS);

document.addEventListener('keydown', function (e) {
    "use strict";
    if (e.keyCode === 65) {   //A
        player.moveLeft();
    } else if (e.keyCode === 68) {  //D
        player.moveRight();
    }
});