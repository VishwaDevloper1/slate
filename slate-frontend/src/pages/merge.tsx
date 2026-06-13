import { useState } from 'react';
import type { StagedFile } from '../types';
import Header from '../layouts/header';
import { Plus, X } from 'lucide-react';
import api from '../services/api';

export default function Merge() {
  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);
  const handleMerge = async () => {
    try {
  
      const formData = new FormData();
  
      stagedFiles.forEach((staged) => {
        formData.append(
          "files",
          staged.file
        );
      });
  
      const response =
        await api.post(
          "/merge",
          formData,
          {
            responseType: "blob",
          }
        );
  
      const blob = new Blob(
        [response.data],
        {
          type: "application/pdf",
        }
      );
  
      const url =
        window.URL.createObjectURL(blob);
  
      const link =
        document.createElement("a");
  
      link.href = url;
  
      link.download =
        "merged.pdf";
  
      document.body.appendChild(
        link
      );
  
      link.click();
  
      link.remove();
  
      window.URL.revokeObjectURL(
        url
      );
  
    } catch (error) {
  
      console.error(error);
  
      alert(
        "Failed to merge PDFs"
      );
    }
  };

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

      

          {/* Micro-interaction Drag Drop Note */}
          <p className="text-xs text-slate-400 mt-4 tracking-wide font-medium">
            or drop PDFs here
          </p>
        </div>
        </div>
      ): (
        /* Staging Queue List View (Triggers once files are picked) */
        <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-2xl p-6 shadow-md font-sans">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
  <h3 className="font-bold text-lg text-slate-800">
    Selected Files ({stagedFiles.length})
  </h3>

  <div className="flex items-center gap-3">
    <button
      onClick={handleTriggerFilePicker}
      className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition"
    >
      <Plus size={16} />
      Add PDF
    </button>

    <button
      onClick={() => setStagedFiles([])}
      className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors"
    >
      Clear All
    </button>
  </div>
</div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[40vh] overflow-y-auto pr-2">
            {stagedFiles.map((staged) => (
              <div
              key={staged.id}
              className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col justify-between relative group"
            >
              <button
                onClick={() =>
                  setStagedFiles(prev =>
                    prev.filter(
                      file => file.id !== staged.id
                    )
                  )
                }
                className="absolute top-2 right-2 text-slate-400 hover:text-red-500 transition"
              >
                <X size={16} />
              </button>
            
              <p className="text-sm font-semibold text-slate-700 truncate mb-1 pr-6">
                {staged.name}
              </p>
            
              <p className="text-xs text-slate-400 font-mono">
                {(staged.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            ))}
          </div>

          <button 
           onClick={handleMerge} className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-red-600/10 transition-colors">
            Merge PDFs
          </button>
        </div>
      )}
    </div>
    </>
  );
}