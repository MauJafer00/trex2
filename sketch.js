//variables globales 
var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, edges, ground;
var groundImage;
var invisibleGround;
var cloudImage;

var obstacleImage1;
var obstacleImage2;
var obstacleImage3;
var obstacleImage4;
var obstacleImage5;
var obstacleImage6;
var obstaclesGroup, cloudsGroup;
var trexCollided;
var gameOverImg, restartImg, gameOver, restart;
var button;

var fondopng;
var fin;
var score;

function preload() {
  fondopng = loadImage("montanias.png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  trexRunning = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trexCollided = loadAnimation("trex_collided.png");
  groundImage = loadImage("ground2.png");

  cloudImage = loadImage("cloud.png");

  obstacleImage1 = loadImage("obstacle1.png");
  obstacleImage2 = loadImage("obstacle2.png");
  obstacleImage3 = loadImage("obstacle3.png");
  obstacleImage4 = loadImage("obstacle4.png");
  obstacleImage5 = loadImage("obstacle5.png");
  obstacleImage6 = loadImage("obstacle6.png");

  montImage = loadImage("montanias.png");

  fin = loadImage("gameOver.png");

}

function setup() {
  createCanvas(600, 200);
    
  edges = createEdgeSprites();

  //crear el sprite del trex
  trex = createSprite(50, 160, 20, 50);
  trex.addAnimation("running", trexRunning);
  trex.addAnimation("collided", trexCollided);
  trex.scale = 0.5;
  trex.setCollider("circle", 0, 0, 40);
  //trex.debug=true

  //crear el sprite del suelo
  ground = createSprite(200, 180, 400, 20);
  ground.addAnimation("suelo", groundImage);
  ground.x = ground.width / 2;

  //crear el suelo inbisible 
  invisibleGround = createSprite(200, 190, 400, 20);
  invisibleGround.visible = false;
  score = 0;
  //creagameOver y restart
  gameOver = createSprite(300, 100);
  gameOver.addImage(gameOverImg);

  restart = createSprite(300, 140);
  restart.addImage(restartImg);

  gameOver.visible = false;
  restart.visible = false;

  //crea grupos de obstaculos y nubes 

  obstaclesGroup = new Group();
  cloudsGroup = new Group();

}

function draw() {

 // background("white");
  background(fondopng);

  text("score: " + score, 500, 50);

  if (gameState === PLAY) {
    score = score + Math.round((frameCount / 60));
    //dar velocidad al suelo 
    ground.velocityX = -5 - score / 500;
    //console.log(ground.velocityX);
    //si el suelo a salido por la parte isquierda lo rregresamos a su pocicion x original
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }
    // si se oprime la barra espaciadora y la pocicion del trex es mayor que 150 el trex salta
    if (keyDown("space") && trex.y > 150) {
      trex.velocityY = -10;
    }
    trex.velocityY = trex.velocityY + 0.5;
   
    spawnClouds();
    spawnObstacles();
    if (obstaclesGroup.isTouching(trex)) {
      gameState = END;
      obstaclesGroup.setLifetimeEach(-5);
      cloudsGroup.setLifetimeEach(-1);
  
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    // detine el suelo 
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    trex.changeAnimation("collided", trexCollided);
    if (mousePressed(restart)) {
      
      resetGame();

    }
    
   /* var fn = createSprite(200, 50, 50, 50)

    fn.addImage(fin);
      
    button = createButton('has ckik');
    button.position(150, 150);
    button.mousePressed(resetGame);*/


  } 

  trex.collide(invisibleGround);
  drawSprites();

}

//funcion para aparecer nubes 

function spawnClouds() {

  if (frameCount % 60 === 0) {
    var cloud = createSprite(600, 100, 40, 10);
    cloud.addImage(cloudImage);
    cloud.y = Math.round(random(10, 60));
    cloud.scale = 0.7  ;
    // cloud.velocityX = -(5+score/500);
    cloud.velocityX = -5 - score / 500;
    cloud.lifetime = 210;

    //ajusta la profundidad 
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //añade cada nube al grupo
    cloudsGroup.add(cloud);

  }

}

//funcion para poner obstaculos
function spawnObstacles() {
  
  if (frameCount % 60 === 0) {
    
    var obstacle = createSprite(600, 165, 10, 40);
    obstacle.velocityX = -7-score/500;
    obstacle.scale = 0.5;
    obstacle.lifetime = 210;
    obstacle.depth = trex.depth;
    trex.depth = trex.depth + 1;     
    var rand = Math.round(random(1, 6));

    switch (rand) {
      
      case 1: obstacle.addImage(obstacleImage1);
        break;
      case 2: obstacle.addImage(obstacleImage2);
        break;

      case 3: obstacle.addImage(obstacleImage3);
        break;
      
      case 4: obstacle.addImage(obstacleImage4);
        break;
      
      case 5: obstacle.addImage(obstacleImage5);
        break;
      
      case 6: obstacle.addImage(obstacleImage6);
        break;
      
      default: break;

    }
    //añade cada obstaculo al grupo
    obstaclesGroup.add(obstacle);
  }

}
function resetGame() {
  
  gameState = PLAY;
  score = 0;
  ground.velocityX = -5;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running", trexRunning);
  gameOver.visible = false;
  restart.visible = false;

  
  }
