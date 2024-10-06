import { createCanvas } from 'canvas';
import { writeFileSync } from 'fs';

function testCanvasCreation() {
  const canvas = createCanvas(400, 400);
  const ctx = canvas.getContext('2d');

  // Fill the background with green
  ctx.fillStyle = 'green';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw a red rectangle
  ctx.fillStyle = 'red';
  ctx.fillRect(50, 50, 300, 300);

  // Save the image to disk
  const buffer = canvas.toBuffer('image/png');
  writeFileSync('test_image.png', buffer);

  console.log('Canvas created and image saved as test_image.png');
}

testCanvasCreation();
