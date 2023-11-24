var c = document.getElementById("fishTank");
var ctx = c.getContext("2d");
var isFullscreen = false;

var pCXW = 1000;      // count of pixels across the world
var pCYW = 800;       // count of pixels across the world
var itC = 0;
const tickS = 50;
const pixS = 10;
const minW = 0;
const minH = 0;
var maxW = c.width;   
var maxH = c.height;   
const bgHue = "#777777";
var pCX = Math.floor(maxW / pixS);  // count of pixels across the screen
var pCY = Math.floor(maxH / pixS);  // count of pixels across the screen

function resizeCanvas() {
    if (isFullscreen) {
        c.width = window.innerWidth;
        c.height = window.innerHeight;
    } else {
        c.width = window.innerWidth * 0.8;
        c.height = window.innerHeight * 0.8;
    }
    updateWorld();
}

function updateWorld() {
    maxW = c.width;
    maxH = c.height;
    pCX = Math.floor(maxW / pixS);
    pCY = Math.floor(maxH / pixS);
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);
document.addEventListener('fullscreenchange', function() {
    isFullscreen = !!document.fullscreenElement;
    resizeCanvas();
});

// Fullscreen Button Action
document.getElementById("fullscreen").addEventListener("click", function() {
    var fullscreenButton = document.getElementById("fullscreen");
    if (fullscreenButton) {
        fullscreenButton.addEventListener("click", function() {
        var canvas = document.getElementById("canvas1");
        if (canvas.requestFullscreen) {
            canvas.requestFullscreen();
        } else if (canvas.mozRequestFullScreen) { /* Firefox */
            canvas.mozRequestFullScreen();
        } else if (canvas.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
            canvas.webkitRequestFullscreen();
        } else if (canvas.msRequestFullscreen) { /* IE/Edge */
            canvas.msRequestFullscreen();
        }
        });
    };
});

var pA = new Array(pCY);

var cloneA = new Array(pCY);


function initialize(){
    for (var y = 0; y < pCY ; y++){
        temp_x = new Array(pCX);
        for (var x = 0; x < pCX; x++){
            temp_x[x] = Math.random() * 3;
        }
        pA[y] = temp_x;
        cloneA[y] = temp_x;
    }
}

function tick() {
    // Clear and fill background
    ctx.clearRect(minW, minH, maxW, maxH);
    ctx.fillStyle = bgHue;
    ctx.fillRect(minW, minH, maxW, maxH);
    
    var total_food = 0
    // Draw screen
    ctx.fillStyle = "#666666";
    for( var y = 0; y < pCY; y++){
        for (var x = 0; x < pCX; x++){
            ctx.fillStyle = "hsl(" + Math.abs(pA[y][x]) * 360 + ", 10%, 30%)"; // Blue color
            ctx.fillRect(x * pixS, y * pixS, pixS, pixS);
            total_food += pA[y][x];
            pA[y][x] += Math.random() * 0.1;
            
        }
    }
    var current_len = cr_hue.length;
    // Draw Fish
    for( var i = 0; i < current_len; i++){
        ctx.fillStyle = "hsl(" + cr_hue[i] + ", 50%, 50%)"; // Blue color
        x = cr_x[i];
        y = cr_y[i];
        ctx.fillRect(x, y, cr_size, cr_size);
        x += (Math.random() - 0.5) * cr_speed[i];
        y += (Math.random() - 0.5) * cr_speed[i];
        if(x < 0){
            x = 0;
        }
        if(x > pCX * pixS){
            x = pCX * pixS;
        }
        if(y < 0){
            y = 0;
        }
        if(y > pCY * pixS){
            y = pCY * pixS;
        }

        index_x = Math.floor(x / pixS);
        index_y = Math.floor(y / pixS);

        //Add food
        if(pA[index_y][index_x] > 0){
            var food_trans = 0.5 * pA[index_y][index_x];
            pA[index_y][index_x] -= food_trans;
            cr_food[i] += food_trans;
        }

        //Have child if possible
        if(cr_food[i] > 20){
            var child_trans = 10;
            cr_food[i] -= child_trans;
            cr_x.push(cr_x[i]);
            cr_y.push(cr_y[i]);
            cr_food.push(child_trans);
            cr_hue.push(cr_hue[i]);
            cr_speed.push(cr_speed[i] * (Math.random() * 0.1 + 0.95))
        }



        cr_x[i] = x;
        cr_y[i] = y;

        // Metabolism
        cr_food[i] -= .001 * Math.abs(cr_speed[i]) + .1;
        

    }

    // Kill those without food
    for(var i = current_len - 1; i >= 0; i--){
        if(cr_food[i] <= 0){
            cr_x.splice(i, 1);
            cr_y.splice(i, 1);
            cr_food.splice(i, 1);
            cr_hue.splice(i, 1);
            cr_speed.splice(i, 1);
        }
    }

    // Write troubleshooting info
    ctx.fillStyle = "#000000";
    ctx.fillText("Total Food: " + total_food, 10, 10);

    itC++;
}

// Initialize

initialize();
