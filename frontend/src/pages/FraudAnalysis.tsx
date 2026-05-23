import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle, 
  Sliders, 
  Database, 
  Binary, 
  Fingerprint, 
  AlignLeft,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FraudAnalysis: React.FC = () => {
  const { documents, activeDocId, setActiveDocId } = useApp();
  const [activeTab, setActiveTab] = useState<'ocr' | 'metadata' | 'cv' | 'signature' | 'nlp'>('cv');
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [hoveredBox, setHoveredBox] = useState<number | null>(null);

  const activeDoc = documents.find(doc => doc.id === activeDocId) || documents[0];

  const handleZoomIn = () => setZoomScale(prev => Math.min(prev + 0.15, 1.8));
  const handleZoomOut = () => setZoomScale(prev => Math.max(prev - 0.15, 0.6));
  const handleZoomReset = () => setZoomScale(1);

  if (!activeDoc) {
    return (
      <div className="p-8 text-center text-slate-500">
        Please upload or select a document first.
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* Selection row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/50 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Forensic Document Inspector</h1>
          <p className="text-xs text-slate-500">Analyze pixel modifications, structural alignment, OCR discrepancies, and metadata layers.</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-400 uppercase">Target Document:</label>
          <select
            value={activeDoc.id}
            onChange={(e) => setActiveDocId(e.target.value)}
            className="px-3.5 py-2 text-xs bg-white border border-slate-200/60 rounded-xl font-semibold text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
          >
            {documents.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.name} ({doc.riskLevel})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Side: Forensic Document Preview (col-span-7) */}
        <div className="xl:col-span-7 space-y-4">
          <div className="flex items-center justify-between bg-slate-100/80 border border-slate-200/60 px-4 py-2.5 rounded-2xl">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-indigo-500" />
              Forensic Overlay Lens
            </span>
            {/* Zoom controls */}
            <div className="flex items-center gap-1">
              <button 
                onClick={handleZoomOut}
                className="p-1.5 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:shadow-xs transition-all cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono font-bold text-slate-500 px-2">
                {Math.round(zoomScale * 100)}%
              </span>
              <button 
                onClick={handleZoomIn}
                className="p-1.5 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:shadow-xs transition-all cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={handleZoomReset}
                className="p-1.5 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:shadow-xs transition-all cursor-pointer ml-1"
                title="Reset View"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive viewport card */}
          <div className="relative rounded-3xl bg-slate-950 aspect-[4/5] border border-slate-800 overflow-hidden flex items-center justify-center p-8">
            {/* Document page simulated structure */}
            <div 
              className="relative w-full max-w-[420px] aspect-[1/1.414] bg-white border border-slate-200 rounded-xs shadow-2xl p-6 select-none origin-center transition-transform duration-150 overflow-hidden"
              style={{ transform: `scale(${zoomScale})` }}
            >
              {/* Scanline laser scrolling inside preview */}
              {activeDoc.cvAnalysis.tamperingDetected && (
                <div className="absolute inset-x-0 h-1.5 bg-linear-to-r from-red-500/0 via-red-500/30 to-red-500/0 animate-scan pointer-events-none" />
              )}

              {/* Dynamic Document Content Renderer based on type */}
              {activeDoc.id === 'doc-1' ? (
                // Invoice representation
                <div className="h-full flex flex-col justify-between text-slate-800 text-[9px] font-sans">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                      <div>
                        <h3 className="font-extrabold text-[12px] text-slate-900">Apex Tech Solutions</h3>
                        <p className="text-slate-400">Date: May 12, 2026</p>
                      </div>
                      <span className="font-extrabold text-slate-600">INVOICE NO: #90882</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between font-bold text-slate-400 uppercase text-[7px] border-b border-slate-100 pb-1">
                        <span>Description</span>
                        <div className="flex gap-8">
                          <span>Qty</span>
                          <span>Price</span>
                          <span>Total</span>
                        </div>
                      </div>
                      
                      {/* Clean Line 1 */}
                      <div className="flex justify-between py-1 border-b border-slate-50">
                        <span>1. Cloud Migration Consulting</span>
                        <div className="flex gap-9 text-slate-600">
                          <span>1</span>
                          <span>$45,000.00</span>
                          <span>$45,000.00</span>
                        </div>
                      </div>

                      {/* Flagged Line 2 */}
                      <div className="flex justify-between py-1 border-b border-slate-50 relative">
                        <span>2. Vertex AI API Nodes Deployment</span>
                        <div className="flex gap-9 text-slate-600">
                          <span>1</span>
                          <span>$15,000.00</span>
                          <span className="font-semibold text-slate-900">$75,000.00</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-slate-100 pt-3">
                    <div className="flex justify-between font-bold text-slate-500">
                      <span>Subtotal:</span>
                      <span>$120,000.00</span>
                    </div>
                    <div className="flex justify-between font-bold text-slate-500">
                      <span>Tax (8%):</span>
                      <span>$9,600.00</span>
                    </div>
                    <div className="flex justify-between font-extrabold text-slate-900 border-t border-double border-slate-200 pt-1.5 text-[10px]">
                      <span>Total Due:</span>
                      <span>$129,600.00</span>
                    </div>
                  </div>

                  {/* Signature block */}
                  <div className="flex justify-between items-end pt-4 mt-auto">
                    <div>
                      <p className="text-slate-400">Payment Routing: 021000021</p>
                      <p className="text-slate-400">Account No: *******8821</p>
                    </div>
                    <div className="text-center">
                      {/* Fake Signature image representation */}
                      <div className="font-serif italic text-indigo-600 border-b border-slate-300 pb-1 text-[11px] select-none transform -rotate-3 tracking-wide">
                        Marcus Vance
                      </div>
                      <span className="text-[7px] text-slate-400">Authorized Signature</span>
                    </div>
                  </div>
                </div>
              ) : activeDoc.id === 'doc-2' ? (
                // Passport scan representation
                <div className="h-full flex flex-col justify-between text-slate-800 text-[8px] font-sans">
                  <div className="p-2 border border-slate-200 rounded-sm bg-slate-50/50 flex gap-4 items-center">
                    {/* Passport Portrait frame */}
                    <div className="w-20 aspect-[3/4] bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-400 relative overflow-hidden">
                      <div className="w-12 h-12 rounded-full bg-slate-400/40 mt-2" />
                      <div className="w-16 h-8 rounded-t-full bg-slate-400/50 mt-auto" />
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <div className="font-bold text-[9px] text-slate-900 border-b border-slate-200 pb-1">PASSPORT ID DATA</div>
                      <p><span className="text-slate-400">Surname:</span> DOE</p>
                      <p><span className="text-slate-400">Given Names:</span> JOHN ALBERT</p>
                      <p><span className="text-slate-400">Nationality:</span> USA</p>
                      <p><span className="text-slate-400">DOB:</span> 14 APR 1985</p>
                      <p><span className="text-slate-400">Expiry:</span> 09 OCT 2031</p>
                    </div>
                  </div>
                  
                  {/* MRZ Zone */}
                  <div className="p-2 bg-slate-100 border border-slate-200 font-mono text-[8px] tracking-widest text-slate-600 leading-normal mt-auto whitespace-pre">
                    P&lt;USADOE&lt;&lt;JOHN&lt;ALBERT&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;<br />
                    9912003824USA8504141M3110091&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;02
                  </div>
                </div>
              ) : (
                // Clean Employment Contract representation
                <div className="h-full flex flex-col justify-between text-slate-800 text-[9px] font-sans">
                  <div className="space-y-4">
                    <h3 className="font-extrabold text-[12px] text-slate-900 text-center border-b border-slate-100 pb-3">EMPLOYMENT AGREEMENT</h3>
                    <p className="leading-relaxed text-slate-600">
                      This Employment Contract is executed between FutureTech Labs Inc. and Sarah Jenkins. Under the terms of this agreement, Sarah Jenkins will serve as Senior Machine Learning Engineer starting June 1, 2026.
                    </p>
                    <p className="leading-relaxed text-slate-600">
                      Compensation is structured at $145,000 per annum, paid bi-weekly, subject to standard withholdings.
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-end pt-8 mt-auto">
                    <div className="text-center">
                      <div className="font-serif italic text-indigo-500 border-b border-slate-200 pb-0.5 text-[10px] transform -rotate-2 select-none">
                        Sarah Jenkins
                      </div>
                      <span className="text-[7px] text-slate-400">Employee Signature</span>
                    </div>
                    <div className="text-center">
                      <div className="font-serif italic text-slate-500 border-b border-slate-200 pb-0.5 text-[10px] transform -rotate-1 select-none">
                        David Vance
                      </div>
                      <span className="text-[7px] text-slate-400">HR Director Signature</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Bounding Box Absolute Overlays on Document */}
              {activeDoc.cvAnalysis.suspiciousRegions.map((box) => {
                const isHovered = hoveredBox === box.id;
                
                // Convert relative document bbox ratios into inline styles
                // In our mock data: bbox: [left, top, width, height] in pixel dimensions based on 420x594 layout.
                const style = {
                  left: `${(box.bbox[0] / 420) * 100}%`,
                  top: `${(box.bbox[1] / 594) * 100}%`,
                  width: `${(box.bbox[2] / 420) * 100}%`,
                  height: `${(box.bbox[3] / 594) * 100}%`
                };

                return (
                  <div
                    key={box.id}
                    className={`absolute border border-dashed hover:border-solid hover:bg-red-500/10 cursor-help transition-all ${
                      isHovered ? 'border-red-600 bg-red-500/15 z-30 scale-102' : 'border-red-400 bg-red-500/5 z-20'
                    }`}
                    style={style}
                    onMouseEnter={() => setHoveredBox(box.id)}
                    onMouseLeave={() => setHoveredBox(null)}
                  >
                    {/* Bounding Box Badge */}
                    <span className="absolute -top-4 left-0 text-[6px] font-black uppercase text-white bg-red-600 px-1 border border-red-500 py-0.2 tracking-wider">
                      {box.label}
                    </span>
                    
                    {/* Hover detail tooltip */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-slate-900 text-white rounded-lg shadow-xl text-[8px] leading-snug w-48 text-center z-45"
                        >
                          <p className="font-bold text-red-400 mb-0.5">{box.label} ({box.confidence}%)</p>
                          <p>{box.description}</p>
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-x-4 border-x-transparent border-t-4 border-t-slate-900" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: AI Forensic Reports (col-span-5) */}
        <div className="xl:col-span-5 space-y-6">
          {/* Risk Level KPI Banner */}
          <div className={`p-4 rounded-3xl border flex items-center justify-between ${
            activeDoc.riskLevel === 'High' 
              ? 'bg-red-50/50 border-red-200/60 text-red-900' 
              : activeDoc.riskLevel === 'Medium'
              ? 'bg-amber-50/50 border-amber-200/60 text-amber-900'
              : 'bg-emerald-50/50 border-emerald-200/60 text-emerald-900'
          } shadow-sm`}>
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Risk Assessment</span>
              <div className="flex items-center gap-2">
                {activeDoc.riskLevel === 'High' ? (
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                )}
                <h3 className="font-extrabold text-sm uppercase">{activeDoc.riskLevel} Risk Severity</h3>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black">{activeDoc.fraudScore}%</div>
              <span className="text-[10px] font-semibold text-slate-400">Tamper Probability</span>
            </div>
          </div>

          {/* Tampering Category Badges */}
          {activeDoc.tamperingCategories.length > 0 && (
            <div className="p-3.5 bg-white border border-slate-200/60 rounded-2xl shadow-xs space-y-2">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Identified Anomaly Categories</h4>
              <div className="flex flex-wrap gap-2">
                {activeDoc.tamperingCategories.map((cat, idx) => (
                  <span key={idx} className="text-[10px] font-bold text-red-600 bg-red-50 px-2.5 py-0.8 rounded-full border border-red-100">
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Analysis Tabs Section */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/60 shadow-xs space-y-4 flex flex-col h-[400px]">
            {/* Tab header buttons */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex gap-1.5 overflow-x-auto scrollbar-thin w-full pb-1">
                {[
                  { id: 'cv', label: 'CV Forensics', icon: Sliders },
                  { id: 'ocr', label: 'OCR Content', icon: Binary },
                  { id: 'signature', label: 'Signature', icon: Fingerprint },
                  { id: 'nlp', label: 'NLP Math', icon: AlignLeft },
                  { id: 'metadata', label: 'Metadata', icon: Database }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <tab.icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content Area */}
            <div className="flex-1 overflow-y-auto scrollbar-thin text-xs text-slate-600">
              
              {/* Tab 1: CV Forensic Details */}
              {activeTab === 'cv' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-700">Computer Vision Forensics</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      activeDoc.cvAnalysis.tamperingDetected ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      {activeDoc.cvAnalysis.tamperingDetected ? 'Anomaly Flagged' : 'Clean Scan'}
                    </span>
                  </div>

                  {activeDoc.cvAnalysis.suspiciousRegions.length === 0 ? (
                    <div className="p-8 text-center text-slate-400">
                      No structural font variances or JPEG editing artifacts detected.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {activeDoc.cvAnalysis.suspiciousRegions.map((region) => (
                        <div key={region.id} className="p-3 rounded-xl border border-red-100 bg-red-50/10 space-y-1">
                          <div className="flex justify-between font-bold text-slate-800 text-[11px]">
                            <span className="text-red-700">{region.label}</span>
                            <span className="text-slate-400">Conf: {region.confidence}%</span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-normal">{region.description}</p>
                        </div>
                      ))}

                      {activeDoc.cvAnalysis.fontInconsistencies.length > 0 && (
                        <div className="space-y-1.5">
                          <h5 className="font-bold text-slate-700 text-[10px] uppercase tracking-wider">Font Override Traces</h5>
                          <ul className="space-y-1">
                            {activeDoc.cvAnalysis.fontInconsistencies.map((font, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-slate-500">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                                <span>{font}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: OCR Extract Text */}
              {activeTab === 'ocr' && (
                <div className="space-y-3 h-full flex flex-col">
                  <div className="flex justify-between items-center bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-700">OCR Character Mapping</span>
                    <span className="text-[10px] font-bold text-slate-400">Vertex OCR v2</span>
                  </div>
                  
                  <div className="flex-1 p-3 bg-slate-950 text-slate-300 font-mono text-[10px] rounded-xl overflow-y-auto leading-relaxed max-h-[220px]">
                    {activeDoc.ocrText ? (
                      <pre className="whitespace-pre-wrap">{activeDoc.ocrText}</pre>
                    ) : (
                      <span className="text-slate-500">Extracting text...</span>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 3: Signature Curves Matching */}
              {activeTab === 'signature' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-700">Signature Authenticator</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      activeDoc.signatureAnalysis.anomalyDetected ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      {activeDoc.signatureAnalysis.matchScore}% Match
                    </span>
                  </div>

                  {activeDoc.signatureAnalysis.detected ? (
                    <div className="space-y-4">
                      {/* Side by side vector matching chart visualization */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                          <span className="text-[9px] font-bold text-slate-400 uppercase">Extracted Signature</span>
                          <div className="h-16 flex items-center justify-center font-serif italic text-slate-800 text-[16px] font-light border border-dashed border-slate-200 bg-white mt-1.5 select-none transform rotate-1">
                            {activeDoc.id === 'doc-1' ? 'Marcus Vance' : activeDoc.id === 'doc-2' ? 'J. Doe' : 'Sarah Jenkins'}
                          </div>
                        </div>
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                          <span className="text-[9px] font-bold text-slate-400 uppercase">Database Reference</span>
                          <div className="h-16 flex items-center justify-center font-serif italic text-slate-400 text-[16px] font-light border border-dashed border-slate-200 bg-white mt-1.5 select-none">
                            {activeDoc.id === 'doc-1' ? 'Marcus Vance' : activeDoc.id === 'doc-2' ? 'John A. Doe' : 'Sarah Jenkins'}
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                        <h5 className="font-bold text-[10px] text-slate-700 uppercase tracking-wider">Forensic Match Assessment</h5>
                        <p className="text-[11px] text-slate-500 leading-normal">
                          {activeDoc.signatureAnalysis.details}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-slate-400">
                      No signature blocks detected in this document format.
                    </div>
                  )}
                </div>
              )}

              {/* Tab 4: NLP Calculation Verifiers */}
              {activeTab === 'nlp' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-700">NLP Semantic Parser</span>
                    <span className="text-[10px] font-bold text-slate-400">Confidence: {activeDoc.nlpReasoning.riskScore}%</span>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                      <h5 className="font-bold text-[10px] text-slate-700 uppercase tracking-wider mb-1">Semantic Inconsistencies</h5>
                      {activeDoc.nlpReasoning.inconsistencies.length === 0 ? (
                        <p className="text-emerald-600 font-semibold flex items-center gap-1 text-[11px]">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                          Zero text arithmetic inconsistencies detected.
                        </p>
                      ) : (
                        <ul className="space-y-1">
                          {activeDoc.nlpReasoning.inconsistencies.map((inc, i) => (
                            <li key={i} className="text-red-700 font-semibold flex items-start gap-1 text-[11px] leading-tight">
                              <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                              <span>{inc}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                      <h5 className="font-bold text-[10px] text-slate-700 uppercase tracking-wider">Itemization Evaluation</h5>
                      <p className="text-[11px] text-slate-500 leading-normal">
                        {activeDoc.nlpReasoning.summary}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 5: Metadata EXIF Headers */}
              {activeTab === 'metadata' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-700">EXIF Binary Metadata</span>
                    <span className="text-[10px] font-bold text-slate-400">File Header Parser</span>
                  </div>

                  <table className="w-full text-left text-[11px]">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400">
                        <th className="pb-1.5 font-bold uppercase text-[9px]">Property</th>
                        <th className="pb-1.5 font-bold uppercase text-[9px]">Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {Object.entries(activeDoc.metadata).map(([key, value]) => (
                        <tr key={key}>
                          <td className="py-2 font-bold text-slate-600">{key}</td>
                          <td className={`py-2 font-mono text-[10px] break-all ${
                            value.includes('Altered') || value.includes('GIMP') ? 'text-red-600 font-bold' : 'text-slate-500'
                          }`}>{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FraudAnalysis;
