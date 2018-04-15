var angle = 0;
var angle2 = 0;
var x = 0;
var y = 0;
var nrOfCoins = 40;
var clicked = 0;
var score = 0;
var col = 255;
ships = [];
let projectiles = [];
let turrets = [];
coinArray = [];
level = 1;
let levels = 5; //we'll make just 5 levels 
var TurretImg;
var RocketImg;
var CoinImg;

function preload() {
  TurretImg = loadImage('assets/TurretImg.svg');
  RocketImg = loadImage('assets/Rocket.svg');
  CoinImg = loadImage('assets/CoinImage.svg');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);

  col = 255;
  score = 0;
  for (var j = 0; j < 40; j++) {
    angle2 += (2 * PI) / 40;
    var coin = new Coin(cos(angle2 - PI / 2) * 250 + width / 2, sin(angle2 - PI / 2) * 250 + height / 2);
    coinArray.push(coin);
  }

  turrets.push(new Turret());
  ships.push(new Ship(col, false));
}

function draw() {
  background(100);
  fill('rgba(121, 179, 224, 0.5)');
  ellipse(width / 2, height / 2, 600, 600);
  textSize(70);
  textAlign(CENTER);
  fill(66, 173, 244);
  text("Corsairs", width / 2, 100);
  angle += (0.025 + ((level - 1) / 100)) * clicked;

  rectMode(CENTER);
  fill(255);
  rect(width - 100, height - 100, 100, 40, 5);
  fill(0);
  textSize(15);
  text("Restart", width - 100, height - 95);

  if (level <= 5) { //if the user still hasn't won the game

    //level and score text settings
    textSize(50);
    textAlign(CENTER);
    fill(255);
    //show the level
    text("Level", 110, 100);
    text(level, 110, 150);
    //show the score
    if (score < 40) {
      fill(255, 229, 99);
    } else {
      fill(255);
    }
    text(score, width - 100, 100);
    if (clicked) {

      if (ships.length) { //if there is a ship, the user hasn't lost yet
        ships[0].show(x, y);


        if (score == 40) { //if the user wins, remove all projectiles
          projectiles.splice(0, projectiles.length);
          turrets.splice(0, turrets.length);
          ships[0].col = color(random(255), random(255), random(255)); //show a nice disco ship
          textSize(32);
          textAlign(CENTER);
          fill(255);
          text("Congratulations!", width / 2, height / 2);
          text("YOU WON!", width / 2, height / 2 + 50);
          rectMode(CENTER);
          fill(255);
          rect(width / 2, height / 2 + 100, 100, 40, 5);
          fill(0);
          textSize(15);
          text("Next Level", width / 2, height / 2 + 105);
        } else { //otherwise, continue creating them

          if (clicked == 1) {
            turrets[0].show(cos(radians(whereShoudlIShoot(angle))) * 80 + width / 2, sin(radians(whereShoudlIShoot(angle))) * 80 + height / 2, radians(whereShoudlIShoot(angle)));
          } else {
            turrets[0].show(cos(radians(whereShoudlIShoot(angle - PI))) * 80 + width / 2, sin(radians(whereShoudlIShoot(angle - PI))) * 80 + height / 2, radians(whereShoudlIShoot(angle - PI)));
          }

          for (var i = 0; i < nrOfCoins; i++) {
            coinArray[i].show();
            if (checkTouched(coinArray[i], ships[0])) {
              coinArray.splice(i, 1);
              nrOfCoins--;
              score++;
            }
          }

          for (prj of projectiles) {
            prj.show();
            ships[0].hasBeenHit = checkTouched(prj, ships[0]);
            if (ships[0].hasBeenHit == true) {
              projectiles.splice(0, projectiles.length);
              turrets.splice(0, turrets.length);
              print("HIT!");
              ships.splice(0, ships.length);
            }
          }


          if (frameCount % ((-10 * level) + 60) == 0) {
            if (clicked == 1) {
              projectiles.push(new Proj(width / 2, height / 2, radians(whereShoudlIShoot(angle))));
            } else {
              projectiles.push(new Proj(width / 2, height / 2, radians(whereShoudlIShoot(angle - PI))))
            }
          }
        }
      } else { //if there isn't a ship, it means the user has lost
        textSize(32);
        textAlign(CENTER);
        fill(255);
        text("I'm sowy! 🙁🙁🙁", width / 2, height / 2);
        text("You lost!", width / 2, height / 2 + 50);
      }
    } else { //if clicked == 0 show a welcome screen
      textSize(32);
      textAlign(CENTER);
      fill(255);
      text("Press enter to start...", width / 2, height / 2);
      ships[0].show(width / 2, height / 2 - 250);
    }

    x = cos(angle - (PI / 2)) * 250 + width / 2;
    y = sin(angle - (PI / 2)) * 250 + height / 2;
  } else { //if the user has won the game

    //collect the garbage
    ships.splice(0, ships.length);
    turrets.splice(0, turrets.length);
    projectiles.splice(0, projectiles.length);

    //show the last score
    textSize(50);
    textAlign(CENTER);
    fill(255);
    text("40", width - 100, 100);

    //and the endgame message
    textSize(32);
    textAlign(CENTER);
    fill(255);
    text("Thank you for playing Corsairs!", width / 2, height / 2 - 100);
    text("It was pretty simple, right?", width / 2, height / 2);
    text("It's also pretty rough. Just generated shapes, no images...", width / 2, height / 2 + 100);
    text("Come back on the 27th of January 2018 for the full experience! 😉", width / 2, height / 2 + 200);
  }
}

class Coin { //coin class
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.point = 1;
  }

  show() {
    imageMode(CENTER);
    image(CoinImg, this.x, this.y, 12, 12);
  }

}

class Ship { //ship class
  constructor(col, hasBeenHit) {
    this.col = col;
    this.hit = hasBeenHit;
  }

  show(x, y) {
    this.x = x;
    this.y = y;
    push(); //duplicate the matrix
    translate(x, y); //then translate the duplicate to where we want it
    imageMode(CENTER);
    rotate(angle); //rotate the duplicate so we can rotate the ship
    push();
    if (clicked == 1) {
      rotate(PI * 2);
    } else if (clicked == -1) {
      rotate(PI);
    } else {
      rotate(PI * 2);
    }
    image(RocketImg, 0, 0, RocketImg.width / 10 - level * RocketImg.width / 100, RocketImg.height / 10 - level * RocketImg.height / 100);
    pop(); //remove the duplicate because we already have the ship on screen
    pop();
  }

  changeCol() {
    col = color(random(255), random(255), random(255));
  }
}

class Proj { //projectile class
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    projectiles.push(this);
  }

  show() {
    this.x = this.x + cos(this.angle) * 80 * (0.025 + ((level - 1) / 100));
    this.y = this.y + sin(this.angle) * 80 * (0.025 + ((level - 1) / 100));
    fill(255);
    ellipse(this.x, this.y, 10, 10);
    if (this.x > width || this.x < 0 || this.y > height || this.y < 0) {
      projectiles.splice(projectiles.indexOf(this), 1);
    }
  }
}

class Turret {
  constructor() {
  }

  show(x, y, angle) {
    fill(117, 168, 249);
    stroke(255);
    strokeWeight(2);
    ellipse(width / 2, height / 2, 300, 300);
    push();
    translate(width / 2, height / 2);
    rotate(angle);
    imageMode(CENTER);
    //rect(0, 0, 40, 100);
    image(TurretImg, 0, 0, 160, 160);
    pop();
  }

}

function mouseClicked() {
  if (score == 40 && dist(mouseX, mouseY, width / 2, height / 2 + 105) < 50) {
    nextLevel();
  } else if (dist(mouseX, mouseY, width - 100, height - 95) < 50) {
    restartGame();
  } else {
    changeDirection();
  }
}

function keyPressed() {
  if (keyCode == ENTER) {
    changeDirection();
  } else {
    ;
  }
}

function changeDirection() {
  if (clicked == 1) {
    clicked = -1;
  } else {
    clicked = 1;
  }
}

function checkTouched(entity1, entity2) {
  return (dist(entity1.x, entity1.y, entity2.x, entity2.y) < ((60 - level * 7) / 2 + 2)); //check against half the size of the ship + radius of coin
}

function resetGame() {
  angle = 0;
  angle2 = 0;
  x = 0;
  y = 0;
  nrOfCoins = 40;
  clicked = 0;
  score = 0;
  col = 255;
  ships.splice(0, ships.length);
  projectiles.splice(0, projectiles.length);
  turrets.splice(0, turrets.length);
  coinArray.splice(0, coinArray.length);
  ships.push(new Ship(col, false));
  turrets.push(new Turret());
  for (var j = 0; j < 40; j++) {
    angle2 += (2 * PI) / 40;
    var coin = new Coin(cos(angle2) * 250 + width / 2, sin(angle2) * 250 + height / 2);
    coinArray.push(coin);
  }
}

function whereShoudlIShoot(angle2) { //decides the value of angle at which to shoot the projectile so that if clicked doesn't change after the projectile has been shot
  //the ship will get hit
  return degrees(angle2) + clicked;
}

function nextLevel() {
  level++;
  resetGame();
}

function restartGame() {
  level = 1;
  clicked = 0;
  resetGame();
}