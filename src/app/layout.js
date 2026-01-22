import './globals.css';
import Link from 'next/link';

export const metadata = { title: 'Engineering File Index' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen font-mono text-sm text-gray-800">
        <nav className="bg-white border-b px-8 py-4 flex justify-between items-center shadow-sm">
          <div className="font-bold text-xl tracking-tight text-blue-900">File Index System</div>
          <div className="space-x-6">
            <Link href="/" className="hover:text-blue-600 transition-colors font-medium">Folder View</Link>
            <Link href="/extensions" className="hover:text-blue-600 transition-colors font-medium">Extension View</Link>
          </div>
        </nav>
        <main className="p-8 max-w-7xl mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
