import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const TARGETS = [
  path.join(ROOT, "data"),
  path.join(ROOT, "src"),
];
const ASSET_RE = /(["'`])\/(tours|destinos|blog)\/([^"'`\\]+\.(?:jpg|jpeg|png|webp|avif|gif|svg))\1/gi;

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next") continue;
      walk(full, acc);
    } else if (/\.(json|ts|tsx|js|mjs|txt)$/.test(entry.name)) {
      acc.push(full);
    }
  }
  return acc;
}

let files = 0;
let replacements = 0;

for (const root of TARGETS) {
  for (const file of walk(root)) {
    const orig = fs.readFileSync(file, "utf8");
    let count = 0;
    const next = orig.replace(ASSET_RE, (_m, quote, folder, rest) => {
      count += 1;
      return `${quote}/media/${folder}/${rest}${quote}`;
    });
    if (next !== orig) {
      fs.writeFileSync(file, next);
      files += 1;
      replacements += count;
      console.log(path.relative(ROOT, file), count);
    }
  }
}

console.log(`JSON actualizados: ${files}. Reemplazos: ${replacements}.`);
