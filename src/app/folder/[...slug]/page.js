import { getAllFiles } from '../../../lib/file-scanner';
import FileExplorer from '../../../components/FileExplorer';

export async function generateStaticParams() {
  const files = getAllFiles();
  const paths = new Set();

  files.forEach(file => {
    if (file.folder && file.folder !== '.') {
      const parts = file.folder.split('/');
      let accum = [];
      parts.forEach(part => {
        accum.push(part);
        paths.add(accum.join('/'));
      });
    }
  });

  return Array.from(paths).map(path => ({
    slug: path.split('/')
  }));
}

// ✅ 关键修复：添加 async 关键字
export default async function FolderPage({ params }) {
  // ✅ 关键修复：await params
  const resolvedParams = await params;
  const files = getAllFiles();
  return <FileExplorer allFiles={files} currentSlug={resolvedParams.slug} />;
}
