/* eslint-disable no-undef, no-unused-vars */

const MIN_SHRINKAGE = 0.4;
const MAX_SHRINKAGE = 0.8;
const SHRINKAGE = 0.2;
const MULTIPLIER = 2;
const LEAKAGE = 4;

let time;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  setAttributes("antialias", true);
  angleMode(DEGREES);
  //noLoop();
}

let childNumber = 0;
function drawBox(size, position = createVector(), remaining = 3) {
  if (remaining <= 0) return;

  push();

  translate(position);

  stroke("red");
  sphere(2);

  stroke("yellow");
  noFill();
  normalMaterial();
  box(size.x, size.y, size.z);

  for (let i = 0; i < 1 + remaining * MULTIPLIER; i++) {
    childNumber++;
    const newSize = createVector(
      lerp(
        size.x * MIN_SHRINKAGE,
        size.x * MAX_SHRINKAGE,
        noise(childNumber + 1)
      ),
      lerp(
        size.y * MIN_SHRINKAGE,
        size.y * MAX_SHRINKAGE,
        noise(childNumber + 2)
      ),
      lerp(
        size.z * MIN_SHRINKAGE,
        size.z * MAX_SHRINKAGE,
        noise(childNumber + 3)
      )
    );
    // const newSize = createVector(100, 100, 100);
    const newPosition = getPosition(childNumber, size, newSize, Date.now());

    if (remaining > 1) {
      drawLine(
        childNumber,
        size,
        newSize,
        createVector(-newSize.x / 2, newSize.y / 2, newSize.z / 2)
      );
      drawLine(
        childNumber,
        size,
        newSize,
        createVector(-newSize.x / 2, -newSize.y / 2, newSize.z / 2)
      );
      drawLine(
        childNumber,
        size,
        newSize,
        createVector(newSize.x / 2, -newSize.y / 2, newSize.z / 2)
      );
      drawLine(
        childNumber,
        size,
        newSize,
        createVector(newSize.x / 2, newSize.y / 2, newSize.z / 2)
      );
      drawLine(
        childNumber,
        size,
        newSize,
        createVector(-newSize.x / 2, newSize.y / 2, -newSize.z / 2)
      );
      drawLine(
        childNumber,
        size,
        newSize,
        createVector(-newSize.x / 2, -newSize.y / 2, -newSize.z / 2)
      );
      drawLine(
        childNumber,
        size,
        newSize,
        createVector(newSize.x / 2, -newSize.y / 2, -newSize.z / 2)
      );
      drawLine(
        childNumber,
        size,
        newSize,
        createVector(newSize.x / 2, newSize.y / 2, -newSize.z / 2)
      );
    }

    drawBox(newSize, newPosition, remaining - 1);
  }

  pop();
}

function drawLine(i, size, newSize, offset) {
  push();
  stroke("purple");
  strokeWeight(2);
  beginShape();
  for (let j = 0; j < 15; j++) {
    let pos = p5.Vector.add(
      offset,
      getPosition(i, size, newSize, Date.now() - j * 65)
    );
    noFill();
    vertex(pos.x, pos.y, pos.z);
  }
  endShape();
  pop();
}

function getPosition(i, size, newSize, now) {
  return p5.Vector.mult(
    p5.Vector.sub(size, p5.Vector.mult(newSize, 1 - LEAKAGE)),
    p5.Vector.mult(myRandom(now, i), 0.5)
  );
}

function draw() {
  orbitControl();

  background(0);
  strokeWeight(1.5);

  rotateY(-20);
  rotateX(-20);

  childNumber = 0;
  drawBox(createVector(400, 300, 200));
}

// This Redraws the Canvas when resized
windowResized = function () {
  resizeCanvas(windowWidth, windowHeight);
};

function myRandom(now, i) {
  let tick = now * 0.00001 * (1 + i * 0.2) + Math.pow(i, 2);

  let v = createVector(
    noise(Math.sin(tick) + i) * 2 - 1,
    noise(Math.atan(tick) + i) * 2 - 1,
    noise(Math.cos(tick) + i) * 2 - 1
  );
  return v;
}
