import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDir = path.resolve(__dirname, "..");
const distDir = path.join(frontendDir, "dist");

const apiBaseUrl = process.env.VITE_API_BASE_URL || process.env.API_BASE_URL || "http://127.0.0.1:8000";
const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://your-project.supabase.co";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "your-anon-key";

rmSync(distDir, { recursive: true, force: true });
mkdirSync(distDir, { recursive: true });

for (const relativePath of ["index.html", "browser-app.js"]) {
  cpSync(path.join(frontendDir, relativePath), path.join(distDir, relativePath));
}

if (existsSync(path.join(frontendDir, "assets"))) {
  cpSync(path.join(frontendDir, "assets"), path.join(distDir, "assets"), { recursive: true });
}

if (existsSync(path.join(frontendDir, "public"))) {
  cpSync(path.join(frontendDir, "public"), distDir, { recursive: true });
}

const configContents = [
  `window.__API_BASE_URL__ = ${JSON.stringify(apiBaseUrl)};`,
  `window.__SUPABASE_URL__ = ${JSON.stringify(supabaseUrl)};`,
  `window.__SUPABASE_ANON_KEY__ = ${JSON.stringify(supabaseAnonKey)};`,
  "",
].join("\n");

writeFileSync(path.join(distDir, "config.js"), configContents, "utf8");

const indexPath = path.join(distDir, "index.html");
const indexContents = readFileSync(indexPath, "utf8").replace(
  /<script src="https:\/\/cdn\.tailwindcss\.com"><\/script>/,
  '<script src="https://cdn.tailwindcss.com"></script>'
);
writeFileSync(indexPath, indexContents, "utf8");
