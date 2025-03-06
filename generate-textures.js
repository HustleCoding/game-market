const fs = require("fs");
const { createCanvas } = require("canvas");

// Create the textures directory if it doesn't exist
const texturesDir = "./public/textures";
if (!fs.existsSync(texturesDir)) {
  fs.mkdirSync(texturesDir, { recursive: true });
}

// Function to generate a simple texture
function generateTexture(filename, width, height, drawFunction) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Fill with a base color
  ctx.fillStyle = "#333333";
  ctx.fillRect(0, 0, width, height);

  // Apply custom drawing
  drawFunction(ctx, width, height);

  // Save to file
  const buffer = canvas.toBuffer("image/jpeg");
  fs.writeFileSync(`${texturesDir}/${filename}`, buffer);

  console.log(`Generated ${filename}`);
}

// Generate a roughness texture with random noise
generateTexture("terrain-roughness.jpg", 512, 512, (ctx, width, height) => {
  // Create grainy texture for roughness
  for (let x = 0; x < width; x += 4) {
    for (let y = 0; y < height; y += 4) {
      const gray = Math.floor(Math.random() * 100 + 100);
      ctx.fillStyle = `rgb(${gray}, ${gray}, ${gray})`;
      ctx.fillRect(x, y, 4, 4);
    }
  }
});

// Generate a normal map with some simple patterns
generateTexture("terrain-normal.jpg", 512, 512, (ctx, width, height) => {
  // Create a simple normal map (mostly flat with some variation)
  ctx.fillStyle = "#8080ff"; // Default normal pointing up (in normal map RGB format)
  ctx.fillRect(0, 0, width, height);

  // Add some variations
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const radius = Math.random() * 40 + 10;

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, "#7878FF");
    gradient.addColorStop(1, "#8080FF");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
});

console.log("Texture generation complete!");
