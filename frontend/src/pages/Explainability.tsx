import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  Send, 
  ChevronDown, 
  ChevronUp, 
  AlertTriangle, 
  Network,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatMessage {
  sender: 'user' | 'gemini';
  text: string;
  timestamp: string;
}

const Explainability: React.FC = () => {
  const { documents, activeDocId, setActiveDocId } = useApp();
  const activeDoc = documents.find(doc => doc.id === activeDocId) || documents[0];

  const [expandedCard, setExpandedCard] = useState<string | null>('photos');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Initialize chat when active doc changes
  useEffect(() => {
    if (!activeDoc) return;
    
    const initialText = activeDoc.riskLevel === 'High'
      ? `Hello. I am the Gemini-Forensics Agent. I have audited "${activeDoc.name}" and calculated a fraud risk index of ${activeDoc.fraudScore}%. I detected ${activeDoc.tamperingCategories.length} categories of tampering. Let me know if you would like me to explain the evidence tree, mathematical calculation errors, or signature profiles.`
      : `Hello. I am the Gemini-Forensics Agent. I have audited "${activeDoc.name}" and cleared it with a low risk index of ${activeDoc.fraudScore}%. All structural and metadata checks passed validation. Ask me any details regarding the EXIF parameters or signature curves.`;

    setChatMessages([
      { sender: 'gemini', text: initialText, timestamp: new Date().toLocaleTimeString() }
    ]);
  }, [activeDocId]);

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setChatMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate Gemini Response logic
    setTimeout(() => {
      let geminiReply = '';
      const prompt = textToSend.toLowerCase();

      if (prompt.includes('why') || prompt.includes('reason') || prompt.includes('flagged')) {
        geminiReply = activeDoc.riskLevel === 'High'
          ? `Document "${activeDoc.name}" was flagged High Risk because:\n1. Metadata alterations match typical document forged profiles (saved via software tags: GIMP/Photoshop).\n2. Typographic inconsistencies in values highlight edited pricing pixels.\n3. Semantic calculations do not correlate (Line values do not multiply/add correctly).`
          : `Document "${activeDoc.name}" passed all integrity checks. The EXIF headers match standard export layouts, and signature biometric matching scored high similarity.`;
      } else if (prompt.includes('metadata') || prompt.includes('exif')) {
        geminiReply = `Forensic EXIF report: The document metadata shows creation by "${activeDoc.metadata['Creator'] || 'standard suite'}". ${
          activeDoc.id === 'doc-1' ? 'However, we detected a modified timestamp tag altered moments prior to ingestion, indicating potential field updates outside the original file cycle.' : 'All timestamps match the creation cycle correctly.'
        }`;
      } else if (prompt.includes('signature')) {
        geminiReply = activeDoc.signatureAnalysis.detected
          ? `Signature Evaluation: Target signee is ${activeDoc.signatureAnalysis.referenceName}. Biophysical matching results: Match Score is ${activeDoc.signatureAnalysis.matchScore}%. ${
              activeDoc.signatureAnalysis.anomalyDetected ? 'Warning: Micro-vibrations indicate autopen stroke patterns.' : 'Curve velocities indicate natural handwriting.'
            }`
          : 'No handwriting signature block was found or needed for this document schema.';
      } else if (prompt.includes('math') || prompt.includes('calc') || prompt.includes('inconsistency')) {
        geminiReply = activeDoc.nlpReasoning.inconsistencies.length > 0
          ? `Mathematical mismatch breakdown: ${activeDoc.nlpReasoning.summary}`
          : 'I performed a semantic math parse on all item columns. Multiplication validation matches standard totals exactly.';
      } else {
        geminiReply = `I have logged the query. Under the Vertex AI context for "${activeDoc.name}", I can confirm the calculated risk is ${activeDoc.riskLevel} with a final score of ${activeDoc.fraudScore}/100. Let me know if you would like me to unpack specific OCR elements or forensic bounding boxes.`;
      }

      setChatMessages(prev => [...prev, {
        sender: 'gemini',
        text: geminiReply,
        timestamp: new Date().toLocaleTimeString()
      }]);
      setIsTyping(false);
    }, 1200);
  };

  const presetQuestions = [
    'Why was this document flagged?',
    'What metadata anomalies did you find?',
    'Explain the mathematical calculations.',
    'Describe the signature matching biometrics.'
  ];

  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/50 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">AI Explainability Center</h1>
          <p className="text-xs text-slate-500">Unpack the logic behind risk scoring using Gemini copilot logs, decision trees, and timeline audits.</p>
        </div>
        
        {/* Selector */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-400 uppercase">Audit Case File:</label>
          <select
            value={activeDoc.id}
            onChange={(e) => setActiveDocId(e.target.value)}
            className="px-3.5 py-2 text-xs bg-white border border-slate-200/60 rounded-xl font-semibold text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
          >
            {documents.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Side: Modern AI Chat interface (col-span-7) */}
        <div className="xl:col-span-7 p-5 rounded-3xl bg-white border border-slate-200/60 shadow-xs flex flex-col h-[550px]">
          {/* Chat header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                <Sparkles className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-800">Gemini Forensics Copilot</h3>
                <p className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Vertex AI Online
                </p>
              </div>
            </div>
          </div>

          {/* Chat Messages stream */}
          <div className="flex-1 overflow-y-auto space-y-4 p-2 scrollbar-thin">
            {chatMessages.map((msg, i) => (
              <div 
                key={i} 
                className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-xs shadow-xs'
                    : 'bg-slate-100 text-slate-700 rounded-tl-xs border border-slate-200/30'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <span className={`text-[8px] mt-1.5 block text-right ${msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}
            
            {/* Typing Loader */}
            {isTyping && (
              <div className="flex gap-3">
                <div className="p-3 bg-slate-100 text-slate-400 rounded-2xl rounded-tl-xs border border-slate-200/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100 mt-4 mb-2">
            {presetQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg text-[10px] font-bold hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Message input */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputText);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask Gemini to explain reasoning logic, metadata discrepancies..."
              className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400 font-medium"
            />
            <button
              type="submit"
              className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right Side: Timeline & Expandable Cards (col-span-5) */}
        <div className="xl:col-span-5 space-y-6">
          
          {/* Expanded Reasoning Cards */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/60 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">Forensic Evidence Catalog</h3>
            
            <div className="space-y-2.5">
              {/* Card 1: Photoshop Mod */}
              <div className="border border-slate-150 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setExpandedCard(expandedCard === 'photos' ? null : 'photos')}
                  className="w-full p-3.5 bg-slate-50/50 flex justify-between items-center text-xs font-bold text-slate-800 hover:bg-slate-50 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <AlertTriangle className={`w-4.5 h-4.5 ${activeDoc.riskLevel === 'High' ? 'text-red-500' : 'text-slate-400'}`} />
                    Photoshop/GIMP Alteration Traces
                  </span>
                  {expandedCard === 'photos' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                <AnimatePresence>
                  {expandedCard === 'photos' && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 border-t border-slate-150 text-[11px] text-slate-500 leading-relaxed bg-white space-y-2">
                        <p>
                          Our Computer Vision texture classifier isolates JPEG compression grids. Digital editing tools like Photoshop leave distinct localized metadata signatures and inconsistent pixel structures.
                        </p>
                        {activeDoc.cvAnalysis.tamperingDetected ? (
                          <div className="p-2.5 bg-red-50 text-red-700 font-semibold rounded-xl border border-red-100">
                            Status: Alert. Alterations detected on file. Saved via {activeDoc.metadata['EXIF Software'] || 'unapproved suite'}.
                          </div>
                        ) : (
                          <div className="p-2.5 bg-emerald-50 text-emerald-700 font-semibold rounded-xl border border-emerald-100">
                            Status: Verified. No editing traces found.
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Card 2: Signature Autopen */}
              <div className="border border-slate-150 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setExpandedCard(expandedCard === 'signature' ? null : 'signature')}
                  className="w-full p-3.5 bg-slate-50/50 flex justify-between items-center text-xs font-bold text-slate-800 hover:bg-slate-50 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <AlertTriangle className={`w-4.5 h-4.5 ${
                      activeDoc.signatureAnalysis.anomalyDetected ? 'text-red-500' : 'text-slate-400'
                    }`} />
                    Signature Reuse / Trace Alert
                  </span>
                  {expandedCard === 'signature' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                <AnimatePresence>
                  {expandedCard === 'signature' && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 border-t border-slate-150 text-[11px] text-slate-500 leading-relaxed bg-white space-y-2">
                        <p>
                          Dynamic signature checks track the stroke geometry and pressure profiles. Forged documents often feature "copy-paste" signatures lifted from reference contracts or autopen mechanical signatures.
                        </p>
                        {activeDoc.signatureAnalysis.detected && (
                          <div className={`p-2.5 rounded-xl border font-semibold ${
                            activeDoc.signatureAnalysis.anomalyDetected 
                              ? 'bg-red-50 text-red-700 border-red-100'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          }`}>
                            Reference matching score: {activeDoc.signatureAnalysis.matchScore}%
                            <p className="font-normal text-[10px] text-slate-500 mt-1">
                              {activeDoc.signatureAnalysis.details}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Card 3: Math Mismatch */}
              <div className="border border-slate-150 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setExpandedCard(expandedCard === 'math' ? null : 'math')}
                  className="w-full p-3.5 bg-slate-50/50 flex justify-between items-center text-xs font-bold text-slate-800 hover:bg-slate-50 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <AlertTriangle className={`w-4.5 h-4.5 ${
                      activeDoc.nlpReasoning.inconsistencies.length > 0 ? 'text-red-500' : 'text-slate-400'
                    }`} />
                    Amount Inflation / Math Anomaly
                  </span>
                  {expandedCard === 'math' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                <AnimatePresence>
                  {expandedCard === 'math' && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 border-t border-slate-150 text-[11px] text-slate-500 leading-relaxed bg-white space-y-2">
                        <p>
                          Our NLP logic agent parses all itemized values to verify calculations. Forgers often change text prices without recalculating taxes, subtotals, or quantities correctly.
                        </p>
                        {activeDoc.nlpReasoning.inconsistencies.length > 0 ? (
                          <div className="p-2.5 bg-red-50 text-red-700 font-semibold rounded-xl border border-red-100">
                            Flagged Mismatch: {activeDoc.nlpReasoning.inconsistencies[0]}
                          </div>
                        ) : (
                          <div className="p-2.5 bg-emerald-50 text-emerald-700 font-semibold rounded-xl border border-emerald-100">
                            Status: Verified. Mathematical matrices balance correctly.
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Step-by-Step Decision Logic Tree */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/60 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Network className="w-4 h-4 text-indigo-500" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">AI Decision Logic Tree</h3>
            </div>

            <div className="flex flex-col gap-3 font-mono text-[10px] text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-1.5 text-indigo-600 font-bold">
                <Cpu className="w-3.5 h-3.5" />
                Root: Document Auditing
              </div>
              <div className="pl-4 border-l border-slate-200 space-y-3">
                {/* Step 1 */}
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">└─</span>
                  <span>1. EXIF Metadata:</span>
                  <span className={`font-bold uppercase ${
                    activeDoc.id === 'doc-3' ? 'text-emerald-600' : 'text-red-500'
                  }`}>
                    {activeDoc.id === 'doc-3' ? 'PASS' : 'FLAGGED'}
                  </span>
                </div>
                {/* Step 2 */}
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">└─</span>
                  <span>2. CV Alignment Scans:</span>
                  <span className={`font-bold uppercase ${
                    activeDoc.cvAnalysis.tamperingDetected ? 'text-red-500' : 'text-emerald-600'
                  }`}>
                    {activeDoc.cvAnalysis.tamperingDetected ? 'FAIL' : 'PASS'}
                  </span>
                </div>
                {/* Step 3 */}
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">└─</span>
                  <span>3. NLP Calculation Parser:</span>
                  <span className={`font-bold uppercase ${
                    activeDoc.nlpReasoning.inconsistencies.length > 0 ? 'text-red-500' : 'text-emerald-600'
                  }`}>
                    {activeDoc.nlpReasoning.inconsistencies.length > 0 ? 'FAIL' : 'PASS'}
                  </span>
                </div>
                {/* Decision outcome */}
                <div className="pt-1.5 border-t border-slate-200/50 flex items-center gap-1.5 font-bold text-slate-800">
                  <span>OUTCOME:</span>
                  <span className={`uppercase ${
                    activeDoc.riskLevel === 'High' ? 'text-red-600' : 'text-emerald-600'
                  }`}>
                    {activeDoc.riskLevel} Risk Route
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explainability;
