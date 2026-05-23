import { mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { transform } from "sucrase";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDir = path.resolve(__dirname, "..");
const srcDir = path.join(frontendDir, "src");
const outDir = path.join(frontendDir, "live");

const packageMap = new Map([
  ["react", "https://esm.sh/react@18.3.1?dev"],
  ["react-dom/client", "https://esm.sh/react-dom@18.3.1/client?dev"],
  [
    "react-router-dom",
    "https://esm.sh/react-router-dom@7.14.2?dev&deps=react@18.3.1,react-dom@18.3.1",
  ],
  ["lucide-react", "https://esm.sh/lucide-react@0.469.0"],
  ["@supabase/supabase-js", "https://esm.sh/@supabase/supabase-js@2"],
  ["jspdf", "https://esm.sh/jspdf@2.5.2"],
  ["axios", "https://esm.sh/axios@1.7.9"],
  ["recharts", "https://esm.sh/recharts@3.2.1"],
]);

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

function walk(directory) {
  const entries = readdirSync(directory);
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      files.push(...walk(fullPath));
    } else if (/\.(js|jsx)$/.test(entry)) {
      files.push(fullPath);
    }
  }

  return files;
}

function rewriteImports(code) {
  let rewritten = code.replace(/^import\s+["']\.\/index\.css["'];?\s*$/gm, "");

  rewritten = rewritten.replace(
    /(import\s+[^'"]*?from\s+["'])([^"']+)(["'])/g,
    (_, prefix, specifier, suffix) => `${prefix}${resolveSpecifier(specifier)}${suffix}`
  );

  rewritten = rewritten.replace(
    /(export\s+[^'"]*?from\s+["'])([^"']+)(["'])/g,
    (_, prefix, specifier, suffix) => `${prefix}${resolveSpecifier(specifier)}${suffix}`
  );

  return rewritten;
}

function resolveSpecifier(specifier) {
  if (packageMap.has(specifier)) {
    return packageMap.get(specifier);
  }

  if (specifier.startsWith(".")) {
    if (specifier.endsWith(".css")) {
      return specifier;
    }

    if (specifier.endsWith(".js") || specifier.endsWith(".jsx")) {
      return specifier.replace(/\.jsx?$/, ".js");
    }

    return `${specifier}.js`;
  }

  return specifier;
}

function hoistImports(code) {
  const importRegex = /^import[\s\S]*?;\s*$/gm;
  const matches = [...code.matchAll(importRegex)];

  if (!matches.length) {
    return code;
  }

  const imports = matches.map((match) => match[0].trim());
  const body = code.replace(importRegex, "").trimStart();

  return `${imports.join("\n")}\n${body}`;
}

for (const sourcePath of walk(srcDir)) {
  const relativePath = path.relative(srcDir, sourcePath);
  const outputPath = path.join(outDir, relativePath).replace(/\.jsx$/, ".js");
  const outputDir = path.dirname(outputPath);
  mkdirSync(outputDir, { recursive: true });

  const source = readFileSync(sourcePath, "utf8");
  const rewritten = rewriteImports(source);
  let transformed = transform(rewritten, {
    transforms: ["jsx"],
    production: true,
  }).code;

  transformed = transformed.replace(/}(?=import\s)/g, "}\n");

  if (transformed.includes("React.createElement") && !/import\s+React\b/.test(transformed)) {
    transformed = `import React from "${packageMap.get("react")}";\n${transformed}`;
  }

  transformed = hoistImports(transformed);

  writeFileSync(outputPath, transformed, "utf8");
}
