/**
 * Generate PNG icons (apple-touch-icon 180×180 + favicon 32×32)
 * from the NoadFlow logo.
 *
 * Apple touch icons should be opaque squares (iOS adds rounded
 * corners automatically). We render the LIGHT-theme version of
 * the logo (dark swooshes on a white background) because iOS
 * home screens are typically light — so a dark logo reads well.
 *
 * Users on dark iOS still see the same icon (iOS doesn't support
 * theme-aware apple-touch-icons natively), but the white
 * background keeps it legible on both.
 */
import sharp from "sharp";
import { writeFileSync } from "fs";

// Static light-theme logo SVG (primary = #1b1a17, secondary = #1b1a17@0.4)
// Same paths as favicon.svg but without the prefers-color-scheme switch.
const logoSvg = `<?xml version="1.0" encoding="utf-8"?>
<svg version="1.1" xmlns="http://www.w3.org/2000/svg"
     viewBox="46 120 498 498" preserveAspectRatio="xMidYMid meet">
  <rect x="0" y="0" width="612" height="792" fill="#ffffff"/>
  <g fill="#1b1a17" fill-opacity="0.4">
    <path d="M242.58,367.54c0.05-26.94,25.24-50.87,54.94-49.09c28.64,1.72,46.1,19.81,46.26,50.57 c0.14,27.72-19.22,52.88-47.19,52.13C263.61,420.27,245.64,406.17,242.58,367.54z" />
    <path d="M476.19,366.09c2.13,39.27-9,73.76-27.96,105.41c-15.55,25.96-38.5,44.95-65.02,59.79 c-28.77,16.1-59.81,23.8-92.22,23.19c-30.67-0.57-59.92-8.97-85.8-26.46c-18.37-12.41-20.91-11.36-41.78,7.15 c-22.43,19.89-46.06,38.41-69.23,57.46c-1.71,1.41-3.9,3.02-6.22,1.02c-2.54-2.19,0.08-3.54,1.2-4.87 c16.08-19.09,31.76-38.54,48.46-57.08c17.58-19.52,36.2-38.09,54.23-57.2c12.5-13.25,16.14-12,33.46-0.63 c29.05,19.05,60.39,28.67,96.19,20.09c26.27-6.3,48.93-17.06,65.8-38.32c17.53-22.11,30.73-45.76,31.52-75.4 c0.89-33.43-7.35-63.08-28.98-88.88c-5.9-7.04,1.87-11.06,5.2-14.89c7.91-9.12,16.88-17.32,25.45-25.86 c8.04-8.01,11.17-0.36,15.02,4.78c16.17,21.58,28.72,45.05,35.8,71.15C474.94,339.94,478.53,353.5,476.19,366.09z" />
  </g>
  <g fill="#1b1a17">
    <path d="M503.77,145.63c-1.14-2.58-3.81-0.85-5.1,0.14c-26.16,20-50.68,41.33-75.54,62.97 c-7.23,5.29-11.91,14.24-22.08,12.04c-5.71-1.25-10.91-5.42-16.03-8.76c-25.81-16.8-54.52-25.06-84.86-25.44 c-15.34-0.19-31.11,1.03-46.37,5.48c-19.53,5.69-38.86,11.69-55.86,23.19c-24.15,16.34-43.51,37.17-58.5,62.31 c-14.11,23.68-21.8,49.38-24.52,76.38c-1.52,15.19-0.56,30.6,2.37,45.96c2.41,12.62,5.05,25.22,10.18,36.71 c6.61,14.83,14.88,29.06,23.82,42.63c3.41,5.15,6.62,17.43,16.88,9.59c9.38-7.17,16.8-16.86,25.26-25.26 c4.87-4.84,4.77-9.56,1.16-15.06c-15.5-23.62-25.92-48.92-25.28-77.85c0.37-21.54,4.21-42.17,14.85-61.31 c19.46-35.02,49.21-56.85,87.77-65.12c37.81-8.11,72.22,1.51,101.2,27.5c5.2,4.65,7.5,2.57,10.87-0.8 c19.75-19.8,39.52-39.6,59.25-59.41c19.89-19.97,39.78-39.92,59.5-60.05C503.93,150.26,504.46,147.17,503.77,145.63z M469.75,176.72 c-0.33-0.21-0.69-0.39-0.94-0.67c-0.06-0.07,0.29-0.69,0.38-0.68c0.37,0.07,0.71,0.29,1.09,0.46 C470.04,176.23,469.89,176.48,469.75,176.72z" />
    <path d="M470.28,175.83c-0.24,0.4-0.39,0.65-0.53,0.89c-0.33-0.21-0.69-0.39-0.94-0.67c-0.06-0.07,0.29-0.69,0.38-0.68 C469.56,175.44,469.9,175.66,470.28,175.83z" />
  </g>
</svg>`;

const svgBuffer = Buffer.from(logoSvg, "utf-8");

const out = "/home/z/my-project/public";

// Apple touch icon — 180×180 PNG, opaque white background, dark logo.
await sharp(svgBuffer)
  .resize(180, 180, { fit: "contain", background: "#ffffff" })
  .png()
  .toFile(`${out}/apple-touch-icon.png`);
console.log("✓ apple-touch-icon.png (180×180)");

// Favicon PNG fallback — 32×32 (for browsers that don't support SVG favicons).
await sharp(svgBuffer)
  .resize(32, 32, { fit: "contain", background: "#ffffff" })
  .png()
  .toFile(`${out}/favicon-32.png`);
console.log("✓ favicon-32.png (32×32)");

// Favicon PNG fallback — 16×16 (legacy).
await sharp(svgBuffer)
  .resize(16, 16, { fit: "contain", background: "#ffffff" })
  .png()
  .toFile(`${out}/favicon-16.png`);
console.log("✓ favicon-16.png (16×16)");

console.log("\nAll icons generated in /public");
