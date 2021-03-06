var MAXSPEED = 5.0;
var MINSPEED = -5.0;

var PLAYERSTARTX = 70;
var PLAYERSTARTY = 240;

var rendWidth = 320;
var rendHeight = 480;

var stage = new PIXI.Stage(0xffffff);
var render = PIXI.autoDetectRenderer(rendWidth, rendHeight);

function init(){
  document.body.appendChild(render.view);
}

var bgTexture = PIXI.Texture.fromImage('img/road.png');
var carTexture = PIXI.Texture.fromImage('img/car.png'); // player sprite is loaded in as a texture
var enCarTexture = PIXI.Texture.fromImage('img/car2.png'); // enCar == enemy
var shot00Texture = PIXI.Texture.fromImage('img/shot00.png'); //basic shot
var truckDTurboTexture = PIXI.Texture.fromImage('img/truckDturbo.png');

var bg = new PIXI.Sprite(bgTexture);
var car = new PIXI.Sprite(carTexture); // player sprite texture is then loaded to a sprite
var enCar = new PIXI.Sprite(enCarTexture);
var truckDTurbo = new PIXI.Sprite(truckDTurboTexture);
var shot00 = new PIXI.Sprite(shot00Texture);

var speedY = 0.0;
var speedX = 0.0;

var debug = true;
var userinput = false;

var weapon = 0;

var fireing = false;
var childLoaded = false; //fixes a bug

bg.anchor.x = 0.0;
bg.anchor.y = 0.0;

enCar.anchor.x = 0.5;
enCar.anchor.y = 0.5;

car.anchor.x = 0.5; // this sets the center of the image to be its 0,0
car.anchor.y = 0.5;

truckDTurbo.anchor.x = 0.5;
truckDTurbo.anchor.y = 0.5;


bg.position.x = 0;
bg.position.y = -260;

enCar.position.x = 135;
enCar.position.y = 200;

car.position.x = PLAYERSTARTX;
car.position.y = PLAYERSTARTY;

truckDTurbo.position.x = 70;
truckDTurbo.position.y = 460;

stage.addChild(bg);
stage.addChild(car); // need to add our sprites to the stage
stage.addChild(enCar); //fun fact you can also stage.removeChild(object)
stage.addChild(truckDTurbo);

requestAnimFrame(Loop);

function drawDebug(){ //console output if debug
  console.clear();
  console.log("speedX = " + speedX);
  console.log("speedY = " + speedY);
}

function accelerate(){ // controls now work
  if(speedY > MINSPEED){
    speedY -= 0.2;
  }
}

function useBreaks(){
  if(speedY < MAXSPEED){
    speedY += 0.2;
  }
}

function moveLeft(){
  if(speedX > MINSPEED){
    speedX -= 0.2;
  }
}

function moveRight(){
  if(speedX < MAXSPEED){
    speedX+= 0.2;
  }
}

function shoot(){ //started work here anyone want to jump in.
        fireing = true;
}

function Fire(object){
  if(childLoaded == false){
    object.anchor.x = 0.5;
    object.anchor.y = 1.0;

    object.position.x = car.position.x;
    object.position.y = car.position.y - 10;

    stage.addChild(object);
    childLoaded = true;
  }

  if(object.position.y > 0){
    scrollY(object, -4);
  }else{
    stage.removeChild(object);
    childLoaded = false;
    fireing = false;
  }
}

function Controls(){
  kd.UP.down(accelerate);
  kd.DOWN.down(useBreaks);
  kd.LEFT.down(moveLeft);
  kd.RIGHT.down(moveRight);
  kd.SPACE.down(shoot);

  if(kd.UP.isDown() == false){ //yay
    slowDown();
  }

  if(kd.DOWN.isDown() == false){ //yay
    slowDown();
  }

  if(kd.LEFT.isDown() == false){ //yay
    slowDown();
  }

  if(kd.RIGHT.isDown() == false){ //yay
    slowDown();
  }
}

function slowDown(){
  if(speedY > 0.0){
    speedY -= 0.05;
  }
  if(speedY < 0.0){
    speedY += 0.05;
  }
  if(speedX > 0.0){
    speedX -= 0.05;
  }
  if(speedX < 0.0){
    speedX += 0.05;
  }
  stopDead();
}

function stopDead(){//make sure its stopped dead.
  if(speedX < 0.01 && speedX > 0.01){
    speedX = 0.0;
  }
  if(speedY < 0.01 && speedY > 0.01){
    speedY = 0.0;
  }
}

function scrollBg(){
  if(bg.position.y < 0){
      bg.position.y += 4;
  }else{
    bg.position.y = -260;
  }
  //console.log('bgY:' + bg.position.y);
}


function scrollY(object, ySpeed){
  object.position.y += ySpeed;
}

function boundsCheck(object){ // someone add me please
  if(object.position.x < 0){
    object.position.x = rendWidth;
  }else if(object.position.x > rendWidth){
    object.position.x = 0;
  }
  if(object.position.y < 0){
    object.position.y = rendHeight;
  }else if(object.position.y > rendHeight){
    object.position.y = 0;
  }
}

function collision(object1, object2){ // someone add me please
    var distX = object1.position.x - object2.position.x;
    if(distX > (-object1.width * 0.5) && distX > (object1.width * 0.5)){
        var distY = object1.position.y - object2.position.y;
    if(distY >(-object1.height * 0.5) && distY < (object1.width * 0.5)){
        object1.position.x = PLAYERSTARTX;
        object1.position.y = PLAYERSTARTY;
    }
  }
}

function Loop(){
  kd.tick(); // keyboard listener's update if you like
  scrollBg();

  scrollY(enCar, 3);
  boundsCheck(enCar);

  scrollY(truckDTurbo, -3);
  boundsCheck(truckDTurbo);

  if(fireing == true){
    Fire(shot00);
  }

  Controls();
  car.position.y += speedY; //update the car's y position
  car.position.x += speedX;//update the car's x position
  boundsCheck(car); //car bounds check
  collision(enCar, car);
  debug=false;

  if(debug==true){
    drawDebug();
  }

  requestAnimFrame(Loop); //update the screen
  render.render(stage); //draw the backbuffer to the screen
}
