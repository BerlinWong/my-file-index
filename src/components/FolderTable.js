'use client';

import { useState, useEffect } from 'react';
import { X, Download, FileText, Image as ImageIcon } from 'lucide-react';

const IMAGE_EXTS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico'];

export default function FolderTable({ files }) {
  const [previewFile, setPreviewFile] = useState(null);

  // 键盘 ESC 关闭监听
  useEffect(() => {
    const handleEsc = (e) => e.key === 'Escape' && setPreviewFile(null);
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleFileClick = (e, file) => {
    if (IMAGE_EXTS.includes(file.ext)) {
      e.preventDefault();
      setPreviewFile(file);
    }
  };

  return (
    <>
      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h2 className="font-bold text-gray-700">All Files (Folder View)</h2>
          <span className="text-xs text-gray-400 bg-white border px-2 py-1 rounded">Total: {files.length}</span>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-medium border-b border-gray-100">
            <tr>
              <th className="px-6 py-3">Filename</th>
              <th className="px-6 py-3">Location</th>
              <th className="px-6 py-3 text-right">Size</th>
              <th className="px-6 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {files.map((file) => {
              const isImage = IMAGE_EXTS.includes(file.ext);
              return (
                <tr key={file.id} className="hover:bg-blue-50 transition-colors group">
                  <td className="px-6 py-3 font-medium text-gray-900">
                    <a 
                      href={file.url} 
                      onClick={(e) => handleFileClick(e, file)}
                      className="flex items-center gap-2 hover:text-blue-600 cursor-pointer"
                    >
                      {isImage ? <ImageIcon size={16} className="text-blue-500"/> : <FileText size={16} className="text-gray-400"/>}
                      {file.name}
                    </a>
                  </td>
                  <td className="px-6 py-3 text-gray-500 font-light">/{file.folder}</td>
                  <td className="px-6 py-3 text-right text-gray-400 font-mono text-xs">{file.size}</td>
                  <td className="px-6 py-3 text-right">
                    <a 
                      href={file.url} 
                      download 
                      className="text-blue-600 hover:text-blue-800 font-bold text-xs border border-blue-200 px-3 py-1 rounded hover:bg-white hover:shadow-sm transition-all inline-block"
                    >
                      GET
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Image Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setPreviewFile(null)}>
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img 
              src={previewFile.url} 
              alt={previewFile.name} 
              className="max-h-[80vh] w-auto object-contain rounded-md shadow-2xl bg-white"
            />
            <div className="mt-4 flex gap-4 items-center bg-white/10 px-6 py-3 rounded-full backdrop-blur-md border border-white/20">
              <span className="text-white font-medium">{previewFile.name}</span>
              <div className="h-4 w-px bg-white/30"></div>
              <a 
                href={previewFile.url} 
                download 
                className="text-white hover:text-blue-300 flex items-center gap-1 transition-colors"
              >
                <Download size={18} /> Download
              </a>
              <button onClick={() => setPreviewFile(null)} className="text-white hover:text-red-300 ml-2">
                <X size={24} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
