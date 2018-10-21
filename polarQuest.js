/*eslint-env browser*/
/*jslint devel: true */

window.onload = function() {
    "use strict";
    var sources = {
        resource1: "img/32 x 32 platform character_idle_0.png",
        resource2: "img/32 x 32 platform character_idle_1.png",
        resource3: "img/32 x 32 platform character_idle_2.png",
        resource4: "img/32 x 32 platform character_idle_3.png",
        resource5: "img/32 x 32 platform character_jump_0.png",
        resource6: "img/32 x 32 platform character_jump_1.png",
        resource7: "img/run_right_0.png",
        resource8: "img/run_right_1.png",
        resource9: "img/run_right_2.png",
        resource10: "img/run_right_3.png",
        resource11: "img/run_right_4.png",
        resource12: "img/run_right_5.png",
        resource13: "img/run_left_0.png",
        resource14: "img/run_left_1.png",
        resource15: "img/run_left_2.png",
        resource16: "img/run_left_3.png",
        resource17: "img/run_left_4.png",
        resource18: "img/run_left_5.png",
        resource19: "img/jump_left_0.png",
        resource20: "img/jump_left_1.png"
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

var idleImages = [];
var jumpImages = [];
var runImages = [];
var animTimer = 0;

function Animation(imgList) {
    this.images = imgList;
    this.totalFrames = imgList.length;
    this.currentFrame = 0;
}

Animation.prototype.animate = function () {
    this.currentFrame++;
    if(this.currentFrame >= this.totalFrames) {
        this.currentFrame = 0;
    }
}
Animation.prototype.getImage = function() {
    return this.images[this.currentFrame];
}

function Player(x, y) {
    "use strict";
    this.currentAnim;
    this.animations = {};
    this.pos = new Point(x, y);
    this.color = "#FA5858";
    this.height = 40;
    this.width = 40;
    this.velocity = new Point(0, 0);
    this.isJumping = false;
    this.speed;
    this.jumpSpeed;

    this.animate = function() {
        if(this.isJumping) {
            this.image = this.animations["jump"].getImage();
        } else if (this.velocity.x === 0) {
            this.image = this.animations["idle"].getImage();
        } else {
            this.image = this.animations["run"].getImage();
        }
    }
    
    this.jump = function () {
        if (!this.isJumping) {
            this.velocity.y = -this.speed * 1.1;
            this.isJumping = true;
        }
    };
    
    this.update = function (dt) {

        if(this.isJumping) {
            if(this.velocity.x > 0) {
                this.currentAnim = this.animations["jumpRight"];
            } else {
                this.currentAnim = this.animations["jumpLeft"];
            }
        } else if (this.velocity.x < 0) {
            this.currentAnim = this.animations["runLeft"];
        } else if (this.velocity.x > x){
            this.currentAnim = this.animations["runRight"];
        } else {
            this.currentAnim = this.animations["idle"];
        }


        if (leftKey) {
            this.velocity.x = -this.speed;
        } else if (rightKey) {
            this.velocity.x = this.speed;
        }
        if (jumpKey) {
            this.jump();
        }
        
        animTimer += dt;
        
        if(animTimer > 0.25) {
            this.currentAnim.animate();
            animTimer = 0;
        }
        
        if (this.isJumping) {
            this.pos.x += this.velocity.x * dt;
            this.pos.y += this.velocity.y * dt;
            this.velocity.y += 60 * dt;
        } else {
            if(this.velocity.x > 0) {
                this.image = idleImages[0];
            } else if(this.velocity.x < 0) {
                this.image = idleImages[0];
            } else {
                this.image = idleImages[0];   
            }
            this.pos.x += this.velocity.x * dt;
            this.pos.y += this.velocity.y * dt;
            this.velocity.x *= 0.9;
            this.velocity.y *= 0.9;
        }
        
        if (this.pos.y > groundHeight) {
            this.velocity.y = 0;
            this.pos.y = groundHeight;
            this.isJumping = false;
        }
    };
    
    this.show = function () {
        if(this.currentAnim) {
            ctx.drawImage(this.currentAnim.getImage(), this.pos.x, this.pos.y - this.height, this.width, this.height);
        }
        else {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.pos.x, this.pos.y - this.height, this.width, this.height);
        }
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
    
    start();
}

function start() {
    if(loadComplete) {
        requestAnimationFrame(frame);
    }
    else {
        console.log("Still Loading Images");
        requestAnimationFrame(start);
    }
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
    for (var src in sources) {
        numImages++;
        images[src] = new Image();
        images[src].onload = function() {
            if(++loadedImages >= numImages) {
                var idleImages = [images.resource1, images.resource2, images.resource3, images.resource4];
                player.animations["idle"] = new Animation(idleImages);
                var jumpImages = [images.resource5, images.resource6];
                player.animations["jumpRight"] = new Animation(jumpImages);
                var jumpImages = [images.resource19, images.resource20];
                player.animations["jumpLeft"] = new Animation(jumpImages);
                var runImages = [images.resource7, images.resource8, images.resource9, images.resource10, images.resource11, images.resource12];
                player.animations["runRight"] = new Animation(runImages);
                var runImages = [images.resource13, images.resource14, images.resource15, images.resource16, images.resource17, images.resource18];
                player.animations["runLeft"] = new Animation(runImages);
                loadComplete = true;
            }
        };
        images[src].src = sources[src];
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
