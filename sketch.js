//======= EUCLIDEAN DISTANCE FUNCTION =======//

function euclDist(x1, y1, x2, y2) {
  return sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

var worldMap;

//======= KEY PRESSED FUNCTION =======//



//======= MOUSE PRESSED FUNCTION =======//

function mouseClicked() {
  if (mouseButton == LEFT) {
    mouseVal = 1;
  }else{
    mouseVal = 0;
  }

  mouseButton = 0;
}

//======= BUTTON CLASS =======//

let Button = class {


  constructor(txt, midX, midY, createCanvasX, createCanvasY) {
    this.txt = txt;
    this.tlX = midX + createCanvasX / 2;
    this.tlY = midY + createCanvasY / 2;
    this.brX = midX - createCanvasX / 2;
    this.brY = midY - createCanvasY / 2;
  }

  isPressed() {
    if (mouseX > this.brX && mouseX < this.tlX && mouseY > this.brY && mouseY < this.tlY) {
      return true;
    }
    return false;
  }

  drawButton() {
    rectMode(CORNERS);

    fill(255);
    rect(this.tlX, this.tlY, this.brX, this.brY);
    fill(0);
    text(this.txt, this.tlX, this.tlY, this.brX, this.brY);
  }
};

function textureQuad(img, x1, y1, x2, y2) {
  noStroke();
  textureMode(NORMAL);
  beginShape(QUADS);
  texture(img);
  vertex(x1, y1, 0, 0);
  vertex(x2, y1, 1, 0);
  vertex(x2, y2, 1, 1);
  vertex(x1, y2, 0, 1);
  endShape();
}

var mapWidth;
var mapHeight;
var reload;
var canCount;

var keyMoveVal;
var mouseVal;
var tickCounter;
var shotCounter;
var mouseXprev;

var ammo;
var cans;
var mode;

var logo;

var gun1;
var gun2;

var can1;
var can2;
var can3;

var visitedMap;
var entityMap;

var posX;
var posY;

var dirX;
var dirY;

var planeX;
var planeY;// FOV = 66

var rayDirX;
var rayDirY;

//======= SETUP =======//

function preload(){
    logo = loadImage("textures/logo.png");
    gun1 = loadImage("textures/gun1.png");
    gun2 = loadImage("textures/gun2.png");
    can1 = loadImage("textures/can1.png");
    can2 = loadImage("textures/can2.png");
    can3 = loadImage("textures/can3.png");
}

function setup() {
  createCanvas(1366, 768, P2D); 

  mapWidth = 24;
  mapHeight = 24;
  reload = 30;
  canCount = 3;
  keyMoveVal = 0;
  mouseVal = 0;
  tickCounter = reload;
  shotCounter = 0;
  mouseXprev = 0;
  ammo = 10;
  cans = 0;
  mode = 0;
  visitedMap = new Array(mapWidth);
  entityMap = new Array(mapWidth);
  posX = 22.0;
  posY = 12.0;
  dirX = -1.0;
  dirY = 0.0;
  planeX = 0.0;
  planeY = 0.66;  // FOV = 66


  worldMap = 
  [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 
  [1, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
  [1, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
  [1, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
  [1, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 3, 0, 3, 0, 3, 0, 0, 0, 1], 
  [1, 3, 3, 3, 3, 3, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
  [1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 1], 
  [1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
  [1, 0, 0, 0, 0, 0, 2, 2, 0, 2, 2, 0, 0, 0, 0, 3, 0, 3, 0, 3, 0, 0, 0, 1], 
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
  [1, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
  [1, 4, 0, 4, 0, 0, 0, 0, 4, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
  [1, 4, 0, 0, 0, 0, 5, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1], 
  [1, 4, 0, 4, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1], 
  [1, 4, 0, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1], 
  [1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 1], 
  [1, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  ];

  background(0);
  //frameRate()(60);
  textSize(24);
  smooth();
  textAlign(CENTER, CENTER);
  textureMode(IMAGE);
  imageMode(CORNERS);
  //hvar(ENABLE_KEY_REPEAT); // the renderer doesn't automatically repeat keys unless this is activated


  for(var i = 0; i < mapWidth; i++){
      visitedMap[i] = new Array(mapHeight);
      entityMap[i] = new Array(mapHeight);
  }


  for (var i = 0; i < 24; i++) {
    for (var j = 0; j < 24; j++) {
      entityMap[i][j] = 0;
    }
  }



  entityMap[18][6] = 1;
  entityMap[1][1] = 2;
  entityMap[16][12] = 3;
  

  
}


//======= DRAW =======//

function draw() {
  
  switch(mode) {
  case 0: //BEGINNING OF CASE_0
    background(0);
    fill(255);
    imageMode(CENTER);
    image(logo, width / 2, height / 10 * 2, 400, 400);
    text("THE OFFICIAL NEON ENERGY GAME", width / 2, height / 10 * 4.25);
    imageMode(CORNERS);

    var btnStart, btnHelp;
    btnStart = new Button("START", width / 10 * 5, height / 10 * 5, 300, 50);
    btnHelp = new Button("HELP", width / 10 * 5, height / 10 * 6, 300, 50);

    btnStart.drawButton();
    btnHelp.drawButton();

    rectMode(CENTER);
    //rect(width / 10 * 5, 100, 300, 125);


    if (mouseVal == 1) {
      if (btnStart.isPressed()) {
        mode = 1;
        mouseVal = 0;
        noCursor();
      }
      if (btnHelp.isPressed()) {
        mode = 3;
        mouseVal = 0;
        noCursor();
      }
    }

    break; //END OF CASE_0

  case 1: //BEGINNING OF CASE_1
    tickCounter += 1;

    for (var i = 0; i < mapWidth; i++) {
      for (var j = 0; j < mapHeight; j++) {
        visitedMap[i][j] = 0;
      }
    } 

    background(0);

    for (var i = 0; i < width; i++) {
      var cameraX = 2 * i / width - 1;
      rayDirX = dirX + planeX * cameraX;
      rayDirY = dirY + planeY * cameraX;

      var mapX = Math.floor(posX);
      var mapY = Math.floor(posY);

      var sideDistX;
      var sideDistY;

      var deltaDistX = abs(1 / rayDirX);
      var deltaDistY = abs(1 / rayDirY);
      var perpWallDist;

      var stepX;
      var stepY;

      var hit = 0;
      var side = 0;



      if (rayDirX < 0) {
        stepX = -1;
        sideDistX = (posX - mapX) * deltaDistX;
      } else {
        stepX = 1;
        sideDistX = (mapX + 1.0 - posX) * deltaDistX;
      }

      if (rayDirY < 0) {
        stepY = -1;
        sideDistY = (posY - mapY) * deltaDistY;
      } else {
        stepY = 1;
        sideDistY = (mapY + 1.0 - posY) * deltaDistY;
      }

      //======= CHECK FOR HITS =======//

      while (hit == 0) {
        if (sideDistX < sideDistY) {
          sideDistX += deltaDistX;
          mapX += stepX;
          side = 0;
        } else {
          sideDistY += deltaDistY;
          mapY += stepY;
          side = 1;
        }

        if (worldMap[Math.floor(mapX)][Math.floor(mapY)] > 0) {
          hit = 1;

          //======= SHOOT THE WALL =======//
          if (cameraX == 0 && mouseVal != 0 && worldMap[Math.floor(mapX)][Math.floor(mapY)] != 1 && ammo > 0 && tickCounter - shotCounter > reload) {
            worldMap[Math.floor(mapX)][Math.floor(mapY)] = 0;
            ammo -= 1;
            shotCounter = tickCounter;
            mouseVal = 0;
          }
        } else {
          visitedMap[Math.floor(mapX)][Math.floor(mapY)] = 1;
        }
      }

      //======= GET DISTANCE TO WALL =======//

      if (side == 0) {
        perpWallDist = (mapX - posX + (1 - stepX) / 2) / rayDirX;
      } else {
        perpWallDist = (mapY - posY + (1 - stepY) / 2) / rayDirY;
      }



      var lineHeight = height / perpWallDist;

      var drawStart = -lineHeight / 2 + height / 2;
      if (drawStart < 0) {
        drawStart = 0;
      }

      var drawEnd = lineHeight / 2 + height / 2;
      if (drawEnd >= height) {
        drawEnd = height - 1;
      }

      //======= CHECK FOR COLOR =======//
      switch(worldMap[Math.floor(mapX)][Math.floor(mapY)]) {
      case 1:
        stroke(255, 0, 0);
        break;
      case 2:
        stroke(0, 84, 253);
        break;
      case 3:
        stroke(254, 0, 170);
        break;
      case 4:
        stroke(226, 105, 45);
        break;
      default:
        stroke(127, 54, 159);
        break;
      }

      if (side == 1) {
        switch(worldMap[Math.floor(mapX)][Math.floor(mapY)]) {
        case 1:
          stroke(128, 0, 0);
          break;
        case 2:
          stroke(0, 42, 122);
          break;
        case 3:
          stroke(127, 0, 85);
          break;
        case 4:
          stroke(113, 52, 22);
          break;
        default:
          stroke(64, 27, 80);
          break;
        }
      }

      //======= DRAW =======//

      line(i, drawStart, i, drawEnd);
    }

    //======= CHECK FOR ENTITIES =======//

    for (var i = 0; i < 24; i++) {
      for (var j = 0; j < 24; j++) {
        if (visitedMap[i][j] == 1 && entityMap[i][j] > 0) {

          //======= COLLECT CANS =======//

          if (euclDist(posX, posY, i, j) < 2.5) {
            entityMap[i][j] = 0;
            cans += 1;
          }

          //======== RENDER CANS =======//

          var entityX = i - posX;
          var entityY = j - posY;

          var invDet = 1 / (planeX * dirY - dirX * planeY);
          var transformX = invDet * (dirY * entityX - dirX * entityY);
          var transformY = invDet * (-planeY * entityX + planeX * entityY);

          var entityScreenX = (width / 2) * (1 + transformX / transformY);
          var entityHeight = abs(height / transformY);
          var entityWidth = abs(width / transformY);

          var entityStartY = -entityHeight / 2 + height / 2;
          if (entityStartY < 0) {
            entityStartY = 0;
          }

          var entityEndY = entityHeight / 2 + height / 2;
          if (entityEndY >= height) {
            entityEndY = height - 1;
          }

          var entityStartX = -entityWidth / 2 + entityScreenX;
          if (entityStartX < 0) {
            entityStartX = 0;
          }

          var entityEndX = entityWidth / 2 + entityScreenX;
          if (entityEndX >= width) {
            entityEndX = width - 1;
          }


          /*    entityStartX, entityStartY, 
           entityEndX, entityStartY, 
           entityEndX, entityEndY, 
           entityStartX, entityEndY
           */


          switch(entityMap[i][j]) {
          case 1:
            image(can1, entityStartX, entityStartY, entityEndX, entityEndY);
            break;
          case 2:
            image(can2, entityStartX, entityStartY, entityEndX, entityEndY);
            break;
          case 3:
            image(can3, entityStartX, entityStartY, entityEndX, entityEndY);
            break;
          }
        }
      }
    }
    //======= DISPLAY INFO =======//
    fill(255);
    rectMode(CORNER);
    text("Cans collected: " + cans, 125, 80);
    
    if (cans == canCount){
      mode = 2; 
    }
    
    if (ammo < 1) {
      fill(255, 0, 0); // if there is no ammo display it as red
    }

    text("Ammunition: " + ammo, 125, 50);

    //======= KEY PRESSED =======//

    var frameTime = 0.0166;
    var rotSpeed = -frameTime * 3.0;



    if (keyIsDown(87)) {
      if (worldMap[Math.floor(posX + dirX / 12)][Math.floor(posY)] == 0) {
        posX += dirX / 12;
      }
      if (worldMap[Math.floor(posX)][Math.floor(posY + dirY / 12)] == 0) {
        posY += dirY / 12;
      }

      keyMoveVal = 0;
    }

    if (keyIsDown(83)) {
      if (worldMap[Math.floor(posX - dirX / 12)][Math.floor(posY)] == 0) {
        posX -= dirX / 12;
      }
      if (worldMap[Math.floor(posX)][Math.floor(posY - dirY / 12)] == 0) {
        posY -= dirY / 12;
      }

      keyMoveVal = 0;
    }

    if (keyIsDown(65) && worldMap[Math.floor(posX - dirY / 12)][Math.floor(posY + dirX / 12)] == 0) {
      posX -= dirY / 12;
      posY += dirX / 12;

      keyMoveVal = 0;
    }

    if (keyIsDown(68) && worldMap[Math.floor(posX + dirY / 12)][Math.floor(posY - dirX / 12)] == 0) {
      posX += dirY / 12;
      posY -= dirX / 12;

      keyMoveVal = 0;
    }

    //======= ROTATION =======//
    //prvarln(mouseX - mouseXprev);
    var diff = mouseXprev - mouseX;

    rotSpeed *= diff;

    if (diff != 0) {
      var oldDirX = dirX;
      dirX = dirX * cos(-rotSpeed) - dirY * sin(-rotSpeed);
      dirY = oldDirX * sin(-rotSpeed) + dirY * cos(-rotSpeed);
      var oldPlaneX = planeX;
      planeX = planeX * cos(-rotSpeed) - planeY * sin(-rotSpeed);
      planeY = oldPlaneX * sin(-rotSpeed) + planeY * cos(-rotSpeed);
    }

    mouseXprev = mouseX;
    mouseVal = 0;

    //======= DRAW AND ANIMATE WEAPON =======//


    if (tickCounter - shotCounter > reload) {
      image(gun1, width / 3, height - height / 2, width / 3 * 2, height);
    } else {
      image(gun2, width / 3, height - height / 2, width / 3 * 2, height);
    }
    break; //END OF CASE_1

    case 2: // BEGINNING OF CASE_2
     background(0);
     cursor();
     fill(255);
     text("YOU WON\nYOU COLLECTED ALL 3 CANS\nGOOD JOB", width / 2, 200);
     
     var btnQuit;
     btnQuit = new Button("PRESS ESC TO QUIT", width / 2, height / 2, 300, 100);
     btnQuit.drawButton();

     break; // END OF CASE_2
     

  case 3:// BEGINNING OF CASE_3
    cursor();
    background(0);
    fill(255);
    textSize(24);
    text("Hi teacher,\nThis is the first video game\nI made for the multimedia midterm project\nIt was an amazing experience\nThe code might be a bit bad because I used Java\nAnd C++ is the language I know most\nBut I think that I did a good job\nTo win the game collect all 3 cans\n\nWASD to move and LMB to shoot!\nESC to quit", 300, 200);
    var btnBack;
    btnBack = new Button("GO BACK", width / 10 * 2, 500, 200, 50);
    btnBack.drawButton();
    if (mouseVal == 1) {
      if (btnBack.isPressed()) { 
        mode = 0; 
        mouseVal = 0;
      }
    }
    break; //END OF CASE_3
  }
}