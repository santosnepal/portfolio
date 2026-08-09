const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

const BUILD_DIR = path.join(__dirname, "..", "build");
const OUTPUT_DIR = path.join(BUILD_DIR, "gh-pages");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "index.html");
const PUBLIC_URL = (require("../package.json").homepage || "").replace(/\/$/, "");

function getPublicPathPrefix() {
  if (!PUBLIC_URL) {
    return "";
  }

  if (/^https?:\/\//i.test(PUBLIC_URL)) {
    return new URL(PUBLIC_URL).pathname.replace(/\/$/, "");
  }

  return PUBLIC_URL.replace(/\/$/, "");
}

const PUBLIC_PATH_PREFIX = getPublicPathPrefix();

const MIME_TYPES = {
  css: "text/css",
  js: "application/javascript",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  svg: "image/svg+xml",
  gif: "image/gif",
  webp: "image/webp",
  ico: "image/x-icon",
  pdf: "application/pdf",
  woff: "font/woff",
  woff2: "font/woff2",
  ttf: "font/ttf",
  eot: "application/vnd.ms-fontobject",
  map: "application/json",
};

function collectFiles(dir, files = []) {
  if (!fs.existsSync(dir)) {
    return files;
  }

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectFiles(fullPath, files);
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

function toDataUri(filePath) {
  const ext = path.extname(filePath).slice(1).toLowerCase();
  const mime = MIME_TYPES[ext] || "application/octet-stream";
  const data = fs.readFileSync(filePath);
  return `data:${mime};base64,${data.toString("base64")}`;
}

function resolveBuildPath(assetPath) {
  let normalized = assetPath.replace(/^\.\//, "");

  if (
    PUBLIC_PATH_PREFIX &&
    (normalized.startsWith(`${PUBLIC_PATH_PREFIX}/`) ||
      normalized === PUBLIC_PATH_PREFIX)
  ) {
    normalized = normalized.slice(PUBLIC_PATH_PREFIX.length).replace(/^\//, "");
  } else {
    normalized = normalized.replace(/^\//, "");
  }

  return path.join(BUILD_DIR, normalized);
}

function isExternalUrl(assetPath) {
  return /^https?:\/\//i.test(assetPath) || assetPath.startsWith("//");
}

function getPublicPaths(filePath) {
  const relativePath = path.relative(BUILD_DIR, filePath).split(path.sep).join("/");
  const paths = new Set([relativePath, `/${relativePath}`]);

  if (PUBLIC_PATH_PREFIX) {
    paths.add(`${PUBLIC_PATH_PREFIX}/${relativePath}`);
  }

  if (PUBLIC_URL) {
    paths.add(`${PUBLIC_URL}/${relativePath}`);
  }

  return [...paths];
}

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;

    client
      .get(url, (response) => {
        if (
          response.statusCode >= 300 &&
          response.statusCode < 400 &&
          response.headers.location
        ) {
          fetchBuffer(new URL(response.headers.location, url).href)
            .then(resolve)
            .catch(reject);
          return;
        }

        if (response.statusCode !== 200) {
          reject(new Error(`Failed to fetch ${url} (${response.statusCode})`));
          return;
        }

        const chunks = [];
        response.on("data", (chunk) => chunks.push(chunk));
        response.on("end", () => resolve(Buffer.concat(chunks)));
        response.on("error", reject);
      })
      .on("error", reject);
  });
}

async function fetchText(url) {
  const buffer = await fetchBuffer(url);
  return buffer.toString("utf8");
}

function inlineCssUrls(css, cssFilePath) {
  return css.replace(/url\((['"]?)([^'")]+)\1\)/g, (match, _quote, url) => {
    if (url.startsWith("data:") || url.startsWith("http")) {
      return match;
    }

    const assetPath = url.startsWith("/")
      ? resolveBuildPath(url)
      : path.resolve(path.dirname(cssFilePath), url);

    if (!fs.existsSync(assetPath)) {
      return match;
    }

    return `url("${toDataUri(assetPath)}")`;
  });
}

async function inlineRemoteCssUrls(css, baseUrl) {
  const matches = [...css.matchAll(/url\((['"]?)([^'")]+)\1\)/g)];
  let output = css;

  for (const match of matches) {
    const rawUrl = match[2];
    if (rawUrl.startsWith("data:")) {
      continue;
    }

    const absoluteUrl = new URL(rawUrl, baseUrl).href;
    if (!isExternalUrl(absoluteUrl)) {
      continue;
    }

    try {
      const buffer = await fetchBuffer(absoluteUrl);
      const ext = path.extname(new URL(absoluteUrl).pathname).slice(1).toLowerCase();
      const mime = MIME_TYPES[ext] || "application/octet-stream";
      const dataUri = `data:${mime};base64,${buffer.toString("base64")}`;
      output = output.split(match[0]).join(`url("${dataUri}")`);
    } catch (error) {
      console.warn(`Could not inline remote asset ${absoluteUrl}: ${error.message}`);
    }
  }

  return output;
}

function replaceAssetReferences(content, assetMap) {
  let output = content;
  const assetPaths = Object.keys(assetMap)
    .filter((assetPath) => !assetPath.endsWith(".map"))
    .sort((a, b) => b.length - a.length);

  for (const assetPath of assetPaths) {
    output = output.split(assetPath).join(assetMap[assetPath]);
  }

  return output;
}

function escapeInlineScript(js) {
  return js.replace(/<\/script/gi, "<\\/script>");
}

function escapeInlineStyle(css) {
  return css.replace(/<\/style/gi, "<\\/style>");
}

function stripCssImports(css) {
  const imports = [];

  const cleaned = css.replace(
    /@import\s+url\((['"]?)([^'")]+)\1\)\s*;?/gi,
    (_match, _quote, url) => {
      imports.push(url);
      return "";
    }
  );

  return { cleaned, imports };
}

async function buildStyleBlock(css, cssFilePath, assetMap) {
  const extracted = stripCssImports(css);
  let styles = [];

  for (const importUrl of extracted.imports) {
    styles.push(await buildRemoteStyleBlock(importUrl));
  }

  let localCss = inlineCssUrls(extracted.cleaned, cssFilePath);
  localCss = replaceAssetReferences(localCss, assetMap);
  styles.push(`<style>${escapeInlineStyle(localCss)}</style>`);

  return styles.join("");
}

async function inlineLocalStylesheets(html, assetMap) {
  const localStylesheets = [
    ...html.matchAll(/<link\s+[^>]*href="([^"]+\.css)"[^>]*>/g),
  ].filter((match) => !isExternalUrl(match[1]));

  for (const match of localStylesheets) {
    const [fullMatch, href] = match;
    const cssPath = resolveBuildPath(href);
    const css = fs.readFileSync(cssPath, "utf8");
    const styleBlock = await buildStyleBlock(css, cssPath, assetMap);
    html = html.replace(fullMatch, styleBlock);
  }

  return html;
}

async function buildRemoteStyleBlock(url) {
  const css = await fetchText(url);
  const inlinedCss = await inlineRemoteCssUrls(css, url);
  return `<style>${escapeInlineStyle(inlinedCss)}</style>`;
}

function getOrderedScriptFiles() {
  const jsDir = path.join(BUILD_DIR, "static/js");

  if (!fs.existsSync(jsDir)) {
    return [];
  }

  return fs
    .readdirSync(jsDir)
    .filter((fileName) => fileName.endsWith(".js") && !fileName.endsWith(".map"))
    .map((fileName) => path.join(jsDir, fileName))
    .sort((a, b) => {
      const aIsMain = path.basename(a).startsWith("main.");
      const bIsMain = path.basename(b).startsWith("main.");

      if (aIsMain && !bIsMain) {
        return 1;
      }

      if (!aIsMain && bIsMain) {
        return -1;
      }

      return a.localeCompare(b);
    });
}

async function inlineBuildAssets() {
  if (!fs.existsSync(path.join(BUILD_DIR, "index.html"))) {
    throw new Error("Build output not found. Run `npm run build` first.");
  }

  const assetMap = {};

  for (const filePath of collectFiles(BUILD_DIR)) {
    if (filePath.endsWith(".html") || filePath.endsWith(".map")) {
      continue;
    }

    const dataUri = toDataUri(filePath);
    for (const publicPath of getPublicPaths(filePath)) {
      assetMap[publicPath] = dataUri;
    }
  }

  let html = fs.readFileSync(path.join(BUILD_DIR, "index.html"), "utf8");

  for (const match of [...html.matchAll(/<link\s+[^>]*href="([^"]+\.css)"[^>]*>/g)]) {
    const [fullMatch, href] = match;

    if (!isExternalUrl(href)) {
      continue;
    }

    try {
      const styleBlock = await buildRemoteStyleBlock(href);
      html = html.replace(fullMatch, styleBlock);
    } catch (error) {
      console.warn(`Keeping external stylesheet ${href}: ${error.message}`);
    }
  }

  html = await inlineLocalStylesheets(html, assetMap);

  html = html.replace(
    /<script\s+[^>]*src="([^"]+\.js)"[^>]*>\s*<\/script>/g,
    (match, src) => (isExternalUrl(src) ? match : "")
  );

  const inlinedScripts = getOrderedScriptFiles().map((jsPath) => {
    let js = fs.readFileSync(jsPath, "utf8");
    js = replaceAssetReferences(js, assetMap);
    return escapeInlineScript(js);
  });

  html = html.replace(/<link\s+[^>]*rel="preload"[^>]*>/g, "");
  html = html.replace(
    /<link\s+[^>]*href="([^"]+\.(?:png|jpg|jpeg|gif|svg|ico|webp))"[^>]*>/g,
    (match, href) => {
      if (isExternalUrl(href)) {
        return match;
      }

      const assetPath = resolveBuildPath(href);
      if (!fs.existsSync(assetPath)) {
        return match;
      }

      return `<link rel="icon" href="${toDataUri(assetPath)}" type="image/x-icon" />`;
    }
  );

  if (inlinedScripts.length > 0) {
    const scriptTags = inlinedScripts
      .map((js) => `<script>${js}</script>`)
      .join("");
    html = html.replace("</body>", `${scriptTags}</body>`);
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, html);
  fs.writeFileSync(path.join(OUTPUT_DIR, ".nojekyll"), "");
}

inlineBuildAssets()
  .then(() => {
    console.log(`Single-file build created at ${OUTPUT_FILE}`);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
