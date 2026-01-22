'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Folder, FileText, Image as ImageIcon, Search, 
  ChevronRight, ArrowUp, ArrowDown, Home 
} from 'lucide-react';

const IMAGE_EXTS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];

export default function FileExplorer({ allFiles, currentSlug = [] }) {
  const currentPathStr = currentSlug.join('/');
  
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');

  const { displayItems, isSearching } = useMemo(() => {
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchedFiles = allFiles.filter(f => 
        f.name.toLowerCase().includes(term)
      );
      return { displayItems: matchedFiles, isSearching: true };
    }

    const currentLevelFolders = new Set();
    const currentLevelFiles = [];

    allFiles.forEach(file => {
      // 根目录处理优化
      const fileFolder = file.folder === 'Root' ? '' : file.folder;
      
      if (fileFolder === currentPathStr) {
        currentLevelFiles.push(file);
      } else if (fileFolder.startsWith(currentPathStr ? currentPathStr + '/' : '')) {
        const relative = fileFolder.substring(currentPathStr.length + (currentPathStr ? 1 : 0));
        const nextSegment = relative.split('/')[0];
        if (nextSegment) currentLevelFolders.add(nextSegment);
      }
    });

    const folderItems = Array.from(currentLevelFolders).map(name => ({ name, type: 'folder' }));
    return { displayItems: [...folderItems, ...currentLevelFiles], isSearching: false };
  }, [allFiles, currentPathStr, searchTerm]);

  const sortedItems = useMemo(() => {
    const sortFn = (a, b) => {
      let valA = a[sortConfig.key];
      let valB = b[sortConfig.key];

      if (sortConfig.key === 'size') {
        valA = a.type === 'folder' ? 0 : a.sizeRaw;
        valB = b.type === 'folder' ? 0 : b.sizeRaw;
      }
      
      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    };

    if (isSearching) {
      return [...displayItems].sort(sortFn);
    } else {
      const folders = displayItems.filter(i => i.type === 'folder').sort((a, b) => a.name.localeCompare(b.name));
      const files = displayItems.filter(i => i.type !== 'folder').sort(sortFn);
      return [...folders, ...files];
    }
  }, [displayItems, sortConfig, isSearching]);

  const handleSort = (key) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) return <div className="w-4" />;
    return sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
  };

  return (
    <div className="space-y-4">
      
      {/* 顶部导航栏 */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
        <nav className="flex flex-wrap items-center space-x-1 text-sm text-gray-500 px-2">
          {/* ✅ 修复：首页按钮，强制指向根路径 / */}
          <Link 
            href="/" 
            className="text-gray-600 hover:text-blue-600 hover:bg-gray-100 p-1.5 rounded-md transition-colors flex items-center"
            aria-label="Go to Home"
          >
            <Home size={18} />
          </Link>
          
          {currentSlug.length > 0 && <ChevronRight size={14} className="text-gray-300" />}

          {currentSlug.map((slug, index) => {
            const href = `/folder/${currentSlug.slice(0, index + 1).join('/')}`;
            const isLast = index === currentSlug.length - 1;
            return (
              <div key={href} className="flex items-center space-x-1">
                <Link 
                  href={href} 
                  className={`px-2 py-1 rounded-md transition-colors ${
                    isLast 
                      ? 'bg-gray-100 text-gray-900 font-bold pointer-events-none' 
                      : 'hover:bg-gray-100 hover:text-blue-600 text-gray-600'
                  }`}
                >
                  {slug}
                </Link>
                {!isLast && <ChevronRight size={14} className="text-gray-300" />}
              </div>
            );
          })}
        </nav>

        {/* 搜索框 */}
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* 文件列表 */}
      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-medium border-b border-gray-100 select-none">
            <tr>
              <th className="px-6 py-3 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-1">Name <SortIcon column="name"/></div>
              </th>
              <th className="px-6 py-3 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('date')}>
                <div className="flex items-center gap-1">Date Modified <SortIcon column="date"/></div>
              </th>
              <th className="px-6 py-3 text-right cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('size')}>
                <div className="flex items-center justify-end gap-1">Size <SortIcon column="size"/></div>
              </th>
              <th className="px-6 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {/* 上级目录按钮 */}
            {!isSearching && currentSlug.length > 0 && (
              <tr className="hover:bg-gray-50">
                <td colSpan="4" className="px-6 py-2">
                  <Link href={currentSlug.length === 1 ? '/' : `/folder/${currentSlug.slice(0, -1).join('/')}`} className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-medium w-full h-full">
                    <div className="w-6 text-center text-lg leading-none">..</div>
                    <span>Previous Directory</span>
                  </Link>
                </td>
              </tr>
            )}

            {sortedItems.map((item, idx) => {
              if (item.type === 'folder') {
                const folderPath = currentSlug.length > 0 
                  ? `/folder/${currentSlug.join('/')}/${item.name}`
                  : `/folder/${item.name}`;
                return (
                  <tr key={`folder-${idx}`} className="hover:bg-blue-50 transition-colors group">
                    <td className="px-6 py-3 font-medium text-gray-900">
                      <Link href={folderPath} className="flex items-center gap-2 hover:text-blue-600 w-full h-full block">
                        <Folder size={18} className="text-yellow-500 fill-yellow-500/20" />
                        {item.name}
                      </Link>
                    </td>
                    <td className="px-6 py-3 text-gray-400">-</td>
                    <td className="px-6 py-3 text-right text-gray-400">-</td>
                    <td className="px-6 py-3 text-right"></td>
                  </tr>
                );
              }

              const isImage = IMAGE_EXTS.includes(item.ext);
              return (
                <tr key={item.id} className="hover:bg-blue-50 transition-colors group">
                  <td className="px-6 py-3 font-medium text-gray-900">
                    <div className="flex items-center gap-2">
                       {isImage 
                        ? <ImageIcon size={18} className="text-purple-500" /> 
                        : <FileText size={18} className="text-gray-400" />
                      }
                      <a 
                        href={item.url} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-600 hover:underline flex items-center gap-1"
                      >
                        {item.name}
                        {isSearching && <span className="text-xs text-gray-400 font-normal ml-2">({item.folder})</span>}
                      </a>
                    </div>
                  </td>
                  {/* ✅ 关键修复：添加 suppressHydrationWarning */}
                  <td className="px-6 py-3 text-gray-500 text-xs" suppressHydrationWarning>
                    {new Date(item.date).toLocaleString('zh-CN', { hour12: false })}
                  </td>
                  <td className="px-6 py-3 text-right text-gray-400 font-mono text-xs">
                    {item.sizeDisplay}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <a 
                      href={item.url} 
                      download 
                      className="text-blue-600 hover:text-blue-800 font-bold text-xs border border-blue-200 px-3 py-1 rounded hover:bg-white hover:shadow-sm transition-all inline-block"
                    >
                      GET
                    </a>
                  </td>
                </tr>
              );
            })}

            {sortedItems.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-gray-400">
                  {isSearching ? `No files match "${searchTerm}"` : 'This folder is empty.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
