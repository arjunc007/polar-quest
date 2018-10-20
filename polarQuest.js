/*eslint-env browser*/

var width = 800;
var height = 600;

var c = document.createElement('canvas');
c.width = width;
c.height = height;
c.style.border = '1px solid #d3d3d3';
//c.addEventListener("click", onClick, false);
document.body.appendChild(c);

var jumpKey = false;
var leftKey = false;
var rightKey = false;

var ctx = c.getContext("2d");

var groundHeight = 500;

function timestamp() {
    "use strict";
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}

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
    this.speed = 20;
    this.jumpSpeed = 50;
    this.velocity = new Point(0, 0);
    this.isJumping = false;
    
    this.jump = function () {
        if (!this.isJumping) {
            this.velocity.y = -this.jumpSpeed;
            this.isJumping = true;
        }
    };
    
    this.update = function (dt) {
        if (leftKey) {
            this.pos.x -= this.speed * dt;
        } else if (rightKey) {
            this.pos.x += this.speed * dt;
        }
        if (jumpKey) {
            this.jump();
        }
        this.pos.y += Math.min(groundHeight, this.velocity.y * dt);
        
        if (this.isJumping) {
            this.velocity.y += 30 * dt;
        }
        
        if (this.pos.y > groundHeight) {
            this.velocity.y = 0;
            this.pos.y = groundHeight;
            this.isJumping = false;
        }
    };
    
    this.show = function () {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.pos.x, this.pos.y - this.height, this.width, this.height);
    };
}

var player = new Player(20, groundHeight);

function update(dt) {
    "use strict";
    player.update(dt);
}

function draw() {
    "use strict";
    ctx.fillStyle = "#2EFEF7";
    ctx.fillRect(0, 0, width, groundHeight);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, groundHeight, width, height);
    
    player.show();
}

var now, dt, last = timestamp();

//run the game loop
function frame() {
    "use strict";
    now = timestamp();
    dt = Math.min(1, (now - last) / 1000);   // duration capped at 1.0 seconds
    update(dt);
    draw();
    last = now;
    requestAnimationFrame(frame);
}

//start game
requestAnimationFrame(frame);

document.addEventListener('keydown', function (e) {
    "use strict";
    if (e.keyCode === 65) {   //A
        leftKey = true;
    } else if (e.keyCode === 68) {  //D
        rightKey = true;
    } else if (e.keyCode === 87) {   //W
        jumpKey = true;
    }
});

document.addEventListener('keyup', function (e) {
    "use strict";
    if (e.keyCode === 65) {   //A
        leftKey = false;
    } else if (e.keyCode === 68) {  //D
        rightKey = false;
    } else if (e.keyCode === 87) {   //W
        jumpKey = false;
    }
});