// fix-undefined.ts
import fs from "fs";
import path from "path";

// Replace undefined strings with fallback ""
function fixFile(filePath: string) {
  let content = fs.readFileSync(filePath, "utf-8");

  // Regex to find JSX props that could be undefined
  // Example: src={user.avatarUrl} -> src={user.avatarUrl || ""}
  content = content.replace(
    /(\w+)=\{([^\}]+)\}/g,
    (match, prop, value) => {
      // skip if it already has fallback
      if (value.includes("||")) return match;

      // only add fallback for string props (heuristic)
      if (prop.match(/src|alt|value|id|name|placeholder/)) {
        return `${prop}={${value} || ""}`;
      }
      return match;
    }
  );

  fs.writeFileSync(filePath, content, "utf-8");
  console.log(`Fixed: ${filePath}`);
}

// Recursively scan folder
function fixFolder(folderPath: string) {
  const files = fs.readdirSync(folderPath);

  for (const file of files) {
    const fullPath = path.join(folderPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      fixFolder(fullPath);
    } else if (fullPath.endsWith(".tsx")) {
      fixFile(fullPath);
    }
  }
}

// Start from ui folder
const uiFolder = path.join(process.cwd(), "src/components/ui");
fixFolder(uiFolder);

console.log("✅ All UI components fixed for string | undefined errors.");