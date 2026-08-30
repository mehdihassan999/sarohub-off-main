import sharp from 'sharp';

const INPUT = 'C:/Users/Alin world/.gemini/antigravity-ide/brain/c9b5b933-a259-478a-9e4b-fad9f6c2cc13/hero_robot_clean_1783745681582.png';
const OUTPUT = 'public/assets/hero-robot.png';

async function removeBg() {
  const image = sharp(INPUT).ensureAlpha();
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const threshold = 235;       // pixels with R,G,B all above this → transparent
  const edgeSmooth = 220;      // softer transition zone

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    if (r > threshold && g > threshold && b > threshold) {
      // Fully white → fully transparent
      data[i + 3] = 0;
    } else if (r > edgeSmooth && g > edgeSmooth && b > edgeSmooth) {
      // Near-white → partial transparency for anti-aliased edges
      const avg = (r + g + b) / 3;
      const alpha = Math.round(255 * (1 - (avg - edgeSmooth) / (255 - edgeSmooth)));
      data[i + 3] = Math.min(data[i + 3], alpha);
    }
  }

  await sharp(data, { raw: { width, height, channels } })
    .png()
    .toFile(OUTPUT);

  console.log(`✅ Background removed! Saved to ${OUTPUT}`);
  console.log(`   Dimensions: ${width}x${height}`);
}

removeBg().catch(console.error);
