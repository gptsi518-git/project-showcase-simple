// After the GitHub Pages build: the site lives under /<repo>/, so root paths to files
// from public/ (e.g. "/images/x.png") must get that prefix. Also adds 404.html and .nojekyll.
import { readdirSync, readFileSync, writeFileSync, statSync, copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const base = process.env.PAGES_BASE ?? "/";
const out = "dist/client";
if (base === "/") process.exit(0);

const topLevel = existsSync("public")
  ? readdirSync("public").map((name) => (statSync(join("public", name)).isDirectory() ? `${name}/` : name))
  : [];
const pattern = new RegExp(`(["'(\`])/(${topLevel.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "g");

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (/\.(html|js|css)$/.test(name)) {
      const text = readFileSync(path, "utf8");
      const fixed = topLevel.length ? text.replace(pattern, `$1${base}$2`) : text;
      if (fixed !== text) writeFileSync(path, fixed);
    }
  }
}

walk(out);
copyFileSync(join(out, "index.html"), join(out, "404.html"));
writeFileSync(join(out, ".nojekyll"), "");
