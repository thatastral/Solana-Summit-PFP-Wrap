import type { Plugin } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Vite plugin to handle figma:asset imports
 * Converts figma:asset/[hash].[ext] to actual file paths
 */
export function figmaAssetsPlugin(): Plugin {
  const assetCache = new Map<string, string>();

  return {
    name: 'vite-plugin-figma-assets',
    
    resolveId(source: string) {
      if (source.startsWith('figma:asset/')) {
        // Extract the asset filename from figma:asset/[filename]
        const assetPath = source.replace('figma:asset/', '');
        return '\0figma-asset:' + assetPath;
      }
      return null;
    },

    load(id: string) {
      if (id.startsWith('\0figma-asset:')) {
        const assetFilename = id.replace('\0figma-asset:', '');
        
        // Check if we've already resolved this asset
        if (assetCache.has(assetFilename)) {
          return assetCache.get(assetFilename);
        }

        // Look for the asset in common directories
        const possiblePaths = [
          path.resolve(process.cwd(), 'public', assetFilename),
          path.resolve(process.cwd(), 'assets', assetFilename),
          path.resolve(process.cwd(), 'src/assets', assetFilename),
        ];

        for (const possiblePath of possiblePaths) {
          if (fs.existsSync(possiblePath)) {
            // Return the public path
            const publicPath = `/${assetFilename}`;
            const code = `export default "${publicPath}";`;
            assetCache.set(assetFilename, code);
            return code;
          }
        }

        // If file doesn't exist, return a placeholder
        console.warn(`Figma asset not found: ${assetFilename}`);
        const code = `export default "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";`;
        assetCache.set(assetFilename, code);
        return code;
      }
      return null;
    },
  };
}
