import { getAllFiles } from '../lib/file-scanner';
import FileExplorer from '../components/FileExplorer';

export default function HomePage() {
  const files = getAllFiles();
  // 根目录没有 slug
  return <FileExplorer allFiles={files} currentSlug={[]} />;
}
