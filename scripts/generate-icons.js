/**
 * Generate PWA icons for Hyperapex
 * Run with: node scripts/generate-icons.js
 * 
 * This requires the 'sharp' package for high-quality image generation
 */

const fs = require('fs');
const path = require('path');

// SVG template for the icon - clean, modern design
const svgIcon = `
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#10b981;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#059669;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background with rounded corners -->
  <rect width="512" height="512" rx="80" ry="80" fill="url(#grad)"/>
  
  <!-- Modern "H" letter with clean design -->
  <text x="256" y="320" font-family="Arial, sans-serif" font-size="280" font-weight="bold" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">H</text>
  
  <!-- Subtle inner shadow effect -->
  <rect width="512" height="512" rx="80" ry="80" fill="none" stroke="rgba(0,0,0,0.1)" stroke-width="2"/>
</svg>
`;

// Instructions
const instructions = `
# PWA Icon Generation

## Option 1: Use the HTML Generator (Recommended)
1. Open http://localhost:3168/create-pwa-icon.html in your browser
2. Click "Download Both" to generate both icon sizes
3. Save the files to the public/ directory

## Option 2: Use Online Tool
1. Visit https://realfavicongenerator.net/
2. Upload your logo or use their design tools
3. Download the generated icons
4. Save as icon-192x192.png and icon-512x512.png in public/

## Option 3: Use Design Software
1. Create a 512x512px design in Figma, Photoshop, or similar
2. Export as PNG at 192x192 and 512x512 sizes
3. Ensure the design is clear and recognizable at small sizes
4. Place in public/ directory

## Current SVG Template
The SVG template above shows a clean "H" logo design. 
You can customize this SVG and convert it to PNG using:
- Online converters (https://convertio.co/svg-png/)
- Design software
- The HTML generator tool

## Requirements
- 192x192 pixels (icon-192x192.png)
- 512x512 pixels (icon-512x512.png)
- PNG format
- Square (1:1 aspect ratio)
- Clear and recognizable at small sizes
`;

console.log('📝 Icon generation instructions:');
console.log(instructions);

// Save SVG template for reference
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(
  path.join(publicDir, 'icon-template.svg'),
  svgIcon.trim()
);

console.log('\n✅ SVG template saved to public/icon-template.svg');
console.log('💡 You can use this SVG with online converters or design tools');

