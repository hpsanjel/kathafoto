const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const dist = path.join(root, "dist");

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist);

fs.copyFileSync(path.join(root, "index.html"), path.join(dist, "index.html"));
fs.cpSync(path.join(root, "assets"), path.join(dist, "assets"), { recursive: true });

for (const file of ["favicon.ico", "favicon-16.png", "favicon-32.png", "favicon-180.png", "favicon-512.png"]) {
  const src = path.join(root, file);
  if (fs.existsSync(src)) fs.copyFileSync(src, path.join(dist, file));
}

console.log("Built ./dist");
