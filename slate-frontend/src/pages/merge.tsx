import { useState } from 'react';
import type { StagedFile } from '../types';
import Header from '../layouts/header';

export default function Merge() {
  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);

  const handleTriggerFilePicker = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = '.pdf';
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files) {
        const newFiles = Array.from(target.files).map((file) => ({
          id: crypto.randomUUID(),
          file: file,
          name: file.name,
          size: file.size,
          status: 'idle' as const,
          progress: 0,
        }));
        setStagedFiles((prev) => [...prev, ...newFiles]);
      }
    };
    input.click();
  };

  return (
    <>
     <Header/>
    <div className="h-full w-full bg-slate-50 text-slate-900 flex flex-col justify-center items-center px-4 relative">
      
      {/* Workspace Content Block */}
      {stagedFiles.length === 0 ? (
        <div className="flex flex-col items-center max-w-2xl w-full text-center animate-fadeIn">
          {/* Main Hero Header Title */}
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
            Merge PDF files
          </h2>
          
          {/* Subtext Paragraph */}
          <p className="text-lg md:text-xl text-slate-500 font-normal mb-8 max-w-xl leading-relaxed">
            Combine PDFs in the order you want with the easiest PDF merger available.
          </p>

          {/* Central Prominent Action Call Interface Group */}
          <div className="flex items-center gap-3 relative group">
            {/* Massive Call To Action Button */}
            <button
              onClick={handleTriggerFilePicker}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xl md:text-2xl px-12 py-5 rounded-2xl transition-all shadow-xl shadow-red-600/20 active:scale-[0.98] select-none tracking-wide"
            >
              Select PDF files
            </button>

            {/* Cloud Storage Auxiliary Badges (Google Drive / Dropbox Style) */}
            <div className="flex flex-col gap-2">
              <button className="bg-white hover:bg-slate-100 text-slate-700 p-2.5 rounded-full shadow-md border border-slate-200/60 transition-colors" title="Upload from Google Drive">
                <svg className="w-5 h-5 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.43 12.98l-6.73-11.66c-.37-.64-1.03-1.03-1.77-1.03h-1.86c-.74 0-1.4.39-1.77 1.03l-6.73 11.66c-.37.64-.37 1.42 0 2.06l1.86 3.22c.37.64 1.03 1.03 1.77 1.03h13.47c.74 0 1.4-.39 1.77-1.03l1.86-3.22c.37-.64.37-1.42 0-2.06zm-8.5-9.48h2.14l5.63 9.74h-2.14l-5.63-9.74z" />
                </svg>
              </button>
              <button className="bg-white hover:bg-slate-100 text-slate-700 p-2.5 rounded-full shadow-md border border-slate-200/60 transition-colors" title="Upload from Dropbox">
                <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5.014 5.25l6.986 4.307-6.986 4.308-5.014-3.415zm13.972 0l5.014 3.2l-5.014 3.415-6.986-4.308zm-13.972 8.615l6.986 4.307-6.986 4.308-5.014-3.415zm13.972 0l5.014 3.2-5.014 3.415-6.986-4.308zM12 18.423l6.986-4.307 5.014 3.2-12 7.684-12-7.684 5.014-3.2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Micro-interaction Drag Drop Note */}
          <p className="text-xs text-slate-400 mt-4 tracking-wide font-medium">
            or drop PDFs here
          </p>
        </div>
      ) : (
        /* Staging Queue List View (Triggers once files are picked) */
        <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-2xl p-6 shadow-md font-sans">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
            <h3 className="font-bold text-lg text-slate-800">Selected Files ({stagedFiles.length})</h3>
            <button 
              onClick={() => setStagedFiles([])} 
              className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors"
            >
              Clear All
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[40vh] overflow-y-auto pr-2">
            {stagedFiles.map((staged) => (
              <div key={staged.id} className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col justify-between relative group">
                <p className="text-sm font-semibold text-slate-700 truncate mb-1 pr-4">{staged.name}</p>
                <p className="text-xs text-slate-400 font-mono">{(staged.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            ))}
          </div>

          <button className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-red-600/10 transition-colors">
            Merge PDFs
          </button>
        </div>
      )}
    </div>
    </>
  );
}