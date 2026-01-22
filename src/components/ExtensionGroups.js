'use client';

import { useState } from 'react';
import { FileText, Image as ImageIcon, ArrowUp, ArrowDown } from 'lucide-react';

const IMAGE_EXTS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];

export default function ExtensionGroups({ files }) {
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  const grouped = files.reduce((acc, file) => {
    const key = file.ext.toUpperCase();
    if (!acc[key]) acc[key] = [];
    acc[key].push(file);
    return acc;
  }, {});

  const sortedKeys = Object.keys(grouped).sort();

  const handleSort = (key) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortedFiles = (fileList) => {
    return [...fileList].sort((a, b) => {
      let valA = a[sortConfig.key];
      let valB = b[sortConfig.key];
      
      if (sortConfig.key === 'size') {
        valA = a.sizeRaw;
        valB = b.sizeRaw;
      }

      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const SortButton = ({ label, column }) => (
    <button 
      onClick={() => handleSort(column)} 
      className={`text-xs flex items-center gap-1 font-medium transition-colors ${sortConfig.key === column ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
    >
      {label}
      {sortConfig.key === column && (
        sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />
      )}
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <h2 className="font-bold text-gray-700 text-lg">Grouped by Extension</h2>
         <div className="flex items-center gap-4 bg-white px-3 py-1.5 rounded-md border border-gray-200 shadow-sm">
            <span className="text-xs text-gray-400 uppercase font-bold">Sort Groups By:</span>
            <SortButton label="Name" column="name" />
            <SortButton label="Size" column="size" />
            <SortButton label="Date" column="date" />
         </div>
      </div>
      
      {sortedKeys.map(ext => {
        const sortedGroupFiles = getSortedFiles(grouped[ext]);
        
        return (
          <section key={ext} className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-100 px-6 py-2 border-b border-gray-200 font-bold text-gray-600 text-sm flex justify-between items-center">
              <span>.{ext} FILES</span>
              <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs font-mono">
                {sortedGroupFiles.length} items
              </span>
            </div>
            <ul className="divide-y divide-gray-50">
              {sortedGroupFiles.map(file => {
                const isImage = IMAGE_EXTS.includes(file.ext);
                return (
                  <li key={file.id} className="px-6 py-3 hover:bg-gray-50 flex justify-between items-center text-sm group">
                    <div className="flex flex-col">
                      <a 
                        href={file.url} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-900 font-medium hover:text-blue-600 hover:underline flex items-center gap-2"
                      >
                         {isImage 
                          ? <ImageIcon size={16} className="text-purple-500" /> 
                          : <FileText size={16} className="text-gray-400" />
                        }
                        {file.name}
                      </a>
                      <span className="text-gray-400 text-xs mt-0.5 pl-6">Location: /{file.folder}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xs text-gray-500 font-mono">{file.sizeDisplay}</div>
                        {/* ✅ 关键修复：添加 suppressHydrationWarning */}
                        <div className="text-[10px] text-gray-400" suppressHydrationWarning>
                          {new Date(file.date).toLocaleString('zh-CN', { hour12: false })}
                        </div>
                      </div>
                       <a href={file.url} download className="text-gray-300 hover:text-blue-600 group-hover:text-blue-500">
                        ⬇
                      </a>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
