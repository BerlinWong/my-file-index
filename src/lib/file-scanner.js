import fs from 'fs';
import path from 'path';

const STORAGE_ROOT = path.join(process.cwd(), 'public/files');

export function getAllFiles(dir = STORAGE_ROOT, fileList = [], rootDir = STORAGE_ROOT) {
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    if (file.startsWith('.')) return;

    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getAllFiles(filePath, fileList, rootDir);
    } else {
      const ext = path.extname(file).toLowerCase().replace('.', '') || 'unknown';
      const relativePath = path.relative(rootDir, filePath);
      const webPath = relativePath.split(path.sep).join('/');
      
      fileList.push({
        id: webPath,
        name: file,
        sizeDisplay: (stat.size / 1024).toFixed(2) + ' KB',
        sizeRaw: stat.size, // 用于排序
        date: stat.mtime.toISOString(), // 用于排序
        ext: ext,
        url: `/files/${webPath}`,
        folder: path.dirname(webPath) === '.' ? '' : path.dirname(webPath), // 根目录设为空字符串
        pathParts: webPath.split('/') // 用于前端路径分析
      });
    }
  });

  // 默认排序
  return fileList.sort((a, b) => a.name.localeCompare(b.name));
}
