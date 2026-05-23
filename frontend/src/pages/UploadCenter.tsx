import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Loader2, 
  FileWarning, 
  Trash2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UploadCenter: React.FC = () => {
  const { documents, uploadDocument, deleteDocument, setActiveDocId } = useApp();
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateAndUpload = (file: File) => {
    const validExtensions = ['pdf', 'png', 'jpg', 'jpeg', 'tiff', 'tif'];
    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
    
    if (!validExtensions.includes(fileExt)) {
      setUploadError(`Unsupported file format (.${fileExt}). Please upload PDF, PNG, JPG, or TIFF.`);
      return;
    }
    
    if (file.size > 15 * 1024 * 1024) {
      setUploadError('File is too large. Max size is 15MB.');
      return;
    }

    setUploadError(null);
    uploadDocument(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndUpload(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Mock document injection buttons
  const uploadMockFraudInvoice = () => {
    const file = new File([''], 'invoice_tampered_vertex_test.pdf', { type: 'application/pdf' });
    uploadDocument(file);
  };

  const uploadMockCleanContract = () => {
    const file = new File([''], 'clean_employment_contract.pdf', { type: 'application/pdf' });
    uploadDocument(file);
  };

  const uploadMockFraudPassport = () => {
    const file = new File([''], 'passport_scan_tampered_v2.png', { type: 'image/png' });
    uploadDocument(file);
  };

  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Advanced Forensic Ingestion</h1>
        <p className="text-xs text-slate-500">Securely ingest underwriting documentation, contract records, and official ID scans for verification.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Action Zone */}
        <div className="lg:col-span-2 space-y-6">
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`relative rounded-3xl border-2 border-dashed p-10 flex flex-col items-center justify-center min-h-[300px] transition-all overflow-hidden cursor-pointer ${
              dragActive 
                ? 'border-indigo-600 bg-indigo-50/20' 
                : 'border-slate-200 hover:border-slate-300 bg-white/70 backdrop-blur-md shadow-xs'
            }`}
            onClick={triggerFileInput}
          >
            {/* Animated Scanning Laser Bar when file drag is active */}
            {dragActive && (
              <div className="absolute inset-x-0 h-1 bg-linear-to-r from-indigo-500/0 via-indigo-600 to-indigo-500/0 animate-scan" style={{ top: '20%' }} />
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.png,.jpg,.jpeg,.tiff,.tif"
            />

            <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600 mb-4">
              <Upload className="w-8 h-8" />
            </div>

            <h3 className="font-extrabold text-sm text-slate-800 text-center">
              Drag & Drop files here, or <span className="text-indigo-600 hover:underline">browse files</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-2 text-center max-w-sm">
              Supports PDF, PNG, JPG, and TIFF up to 15MB. Files are analyzed automatically using Vertex AI agents.
            </p>

            {uploadError && (
              <div className="mt-4 flex items-center gap-2 p-2.5 bg-red-50 border border-red-100 text-red-700 text-xs font-semibold rounded-xl">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                {uploadError}
              </div>
            )}
          </div>

          {/* Quick Mock Forgery Simulators for presentation */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-250/60 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-slate-700" />
              <h3 className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">Demo Payload Simulator</h3>
            </div>
            <p className="text-[10px] text-slate-500">
              Instantly test multi-agent forensic scanning using pre-compiled payload files.
            </p>
            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={uploadMockFraudInvoice}
                className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-700 rounded-lg transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <FileWarning className="w-3.5 h-3.5 text-red-500" />
                Simulate Tampered Invoice PDF
              </button>
              <button
                onClick={uploadMockFraudPassport}
                className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-700 rounded-lg transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <FileWarning className="w-3.5 h-3.5 text-red-500" />
                Simulate Altered Passport PNG
              </button>
              <button
                onClick={uploadMockCleanContract}
                className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-700 rounded-lg transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                Simulate Clean Contract PDF
              </button>
            </div>
          </div>
        </div>

        {/* Upload Queue / Files Listing */}
        <div className="p-5 rounded-xl bg-white border border-slate-200/50 shadow-xs flex flex-col max-h-[500px]">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Ingested Document Stream</h3>
          
          <div className="flex-1 overflow-y-auto space-y-3.5 scrollbar-thin">
            {documents.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 p-6 text-center">
                <FileText className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-xs">No documents uploaded yet.</p>
              </div>
            ) : (
              documents.map((doc) => (
                <div 
                  key={doc.id}
                  className="group relative p-3.5 rounded-2xl border border-slate-200/60 bg-white shadow-xs hover:border-indigo-400 transition-all flex flex-col gap-3.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-2 rounded-xl bg-slate-100 text-slate-600 shrink-0">
                        <FileText className="w-4.5 h-4.5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-800 truncate" title={doc.name}>
                          {doc.name}
                        </h4>
                        <span className="text-[10px] text-slate-400">{doc.size} • {doc.type}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteDocument(doc.id);
                      }}
                      className="p-1 text-slate-300 hover:text-red-500 rounded-md transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Status, stages, progress loaders */}
                  {doc.status === 'Completed' ? (
                    <div className="flex items-center justify-between border-t border-slate-100 pt-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          doc.riskLevel === 'High' ? 'bg-red-50 text-red-600' :
                          doc.riskLevel === 'Medium' ? 'bg-amber-50 text-amber-600' :
                          'bg-emerald-50 text-emerald-600'
                        }`}>
                          {doc.riskLevel} Risk
                        </span>
                        {doc.fraudScore > 0 && (
                          <span className="text-[10px] font-mono font-bold text-slate-500">
                            Score: {doc.fraudScore}%
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          setActiveDocId(doc.id);
                          navigate('/analysis');
                        }}
                        className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5 cursor-pointer"
                      >
                        Inspect
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1.5 border-t border-slate-100 pt-2.5">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="flex items-center gap-1 text-slate-500 font-semibold">
                          <Loader2 className="w-3.5 h-3.5 text-indigo-500 animate-spin" />
                          Agent: {doc.stage.toUpperCase()} Analyzer
                        </span>
                        <span className="font-mono font-bold text-indigo-600">{doc.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                          style={{ width: `${doc.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadCenter;
