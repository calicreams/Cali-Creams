const fs = require("fs");
const path = require("path");

const rootDir = __dirname;
const distDir = path.join(rootDir, "dist");

const filesToCopy = ["index.html", "styles.css", "app.js"];
const foldersToCopy = ["Cali-creams-images", "Cali-creams-videos"];
const videosToPublish = [
  "cali-creams-promotion-video-web.mp4",
  "cali-creams-promotion-video-All.mp4",
  "cali-creams-promo-mobile.webp"
];

if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}

fs.mkdirSync(distDir, { recursive: true });

for (const fileName of filesToCopy) {
  const source = path.join(rootDir, fileName);
  const destination = path.join(distDir, fileName);
  fs.copyFileSync(source, destination);
}

for (const folderName of foldersToCopy) {
  const source = path.join(rootDir, folderName);
  const destination = path.join(distDir, folderName);
  if (folderName !== "Cali-creams-videos") {
    fs.cpSync(source, destination, { recursive: true });
    continue;
  }

  fs.mkdirSync(destination, { recursive: true });
  for (const videoName of videosToPublish) {
    const videoSource = path.join(source, videoName);
    const videoDestination = path.join(destination, videoName);
    fs.copyFileSync(videoSource, videoDestination);
  }
}

console.log("Build complete: dist folder generated.");
