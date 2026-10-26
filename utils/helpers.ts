import fs from 'fs';
import path from 'path';

export function ensureDirectory(dirPath: string): void {
  fs.mkdirSync(dirPath, { recursive: true });
}

export function resolveWorkspacePath(...segments: string[]): string {
  return path.resolve(process.cwd(), ...segments);
}
