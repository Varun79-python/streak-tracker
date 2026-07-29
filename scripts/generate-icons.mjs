import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const ICONS_DIR = path.join(PUBLIC_DIR, 'icons');

const sizes = [
  { name: 'icon-72x72.png', size: 72 },
  { name: 'icon-96x96.png', size: 96 },
  { name: 'icon-128x128.png', size: 128 },
  { name: 'icon-144x144.png', size: 144 },
  { name: 'icon-152x152.png', size: 152 },
  { name: 'icon-192x192.png', size: 192 },
  { name: 'icon-384x384.png', size: 384 },
  { name: 'icon-512x512.png', size: 512 },
];

// Maskable icon needs padding for safe zone
const maskableSizes = [
  { name: 'icon-192x192-maskable.png', size: 192 },
  { name: 'icon-512x512-maskable.png', size: 512 },
];

async function generateIcons() {
  const inputPath = path.join(PUBLIC_DIR, 'icon.png');
  
  console.log('Generating PWA icons from:', inputPath);
  
  // Generate standard icons
  for (const { name, size } of sizes) {
    const outputPath = path.join(ICONS_DIR, name);
    await sharp(inputPath)
      .resize(size, size, { fit: 'contain', background: { r: 11, g: 15, b: 25, alpha: 1 } })
      .png()
      .toFile(outputPath);
    console.log(`✓ Created ${name}`);
  }
  
  // Generate maskable icons with padding (80% safe zone)
  for (const { name, size } of maskableSizes) {
    const outputPath = path.join(ICONS_DIR, name);
    const padding = Math.round(size * 0.1); // 10% padding on each side
    const iconSize = size - (padding * 2);
    
    // Create background
    const background = await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 11, g: 15, b: 25, alpha: 1 }
      }
    }).png().toBuffer();
    
    // Resize icon
    const icon = await sharp(inputPath)
      .resize(iconSize, iconSize, { fit: 'contain' })
      .png()
      .toBuffer();
    
    // Composite icon onto background
    await sharp(background)
      .composite([{
        input: icon,
        left: padding,
        top: padding
      }])
      .png()
      .toFile(outputPath);
    console.log(`✓ Created ${name} (maskable)`);
  }
  
  console.log('\n✅ All icons generated successfully!');
}

generateIcons().catch(console.error);
