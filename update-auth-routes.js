#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration
const AUTH_IMPORT = 'import { getAuthenticatedUser, requireAuth } from "@/lib/auth-helpers"';
const OLD_AUTH_PATTERN = /const token = \(await cookies\(\)\)\.get\("token"\)\?\.value[\s\S]*?const userId = decoded\.payload\.id/g;
const NEW_AUTH_BLOCK = `// Use NextAuth authentication instead of custom JWT
    const authError = await requireAuth();
    if (authError) return authError;
    
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = user.id`;

// Remove old imports
const REMOVE_IMPORTS = [
  /import \{ cookies \} from "next\/headers";/g,
  /import \{ verifyJWT as verifyJwtToken \} from "@\/utils\/auth";/g,
  /import \{ verifyJWT \} from "@\/utils\/auth";/g,
  /import jwt from "jsonwebtoken";/g
];

function updateApiRoute(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let wasModified = false;

    // Add auth-helpers import if not present
    if (!content.includes('getAuthenticatedUser, requireAuth')) {
      // Insert after other imports
      const importEndIndex = content.indexOf('\n', content.lastIndexOf('import '));
      if (importEndIndex !== -1) {
        content = content.substring(0, importEndIndex + 1) + AUTH_IMPORT + '\n' + content.substring(importEndIndex + 1);
        wasModified = true;
      }
    }

    // Remove old auth imports
    REMOVE_IMPORTS.forEach(pattern => {
      if (pattern.test(content)) {
        content = content.replace(pattern, '');
        wasModified = true;
      }
    });

    // Replace old auth pattern
    if (OLD_AUTH_PATTERN.test(content)) {
      content = content.replace(OLD_AUTH_PATTERN, NEW_AUTH_BLOCK);
      wasModified = true;
    }

    // Clean up extra blank lines
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

    if (wasModified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Updated: ${path.relative(process.cwd(), filePath)}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
    return false;
  }
}

function findApiRoutes(dir, routes = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Check if this directory has route.ts files
      const routeFile = path.join(fullPath, 'route.ts');
      if (fs.existsSync(routeFile)) {
        routes.push(routeFile);
      }
      
      // Recursively search subdirectories
      findApiRoutes(fullPath, routes);
    }
  }
  
  return routes;
}

function main() {
  console.log('🔄 Starting API route authentication update...\n');
  
  const apiDir = path.join(process.cwd(), 'app', 'api');
  
  if (!fs.existsSync(apiDir)) {
    console.error('❌ app/api directory not found');
    process.exit(1);
  }
  
  const routeFiles = findApiRoutes(apiDir);
  console.log(`📁 Found ${routeFiles.length} API route files\n`);
  
  let updated = 0;
  let skipped = 0;
  
  for (const routeFile of routeFiles) {
    // Skip already updated routes
    const content = fs.readFileSync(routeFile, 'utf8');
    if (content.includes('getAuthenticatedUser, requireAuth') && !content.includes('const token = (await cookies())')) {
      skipped++;
      continue;
    }
    
    if (updateApiRoute(routeFile)) {
      updated++;
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Updated: ${updated} routes`);
  console.log(`   ⏭️  Skipped: ${skipped} routes (already updated)`);
  console.log(`   📁 Total processed: ${routeFiles.length} routes`);
  
  if (updated === 0) {
    console.log('\n🎉 All routes are already updated or no changes needed!');
  }
}

if (require.main === module) {
  main();
}

module.exports = { updateApiRoute, findApiRoutes };