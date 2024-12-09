//ELEMENTS
const canvas = document.getElementById('canvas');
const ships = document.getElementById('ships');
const overui = document.querySelector('.overui');
const scoreboard = document.querySelector('.scoreboard');
const score = document.querySelector('.score');
const overscore = document.querySelector('.overscore');
const ammo = document.querySelector('.ammo');
const ctx = canvas.getContext('2d');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
//ASSESTS
const ui = document.querySelector('.ui');
const pship1 = document.querySelector('.playership1');
const pship2 = document.querySelector('.playership2');
const pship3 = document.querySelector('.playership3');
const pship4 = document.querySelector('.playership4');
const pship5 = document.querySelector('.playership5');
const pro1 = document.querySelector('.projectile1');
const pro2 = document.querySelector('.projectile2');
const pro3 = document.querySelector('.projectile3');
const pro4 = document.querySelector('.projectile4');
const pro5 = document.querySelector('.projectile5');
const enemyship1 = document.querySelector('.enemyship1');
const enemyship2 = document.querySelector('.enemyship2');
const enemyship3 = document.querySelector('.enemyship3');

// VARIABLES
let playervelocity = 2;
let i = 0;
let j;
let enespeed = 3;
let s = 0;
let animationid;
let selected_player = pship1;
let selected_projectile = pro1;
let startgame = false;
const ammoimg = document.createElement("img");
ammoimg.src = "./assets/playerShips/projectile5.png";
ammoimg.className = "projectile";
// SETUP
class players {
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.selected_player = selected_player;
        this.width;
        this.height;
    }
    draw(){
        this.width = this.selected_player.width/5;
        this.height = this.selected_player.height/5;
        ctx.drawImage(this.selected_player,this.x,this.y,this.width,this.height);
    }
    update(){
        this.selected_player = selected_player;
        this.draw();
        this.y = this.y + playervelocity;
    }
}
class projectiles {
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.rendering = false;
        this.selected_projectile = selected_projectile;
        this.width;
        this.height;
    }
    draw(){
        ctx.fillStyle = "orange";
        ctx.beginPath();
        ctx.arc(this.x,this.y,8,0,2*Math.PI);
        ctx.fill();
        ctx.drawImage(this.selected_projectile,(this.x+8)-this.width,(this.y)-(this.height/2),this.width,this.height);
    }
    update(){
        this.selected_projectile = selected_projectile;
        this.width = this.selected_projectile.width;
        this.height = this.selected_projectile.height;
        this.draw();
        this.x = this.x + 8;
    }
    reset(){
        this.x = -150;
        this.y = 0;
        this.rendering = false;
        projectileinfo.push("<img src='./assets/playerShips/projectile5.png' class='projectile'>");
    }
}
class enemies {
    constructor(x,y,ennumber){
        this.x = x;
        this.y = y;
        this.ennumber = ennumber;
        this.rendering = false;
        this.width;
        this.height;
    }
    draw(){
        if (this.ennumber == 2) {
            this.width = enemyship3.width/5;
            this.height = enemyship3.height/5;
            ctx.drawImage(enemyship3,this.x,this.y,this.width,this.height);  
        } else if (this.ennumber == 1) {
            this.width = enemyship2.width/5;
            this.height = enemyship2.height/5;
            ctx.drawImage(enemyship2,this.x,this.y,this.width,this.height); 
        } else {
            this.width = enemyship1.width/5;
            this.height = enemyship1.height/5;
            ctx.drawImage(enemyship1,this.x,this.y,this.width,this.height); 
        }
    }
    update(){
        this.draw();
        this.x = this.x - enespeed;
    }
    reset(){
        this.x = canvas.width+100;
        this.y = (Math.random()*canvas.height-this.height <4)?0:(Math.random()*canvas.height-this.height);
        this.ennumber = Math.floor(Math.random()*2.9);
        this.rendering = false;
    }
}
const player = new players(100,100);
const projectile = [];
const projectileinfo = ["<img src='./assets/playerShips/projectile5.png' class='projectile'>","<img src='./assets/playerShips/projectile5.png' class='projectile'>","<img src='./assets/playerShips/projectile5.png' class='projectile'>","<img src='./assets/playerShips/projectile5.png' class='projectile'>","<img src='./assets/playerShips/projectile5.png' class='projectile'>","<img src='./assets/playerShips/projectile5.png' class='projectile'>","<img src='./assets/playerShips/projectile5.png' class='projectile'>","<img src='./assets/playerShips/projectile5.png' class='projectile'>","<img src='./assets/playerShips/projectile5.png' class='projectile'>","<img src='./assets/playerShips/projectile5.png' class='projectile'>"];
const enemy = [];
for (let i = 0; i < 10; i++) {
        projectile.push(new projectiles(-150,0));
}
for (let i = 0; i < 20; i++) {
    enemy.push(new enemies(canvas.width+100,(Math.random()*canvas.height-100 <4)?0:(Math.random()*canvas.height-100),Math.floor(Math.random()*2.9)));
}

// LOGIC

function animate() {
    if (!startgame) {
        return ;
    }
    animationid = window.requestAnimationFrame(animate);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    player.update();
    score.innerHTML = `Your score: ${s} `+' ';
    ammo.innerHTML = `Ammos: [${projectileinfo}]`;
    projectile.forEach((projectile)=>{
        if (projectile.rendering) {projectile.update()};
        if (projectile.x >= canvas.width+projectile.width) {
            projectile.reset();
        };
        enemy.forEach((enemy)=>{
            if (projectile.x < enemy.x + enemy.width &&
                projectile.x + 4 > enemy.x &&
                projectile.y < enemy.y + enemy.height &&
                projectile.y + 4 > enemy.y) {
                enemy.reset();
                projectile.reset();
                s = s+20;
            }
        });
    });
    enemy.forEach((enemy)=>{
        if (enemy.rendering) {enemy.update()};
        if (enemy.x <= -enemy.width) {
            enemy.reset();
             s = s+10;
        };
        if (player.x+3 < enemy.x + enemy.width &&
            player.x + player.width-3 > enemy.x &&
            player.y+6 < enemy.y + enemy.height &&
            player.y+player.height-6 > enemy.y) {
                cancelAnimationFrame(animationid);
                overscore.innerHTML = `Your Score: ${s}`;
                overui.style.display = 'flex';
        } else if (player.y+6 < 0 || player.y+player.height-6 > canvas.height) {
                cancelAnimationFrame(animationid);
                overscore.innerHTML = `Your Score: ${s}`;
                overui.style.display = 'flex';
        }
    });
}
window.addEventListener("keydown",(e)=>{
    if (!startgame) {
        return ;
    }
switch(e.key) {
    case "w":
    playervelocity = -10;
    break; 
    case "s":
    playervelocity = +10;
    break;
    case "d": 
        j = projectile.findIndex((projectilename)=>{return projectilename.rendering == false;});
        if (j !== -1) {
        projectile[j].x = player.x+110;
        projectile[j].y = player.y+player.height/2;
        projectile[j].rendering = true;
        projectileinfo.pop();
        }
    break;
}
switch(e.key) {
    case "ArrowUp":
    playervelocity = -10;
    break; 
    case "ArrowDown":
    playervelocity = +10;
    break;
    case "ArrowRight":
        j = projectile.findIndex((projectilename)=>{return projectilename.rendering == false;});
        if (j !== -1) {
        projectile[j].x = player.x+110;
        projectile[j].y = player.y+player.height/2;
        projectile[j].rendering = true;
        projectileinfo.pop();
        }
    break;
}
});
window.addEventListener("keyup",(e)=>{
    if (!startgame) {
        return ;
    }
    playervelocity = 1;
});
window.setInterval(()=>{
    if (!startgame) {
        return ;
    }
    enemy[i].rendering = true;
    i++;
    (enespeed >= 10)? "": enespeed = enespeed+0.1;
    if (i == 20) {i = 0};
},800);

function start() {
    startgame = true;
    if (ships.value == "pship1") {
        selected_player = pship1;
        selected_projectile = pro1;
        selected_projectile.width = selected_projectile.width/20;
        selected_projectile.height = selected_projectile.height/20;
    } else if (ships.value == "pship2") {
        selected_player = pship2;
        selected_projectile = pro2;
        selected_projectile.width = selected_projectile.width/20;
        selected_projectile.height = selected_projectile.height/20;
    } else if (ships.value == "pship3") {
        selected_player = pship3;
        selected_projectile = pro3;
        selected_projectile.width = selected_projectile.width/16;
        selected_projectile.height = selected_projectile.height/16;
    } else if (ships.value == "pship4") {
        selected_player = pship4;
        selected_projectile = pro4;
        selected_projectile.width = selected_projectile.width/10;
        selected_projectile.height = selected_projectile.height/10;
    } else if (ships.value == "pship5") {
        selected_player = pship5;
        selected_projectile = pro5;
        selected_projectile.width = selected_projectile.width/20;
        selected_projectile.height = selected_projectile.height/20;
    }
    ui.style.display = 'none';
    scoreboard.style.display = 'flex';
    animate();
}