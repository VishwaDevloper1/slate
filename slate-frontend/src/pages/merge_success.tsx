import { CheckCircle, ArrowLeft, Files } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "../layouts/header";

export default function MergeSuccess() {
  const navigate = useNavigate();

  return (
    <>
      <Header />

      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-lg border border-slate-200 p-10">

          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle
                size={56}
                className="text-green-600"
              />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mt-6">
            <h1 className="text-4xl font-bold text-slate-900">
              PDFs Merged Successfully
            </h1>

            <p className="mt-4 text-lg text-slate-500">
              Your merged PDF has been generated and the download
              should start automatically.
            </p>
          </div>

          {/* Status Card */}
          <div className="mt-10 bg-slate-50 border border-slate-200 rounded-2xl p-6">

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-red-100 flex items-center justify-center">
                <Files
                  size={28}
                  className="text-red-600"
                />
              </div>

              <div>
                <h3 className="font-semibold text-slate-800">
                  Merge Completed
                </h3>

                <p className="text-sm text-slate-500">
                  Your PDF file is ready and has been processed successfully.
                </p>
              </div>
            </div>

          </div>

          {/* Actions */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4">

            <button
              onClick={() => navigate("/merge")}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-4 rounded-xl transition"
            >
              Merge Another PDF
            </button>

            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center gap-2 flex-1 border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold py-4 rounded-xl transition"
            >
              <ArrowLeft size={18} />
              Back to Home
            </button>

          </div>

          {/* Footer Note */}
          <p className="text-center text-xs text-slate-400 mt-8">
            Thank you for using Slate PDF Tools.
          </p>

        </div>
      </div>
    </>
  );
}