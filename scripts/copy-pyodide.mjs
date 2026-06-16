import { cpSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const source = join(root, "node_modules", "pyodide");
const target = join(root, "public", "pyodide");

if (!existsSync(source)) {
  console.log("Pyodide package is not installed yet; skipping asset copy.");
  process.exit(0);
}

mkdirSync(target, { recursive: true });

const wanted = readdirSync(source).filter(
  (file) =>
    file.endsWith(".js") ||
    file.endsWith(".wasm") ||
    file.endsWith(".data") ||
    file.endsWith(".json") ||
    file.endsWith(".whl") ||
    file.endsWith(".zip")
);

for (const file of wanted) {
  cpSync(join(source, file), join(target, file));
}

console.log(`Copied ${wanted.length} Pyodide assets to public/pyodide.`);
