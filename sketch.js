//sprite library
// https://molleindustria.github.io/p5.play/docs/classes/Sprite.html


// P5.js
//https://p5js.org/reference/



var trex, trex_running;
var ground, groundImage
var invisibleGround
var clouds, cloudsImage
var obstcles, obstcle1Image, obstcle2Image, obstcle3Image, obstcle4Image, obstcle5Image, obstcle6Image
var score = 0
var Play = 0
var End = 1
var gameState = Play
var obstacleGroup, cloudsGroup
var gameOver,reset,gameOverImage,resetImage
localStorage["Highest Score"]=0
var jump,die,checkpoint
var number

// To load the  assest(imag,audio,gif,video) we use function preload
function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png")
  groundImage = loadImage("ground2.png")
  cloudsImage = loadImage("cloud.png")
  obstcle1Image = loadImage("obstacle1.png")
  obstcle2Image = loadImage("obstacle2.png")
  obstcle3Image = loadImage("obstacle3.png")
  obstcle4Image = loadImage("obstacle4.png")
  obstcle5Image = loadImage("obstacle5.png")
  obstcle6Image = loadImage("obstacle6.png")
  gameOverImage=loadImage("gameOver.png")
  resetImage=loadImage("restart.png")
  jump=loadSound("jump.mp3")
  die=loadSound("die.mp3")
  checkpoint=loadSound("checkpoint.mp3")


}

// to create a object onetime we use function setup
function setup() {
  createCanvas(windowWidth, windowHeight)

  //create a trex sprite
  trex = createSprite(40, height-15, 80, 80)
  trex.addAnimation("trex", trex_running)
  trex.scale = 0.4


  ground = createSprite(300, height-15, 600, 10)
  ground.addImage("floor", groundImage)

  invisibleGround = createSprite(300, height-10, 600, 10)
  invisibleGround.visible = false

  // var group = createGroup();
  obstacleGroup = new Group()
  cloudsGroup = new Group()


  gameOver=createSprite(width/2,height/2+170)
  gameOver.addImage("over",gameOverImage)
  gameOver.scale=0.4

  reset=createSprite(width/2,height/2+200)
  reset.addImage("reset",resetImage)
  reset.scale=0.4

  trex.debug=false
  // sprite.setCollider(type,xoffset,yoffest,width,height/ radius);
  // trex.setCollider("rectangle",0,0,100,80);
  trex.setCollider("circle",0,0,45)



}


// to display the object multiple time we use function draw
function draw() {
  background("white")
  drawSprites()

  fill("blue")
  textStyle("bold")
  textSize(25)
  text("Score:  " + score,  width/2-600,height/2+150)
  fill("green")
  text("Highest Score:  " + localStorage["Highest Score"], width/2-400,height/2+150)


  if (gameState === Play) {
    gameOver.visible=false
    reset.visible=false
    score = score + Math.round(random(frameCount%3===0))


    if ((touches.length> 0 || keyDown("space"))&& trex.y >= height-50) {
      trex.velocityY = -8
      jump.play()
      touches=[]
    }
    
    else if ((touches.length> 0 ||keyDown("up")) && trex.y >= height-50) {
      trex.velocityY = -8
      jump.play()
      touches=[]
    }


    //gravity to the trex
    trex.velocityY = trex.velocityY + 0.5


    ground.velocityX = -(4+score/100)

    //infinite ground
    if (ground.x < 0) {
      ground.x = ground.width / 2
    }

    // calling function
    createClouds()
    createObstcles()


    // collison
    if (obstacleGroup.isTouching(trex)) {
      gameState = End
      die.play()
    }

    
    if( score>0 && score%20 === 0){
      checkpoint.play()
    }




  }



  else if (gameState === End) {
    ground.velocityX = 0
    trex.velocityY = 0
    obstacleGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    obstacleGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    gameOver.visible=true
    reset.visible=true

    if(touches.length>0 || mousePressedOver(reset)){
      resetgame()
      touches=[]
    }
    console.log(number)
  }


  //collide either of state
  trex.collide(invisibleGround)

  // console.log(trex.y)



}


function createClouds() {
  if (frameCount % 50 === 0) {
    clouds = createSprite(width+20, 80, 100, 20)
    clouds.addImage("cloudy", cloudsImage)
    clouds.velocityX = -4
    // console.log("display clouds ", frameCount)
    clouds.scale = 0.6
    clouds.y = Math.round(random((height-100),(height-200)))

    trex.depth = clouds.depth
    trex.depth += 1

    // console.log("clouds depth is", clouds.depth)
    // console.log("trex depth is", trex.depth)


    //life time to clouds  sprite.lifetime
    // time= distance/speed  = 500/4= 125
    clouds.lifetime = 360
    cloudsGroup.add(clouds);

  }
}

function createObstcles() {
  if (frameCount % 60 === 0) {
    obstcles = createSprite(width+5, height-28, 10, 80)
    obstcles.velocityX = -(8+score/100)
    // 600/4= 150
    obstcles.lifetime = 170

    number = Math.round(random(1, 6))

    switch (number) {
      case 1: obstcles.addImage("ob1", obstcle1Image)
        break;
      case 2: obstcles.addImage("ob2", obstcle2Image)
        break;
      case 3: obstcles.addImage("ob3", obstcle3Image)
        break;
      case 4: obstcles.addImage("ob4", obstcle4Image)
        break;
      case 5: obstcles.addImage("ob5", obstcle5Image)
        break;
      case 6: obstcles.addImage("ob6", obstcle6Image)
        break;
      default: break
    }

    obstcles.scale = 0.5
    obstacleGroup.add(obstcles);

  }
}

function resetgame(){

   gameState=Play
   obstacleGroup.destroyEach()
   cloudsGroup.destroyEach()

   if(localStorage["Highest Score"]<score){
    localStorage["Highest Score"]=score
   }

   score=0
}


