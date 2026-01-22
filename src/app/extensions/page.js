import { getAllFiles } from '../../lib/file-scanner';
import ExtensionGroups from '../../components/ExtensionGroups';

export default function Page() {
  const files = getAllFiles();
  return <ExtensionGroups files={files} />;
}
