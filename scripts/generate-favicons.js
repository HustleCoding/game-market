// This script requires the "sharp" package to be installed
// npm install sharp --save-dev

import sharp from "sharp";
import fs from "fs";
import path from "path";

const publicDir = path.join(process.cwd(), "public");
const svgPath = path.join(publicDir, "favicon.svg");

// Make sure the SVG exists
if (!fs.existsSync(svgPath)) {
  console.error("favicon.svg not found in public directory!");
  process.exit(1);
}

// Sizes to generate
const sizes = [
  { name: "favicon-16x16.png", size: 16 },
  { name: "favicon-32x32.png", size: 32 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "android-chrome-192x192.png", size: 192 },
  { name: "android-chrome-512x512.png", size: 512 },
];

// Read the SVG
const svgBuffer = fs.readFileSync(svgPath);

// Generate each size
async function generateFavicons() {
  console.log("Generating favicons...");

  for (const { name, size } of sizes) {
    const outputPath = path.join(publicDir, name);

    await sharp(svgBuffer).resize(size, size).png().toFile(outputPath);

    console.log(`Generated ${name} (${size}x${size})`);
  }

  // Also generate the og-image at 1200x630
  await sharp(svgBuffer)
    .resize(1200, 630, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255 },
    })
    .png()
    .toFile(path.join(publicDir, "og-image.jpg"));

  console.log("Generated og-image.jpg (1200x630)");

  console.log("All favicons generated successfully!");
}

generateFavicons().catch((err) => {
  console.error("Error generating favicons:", err);
  process.exit(1);
});
