/*eslint-env browser*/
/*jslint devel: true */

window.onload = function() {
    "use strict";
    var sources = {       resource0: "img/BG.png",
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
c.style.position = 'absolute';
document.body.appendChild(c);

function createPopup() {
    "use strict";
    var pop = document.createElement('div');
    pop.width = width;
    pop.height = height;
    pop.style.border = '1px solid #d3d3d3';
    pop.style.position = 'absolute';
    
    //Title
    var title = document.createElement('h3');
    title.id = 'PopTitle';
    title.textContent = 'Title';
    pop.appendChild(title);
    
    //Image
    var img = document.createElement('img');
    img.id = 'PopImg';
    img.src = '';
    img.height = height/3;
    img.width = width/3;
    pop.appendChild(img);    
    
    //Body
    var body = document.createElement('div');
    body.setAttribute('style', 'white-space: pre-line;'); // needed for line breaks
    body.id = 'PopBody';
    body.textContent = 'Body';
    pop.appendChild(body);
    
    //Form
    var form = document.createElement('form');
    pop.appendChild(form);
    // <input type="radio" name="group1" id="r1" value="1" /><label for="r1"> button one</label>
    var inA = document.createElement('input');
    var inB = document.createElement('input');
    inA.type ="radio";
    inB.type="radio";
    inA.name="PopRadio";
    inB.name="PopRadio";    
    inA.id="PopRadioA";
    inB.id="PopRadioB";
    inA.value = 'A';
    inB.value = 'B';
    inA.checked = true;
   
    var lblA = document.createElement('label');
    var lblB = document.createElement('label');    
    lblA.for = 'PopRadioA';
    lblB.for = 'PopRadioB';
    lblA.id = 'PopRadioLblA';
    lblB.id = 'PopRadioLblB';    
    
    form.appendChild(document.createElement('br'));
    form.appendChild(inA);
    form.appendChild(lblA);
    form.appendChild(document.createElement('br'));
    form.appendChild(inB);
    form.appendChild(lblB);
    
    //Close 
    var close = document.createElement('span');
    close.id = 'PopClose'
    close.textContent = 'Close';
    close.onclick = closePopup;
    pop.appendChild(document.createElement('br'));
    pop.appendChild(close);    
    
    return pop;
}

function closePopup()
{

   switch(document.getElementById('PopTitle').textContent) {
       case "Polar bears":
            ans2 = true;
            if(document.getElementById("PopRadioA").checked) {
                currentFuel -= 10;
            } else {
                currentFuel -= 100;
                currentFood -= 300;
            }
            break;
       case "Arctic sea ice retreat":
            ans1 = true;
            if(document.getElementById("PopRadioA").checked) {
                currentFuel -= 90;
                currentFood -= 50;
            } else {
                currentFuel = 0;
                currentFood = 0;
            }
            break;
        case "Melt ponds":
            ans3 = true;
           if(document.getElementById("PopRadioA").checked) {
                currentFuel -= 60;
                currentFood -= 20;
            } else {
                currentFood -= 70;
            }
            break;
        default: console.log("Invalid Option");
            break;
   }
    hidePopup();
}

var pop = createPopup();
document.body.appendChild(pop);
hidePopup();
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

var dist = 0;

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
        //handle input
        if (leftKey) {
            this.velocity.x = -this.speed;
        } else if (rightKey) {
            this.velocity.x = this.speed;
        }
        if (jumpKey) {
            this.jump();
        }

        //select current animation state
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
        
        //animate player
        animTimer += dt;
        if(animTimer > 0.25) {
            this.currentAnim.animate();
            animTimer = 0;
        }
        
        //Control jumping physics
        if (this.isJumping) {
            this.pos.x += this.velocity.x * dt;
            this.pos.y += this.velocity.y * dt;
            this.velocity.y += 60 * dt;
        } else {
            this.pos.x += this.velocity.x * dt;
            this.pos.y += this.velocity.y * dt;
            this.velocity.x *= 0.9;
            this.velocity.y *= 0.9;
        }

        //Start scrolling background
        if(player.pos.x > c.width * 0.25)
        {
            player.pos.x = c.width * 0.25;
            background.posX[0] -= this.velocity.x * dt;
        } else if(player.pos.x < 0) {
            player.pos.x = 0;
            background.posX[0] -= this.velocity.x * dt;
        }

        //keep player above ground
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
var background = {
    image: null,
    posX: [0, 0],
    show: function() {
        if(this.image)
        {
            let scaledWidth = (groundHeight * background.image.width) / background.image.height;
            ctx.drawImage(this.image, this.posX[0], 0, scaledWidth, groundHeight);
            ctx.drawImage(this.image, this.posX[1], 0, scaledWidth, groundHeight);
        }
    },
    update: function() {
        this.posX[1] = this.posX[0] + this.image.width;
        console.log(this.posX);
        console.log(this.image);
        if(this.posX[0] < -this.image.width) {
            this.posX[0] = this.posX[1] + this.image.width;
        } else if(this.posX[0] > 0) {
            this.posX[0] = 0;
        }
    }
};
var now, dt, last = timestamp();

var currentFood, currentFuel, currentVehicle;
var ans1 = false, ans2 = false, ans3 = false;

//main update loop
function update(dt) {
    "use strict";

    dist = player.pos.x - background.posX[0];
    //Game popup logic
    if (dist > 700 && !ans3) {
        setPopup(melt_ponds);
        showPopup();
    } else if(dist > 550 && !ans2) {
        setPopup(polar_bears);
        showPopup();
    } else if(dist > 400 && !ans1)
    {
        setPopup(sea_ice);
        showPopup();
    }

    player.update(dt);
    background.update(dt);
    if (currentVehicle === "Truck") {
        currentFuel -= 20 * dt;
    }
    currentFood -= 10 * dt;
    currentFuel -= 10 * dt;
    
    if (currentFood < 0 || currentFuel < 0) {
        //console.log("Expedition failed");
    }
}

function draw() {
    "use strict";
    //Sky
    //ctx.fillStyle = "#2EFEF7";
    //ctx.fillRect(0, 0, width, groundHeight);
    //Background
    background.show();    
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
    document.getElementById("div2").style.display = 'none'
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
    
    //while (!loadComplete) {/*do nothing*/}
    
    requestAnimationFrame(frame);
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
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.font="20px sans-serif";
    ctx.fillText("Choose your food and fuel to start",10,100); 

    // Fill with gradient
    requestAnimationFrame(startScreen);
    
}

startScreen();
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
                background.image = images.resource0;
                background.image.width = (groundHeight * background.image.width) / background.image.height;
                background.image.height = groundHeight;
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

    function showPopup() {
        "use strict";
        c.style.visibility = 'hidden';
        pop.style.visibility = 'visible';
    }
    
    function hidePopup() {
        "use strict";
        c.style.visibility = 'visible';
        pop.style.visibility = 'hidden';
    }
    
    function setPopup(popContents) {
        document.getElementById("PopTitle").textContent = popContents.title;
        document.getElementById("PopImg").src =  popContents.image;
        document.getElementById("PopBody").textContent = popContents.body;
        document.getElementById("PopRadioLblA").textContent = popContents.radio.A;
        document.getElementById("PopRadioLblB").textContent = popContents.radio.B;
        
    }
    
    var melt_ponds = {
        "title":"Melt ponds",
        "image":"img/melt_pools.jpg",
        "body":"Melt ponds are pools of water which form on top of sea ice or glaciers. Scientists can" +
               " use melt pond data as a tool to predict how much ice will melt at the height of summer. \r\n" +
               "The presence of melt ponds complicates the dynamics of how ice shelves and glaciers melt. \r\n\r\n" +
               "Sources: \r\n" +
               "https://earthobservatory.nasa.gov/blogs/earthmatters/2014/08/01/more-melt-ponds/ \r\n" +
               "https://visibleearth.nasa.gov/view.php?id=84113",
        "radio":{"A":"Avoid melt pond", "B":"Try to cross"}
    };
    
    // Polar Bears
    var polar_bears = {
        "title":"Polar bears",
        "image":"img/Polar_Bear.jpg",
        "body":"Polar bears live mainly within the Arctic Circle and rely on sea ice to hunt, breed and travel. " +
               "The timing of sea ice melting in summer and freezing in winter affects polar bear populations because " +
               "sea ice is so critical to their lifecycle. Satellite observations show that the arctic sea ice is melting " +
               "sooner and freezing later each year, reducing the total number of ice-covered days each year.\r\n\r\n" +
               "Sources: \r\n" +
               "https://www.nasa.gov/feature/goddard/2016/polar-bears-across-the-arctic-face-shorter-sea-ice-season \r\n" +
               "https://commons.wikimedia.org/wiki/File:Polar_Bear_-_Alaska_(cropped).jpg",
        "radio":{"A":"Keep away from polar bears, avoid strong-smelling foods", "B":"Approach and offer food"}
    };
    
    // Sea_Ice
    var sea_ice = {
        "title":"Arctic sea ice retreat",
        "image":"img/Sea_Ice.png",
        "body":"Each year in September, after the summer melting period, the extent of Arctic sea ice reaches its annual minimum." +
               "Data from NASA and the National Snow & Ice Data Center shows how this minimum extent has been decreasing in recent " + 
               "history contributing to rising sea levels.\r\n\r\n" +
               "Sources: \r\n" +
               "https://climate.nasa.gov/vital-signs/arctic-sea-ice/",
        "radio":{"A":"Plan route considering change in sea ice extent", "B":"Ignore melting of sea ice"}
    };