/**
 * Script to generate PWA icons
 * Run with: node scripts/generate-pwa-icons.js
 * 
 * This script creates placeholder PNG icons for PWA.
 * Replace these with your actual app icons.
 */

const fs = require('fs');
const path = require('path');

// Simple SVG icon template (can be replaced with actual design)
const svgIcon = `
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#10b981"/>
  <text x="256" y="300" font-family="Arial, sans-serif" font-size="180" font-weight="bold" fill="white" text-anchor="middle">H</text>
</svg>
`;

// For now, we'll create a note file explaining how to generate icons
// In production, you should use a tool like sharp or jimp to convert SVG to PNG
// Or use an online tool like https://realfavicongenerator.net/

const iconInstructions = `
# PWA Icons Generation

To generate PWA icons, you need to create two PNG files:

1. icon-192x192.png (192x192 pixels)
2. icon-512x512.png (512x512 pixels)

You can:
1. Use an online tool like https://realfavicongenerator.net/
2. Use a design tool like Figma, Sketch, or Photoshop
3. Use a command-line tool like sharp or jimp

The icons should:
- Have a transparent or solid background matching your theme (#10b981 or #0f0f0f)
- Be square (1:1 aspect ratio)
- Be clear and recognizable at small sizes
- Follow PWA icon guidelines: https://web.dev/add-manifest/

Place the generated PNG files in the /public directory:
- public/icon-192x192.png
- public/icon-512x512.png

The SVG template above shows a simple "H" logo - you can use this as a starting point
or replace it with your actual app logo design.
`;

fs.writeFileSync(
  path.join(__dirname, '../public/icon-generation-instructions.md'),
  iconInstructions
);

console.log('✅ Icon generation instructions created at public/icon-generation-instructions.md');
console.log('📝 Please create icon-192x192.png and icon-512x512.png in the public/ directory');

