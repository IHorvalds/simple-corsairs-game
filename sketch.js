var angle = 0;
var angle2 = 0;
var x = 0;
var y = 0;
var nrOfCoins = 30;
var clicked = 0;
var score = 0;
var col = 255;
ships = [];
let projectiles = [];
let turrets = [];
coinArray = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(70);
  col = 255;
  score = 0;
  for (var j = 0; j < 30; j++) {
    angle2 += (2 * PI) / 30;
    var coin = new Coin(cos(angle2 - PI / 2) * 250 + width / 2, sin(angle2 - PI / 2) * 250 + height / 2);
    coinArray.push(coin);
  }

  turrets.push(new Turret());
  ships.push(new Ship(col, false));

  button = createButton("Restart");
  button.position(width - 100, height - 50);
  button.mousePressed(resetGame);

}

function draw() {
  background(30, 30, 30);
  angle += 0.027 * clicked;
  textSize(50);
  textAlign(RIGHT);
  if (score < 30) {
    fill(255, 229, 99);
  } else {
    fill(255);
  }
  text(score, width - 50, 100);

  if (clicked) {

    if (ships.length) { //if there is a ship, the user hasn't lost yet
      ships[0].show(x, y);


      if (score == 30) { //if the user wins, remove all projectiles
        projectiles.splice(0, projectiles.length);
        turrets.splice(0, turrets.length);
        ships[0].col = color(random(255), random(255), random(255)); //show a nice disco ship
        textSize(32);
        textAlign(CENTER);
        fill(255);
        text("Congratulations!", width / 2, height / 2);
        text("YOU WON!", width / 2, height / 2 + 50);
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


        if (frameCount % 46 == 0) {
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
    ships[0].show(width/2, height/2 - 250);
  }

  x = cos(angle - (PI / 2)) * 250 + width / 2;
  y = sin(angle - (PI / 2)) * 250 + height / 2;
}

class Coin { //coin class
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.point = 1;
  }

  show() {
    fill(255, 229, 99);
    ellipse(this.x, this.y, 30, 30);
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
    rectMode(CENTER);
    rotate(angle); //rotate the duplicate so we can rotate the ship
    fill(this.col);
    rect(0, 0, 60, 60); //draw the ship
    pop(); //remove the duplicate because we already have the ship on screen
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
    this.x = this.x + cos(this.angle) * 2;
    this.y = this.y + sin(this.angle) * 2;
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
    noFill();
    stroke(255);
    ellipse(width / 2, height / 2, 160, 160);
    push();
    translate(x, y);
    rotate(angle);
    rectMode(CENTER);
    rect(0, 0, 40, 100);
    pop();
  }

}

// function mouseClicked() {
//   changeDirection();
// } //we keep this juts in case we ever care

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
  return (dist(entity1.x, entity1.y, entity2.x, entity2.y) < 30);
}

function resetGame() {

  angle = 0;
  angle2 = 0;
  x = 0;
  y = 0;
  nrOfCoins = 30;
  clicked = 0;
  score = 0;
  col = 255;
  ships.splice(0, ships.length);
  projectiles.splice(0, projectiles.length);
  turrets.splice(0, turrets.length);
  coinArray.splice(0, coinArray.length);
  ships.push(new Ship(col, false));
  turrets.push(new Turret());
  for (var j = 0; j < 30; j++) {
    angle2 += (2 * PI) / 30;
    var coin = new Coin(cos(angle2) * 250 + width / 2, sin(angle2) * 250 + height / 2);
    coinArray.push(coin);
  }
}

function whereShoudlIShoot(angle2) { //decides the value of angle at which to shoot the projectile so that if clicked doesn't change after the projectile has been shot
  //the ship will get hit
  return degrees(angle2) + clicked;
}