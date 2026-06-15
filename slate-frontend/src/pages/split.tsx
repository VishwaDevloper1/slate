
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc =
  new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();
import { useState } from "react";
import Header from "../layouts/header";
import {
    Document,
    Page,
  } from "react-pdf";
  
  import "react-pdf/dist/Page/TextLayer.css";
  import "react-pdf/dist/Page/AnnotationLayer.css";
  console.log("PDFJS Version:", pdfjs.version);
  console.log("Worker:", pdfjs.GlobalWorkerOptions.workerSrc);
export default function Split(){  

const [previewStart, setPreviewStart] = useState(1);
const PREVIEW_LIMIT = 12;
const [numPages, setNumPages] =
  useState<number>(0);

const [startPage, setStartPage] =
  useState(1);

const [endPage, setEndPage] =
  useState(1);

const [totalPages, setTotalPages] =
  useState(10);

const handleSplit = async () => {
    console.log("Split clicked");
  };
  
const [pdfFile, setPdfFile] =
  useState<File | null>(null);

  return (
    <>
    <Header/>
      {!pdfFile ? (
  
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4">
  
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            Split PDF File
          </h1>
  
          <p className="text-xl text-slate-500 text-center max-w-2xl mb-8">
            Separate one page or a whole set for easy conversion into independent PDF files.
          </p>
  
          <button
            onClick={() => {
              const input =
                document.createElement("input");
  
              input.type = "file";
              input.accept = ".pdf";
  
              input.onchange = (e) => {
  
                const target =
                  e.target as HTMLInputElement;
  
                if (
                  target.files &&
                  target.files[0]
                ) {
  
                  setPdfFile(
                    target.files[0]
                  );
  
                }
              };
  
              input.click();
            }}
            className="bg-red-600 hover:bg-red-700 text-white text-2xl font-semibold px-12 py-5 rounded-2xl shadow-xl"
          >
            Select PDF File
          </button>
  
          <p className="mt-4 text-slate-400">
            or drop PDF here
          </p>
  
        </div>
  
      ) : (
  
        // YAHAN TERA CURRENT LEFT-RIGHT SPLIT UI AA JAYEGA
  
        <div className="w-full max-w-7xl mx-auto flex gap-6 mt-8 px-4">

  {/* LEFT SIDEBAR */}
  <div className="w-[320px] shrink-0 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">

    <h2 className="text-2xl font-bold text-slate-900 mb-6">
      Split PDF
    </h2>

    <div className="space-y-3 mb-6">

      <button
        className="w-full text-left px-4 py-3 rounded-xl bg-red-50 border border-red-500 text-red-600 font-semibold"
      >
        Split by Range
      </button>

      <button
        className="w-full text-left px-4 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
      >
        Extract Pages
      </button>

    </div>

    <div className="border-t border-slate-200 pt-6">

      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Start Page
        </label>

        <input
          type="number"
          min="1"
          value={startPage}
          onChange={(e) =>
            setStartPage(
              Number(e.target.value)
            )
          }
          className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-200"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          End Page
        </label>

        <input
          type="number"
          min="1"
          value={endPage}
          onChange={(e) =>
            setEndPage(
              Number(e.target.value)
            )
          }
          className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-200"
        />
      </div>

    </div>

    <button
      onClick={handleSplit}
      className="w-full mt-8 bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-semibold transition"
    >
      Split PDF
    </button>

  </div>

  {/* RIGHT PREVIEW AREA */}
  <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">

    <div className="flex justify-between items-center border-b border-slate-200 pb-4 mb-6">

      <div>
        <h3 className="text-xl font-bold text-slate-900">
          PDF Preview
        </h3>

        <p className="text-sm text-slate-500 mt-1">
          {pdfFile?.name}
        </p>
      </div>

      <button
        onClick={() =>
          setPdfFile(null)
        }
        className="text-red-500 hover:text-red-600 font-medium"
      >
        Change PDF
      </button>

    </div>

    {/* TEMP PREVIEW */}
    <Document
  file={pdfFile}
  onLoadSuccess={({ numPages }) => {

    setNumPages(numPages);
  
    setStartPage(1);
  
    setEndPage(
      Math.min(
        numPages,
        10
      )
    );
  }}
  onLoadError={(error) => {
    console.error("PDF ERROR:", error);
  }}
>
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
  {Array.from(
  {
    length: Math.min(
      PREVIEW_LIMIT,
      numPages - startPage + 1
    ),
  },
  (_, index) => (
        <div
          key={index}
          className="border border-slate-200 rounded-xl p-2 bg-white"
        >
          <Page
            pageNumber={
            startPage + index
            }
            width={180}
          />

          <p className="text-center text-sm mt-2">
          Page {startPage + index}
          </p>
        </div>
      )
    )}
   
  </div>
  <div className="flex justify-center gap-4 mt-6">

<button
  disabled={previewStart === 1}
  onClick={() =>
    setPreviewStart(
      Math.max(
        1,
        previewStart - PREVIEW_LIMIT
      )
    )
  }
  className="px-4 py-2 border rounded-lg"
>
  Previous
</button>

<span className="flex items-center text-sm text-slate-500">
  {previewStart} -
  {Math.min(
    previewStart +
      PREVIEW_LIMIT -
      1,
    numPages
  )}
  {" "}of {numPages}
</span>

<button
  disabled={
    previewStart + PREVIEW_LIMIT >
    numPages
  }
  onClick={() =>
    setPreviewStart(
      previewStart + PREVIEW_LIMIT
    )
  }
  className="px-4 py-2 border rounded-lg"
>
  Next
</button>

</div>
</Document>

  </div>

</div>
  
      )}
    </>
  );
    }