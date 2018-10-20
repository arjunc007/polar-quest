/*eslint-env browser*/
/*jslint devel: true */

window.onload = function() {
    "use strict";
    var sources = {
        resource1: "img/32 x 32 platform character_idle_0.png",
        resource2: "img/32 x 32 platform character_idle_1.png",
        resource3: "img/32 x 32 platform character_idle_2.png",
        resource4: "img/32 x 32 platform character_idle_3.png",
        resource5: "32 x 32 platform character_jump_0.png",
        resource6: "img/32 x 32 platform character_jump_1.png",
        resource7: "img/32 x 32 platform character_run_0.png",
        resource8: "img/32 x 32 platform character_run_1.png",
        resource9: "img/32 x 32 platform character_run_2.png",
        resource10: "img/32 x 32 platform character_run_3.png",
        resource11: "img/32 x 32 platform character_run_4.png",
        resource12: "img/32 x 32 platform character_run_5.png"
    };
    loadImages(sources);
};

var loadComplete = false;

var width = 800;
var height = 600;

var c = document.createElement('canvas');
c.width = width;
c.height = height;
c.style.border = '1px solid #d3d3d3';
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

var totalFood = 1000;
var totalFuel = 1000;
var vehicles = ["On Foot", "Sled & Dogs", "Truck", "Motorbike"];

function Player(x, y) {
    "use strict";
    this.pos = new Point(x, y);
    this.color = "#FA5858";
    this.height = 30;
    this.width = 10;
    this.velocity = new Point(0, 0);
    this.isJumping = false;
    
    this.jump = function () {
        if (!this.isJumping) {
            this.velocity.y = -this.speed * 1.1;
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



var player =new Player(20, groundHeight);
var now, dt, last = timestamp();

var currentFood, currentFuel, currentVehicle;

function update(dt) {
    "use strict";
    player.update(dt);
    if (currentVehicle === "Truck") {
        currentFuel -= 20 * dt;
    }
    currentFood -= 10 * dt;
    
    if (currentFood < 0 || currentFuel < 0) {
        console.log("Expedition failed");
    }
}

function draw() {
    "use strict";
    ctx.fillStyle = "#2EFEF7";
    ctx.fillRect(0, 0, width, groundHeight);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, groundHeight, width, height);
    
    player.show();
}

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
function startgame() {
    "use strict";
    document.getElementById("div1").style.display = 'none'
    document.getElementById("display").style.display = 'block';

    currentFood = document.getElementById("foodquantity").value;
    currentFuel = document.getElementById("fuelquantity").value;
    currentVehicle = document.getElementById("transporttypes").value;
    
   switch (currentVehicle) {
        case "On Foot":     
            player.speed = 50;
            break;
        case "Sled & Dogs":
            player.speed = 70;
            break;
        case "Truck":
            player.speed = 90;
            break;
        case "Motorbike":
            player.speed = 100;
            break;
        }
    
    //while (!loadComplete) {/*do nothing*/}
    
    requestAnimationFrame(frame);
}

function startScreen() {
    "use strict";
    var grd = ctx.createRadialGradient(75, 50, 5, 90, 60, 100);
    grd.addColorStop(0, "red");
    grd.addColorStop(1, "white");

    // Fill with gradient
    ctx.fillStyle = grd;
    ctx.fillRect(10, 10, width, height);
    requestAnimationFrame(startScreen);
}

function loadImages(sources) {
    "use strict";
    var images = {};
    var loadedImages = 0;
    var numImages = 0;
    for(var src in sources) {
        numImages++;
    }
    for (src in sources) {
        images[src] = new Image();
        images[src].onload = function() {
            if(++loadedImages >= numImages) {
                loadComplete = true;
            }
            images[src].src = sources[src];
        }
    }
    
}

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
                
    function getjumpspeed(Speed) {
        "use strict";
        return 1.1*Speed;
        
    }
