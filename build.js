const fs = require("fs");
const path = require("path");

const rootDir = __dirname;
const distDir = path.join(rootDir, "dist");

const filesToCopy = ["index.html", "styles.css", "app.js"];
const foldersToCopy = ["Cali-creams-images", "Cali-creams-videos"];

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
  fs.cpSync(source, destination, { recursive: true });
}

console.log("Build complete: dist folder generated.");
