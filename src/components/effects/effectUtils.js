/**
 * Utility functions for CRT effects
 */

// Generate a random number between min and max
export const random = (min, max) => Math.random() * (max - min) + min;

// Generate a random integer between min and max (inclusive)
export const randomInt = (min, max) => Math.floor(random(min, max + 1));

// Generate a random boolean with a given probability
export const randomBool = (probability = 0.5) => Math.random() < probability;

// Generate a random color with optional alpha
export const randomColor = (alpha = 1) => {
  const r = randomInt(0, 255);
  const g = randomInt(0, 255);
  const b = randomInt(0, 255);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Generate a random cyberpunk color (cyan, magenta, green, white)
export const randomCyberpunkColor = (alpha = 1) => {
  const colors = [
    `rgba(0, 255, 255, ${alpha})`, // Cyan
    `rgba(255, 0, 255, ${alpha})`, // Magenta
    `rgba(0, 255, 0, ${alpha})`,   // Green
    `rgba(255, 255, 255, ${alpha})` // White
  ];
  return colors[randomInt(0, colors.length - 1)];
};

// Clear the canvas
export const clearCanvas = (ctx, width, height) => {
  ctx.clearRect(0, 0, width, height);
};

// Draw a rectangle
export const drawRect = (ctx, x, y, width, height, color, blendMode = 'source-over') => {
  const originalCompositeOperation = ctx.globalCompositeOperation;
  ctx.globalCompositeOperation = blendMode;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
  ctx.globalCompositeOperation = originalCompositeOperation;
};

// Draw a line
export const drawLine = (ctx, x1, y1, x2, y2, color, width = 1, blendMode = 'source-over') => {
  const originalCompositeOperation = ctx.globalCompositeOperation;
  ctx.globalCompositeOperation = blendMode;
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.globalCompositeOperation = originalCompositeOperation;
};

// Draw a circle
export const drawCircle = (ctx, x, y, radius, color, blendMode = 'source-over') => {
  const originalCompositeOperation = ctx.globalCompositeOperation;
  ctx.globalCompositeOperation = blendMode;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = originalCompositeOperation;
};
