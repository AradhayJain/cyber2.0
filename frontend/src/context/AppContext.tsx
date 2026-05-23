import React, { createContext, useContext, useState } from 'react';

export interface AuditLog {
  id: string;
  timestamp: string;
  category: 'System' | 'AI Agent' | 'User';
  agent: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
}

export interface Document {
  id: string;
  name: string;
  type: 'PDF' | 'PNG' | 'JPG' | 'TIFF';
  size: string;
  uploadedAt: string;
  status: 'Uploading' | 'Processing' | 'Completed' | 'Failed';
  stage: 'none' | 'ocr' | 'cv' | 'signature' | 'nlp' | 'rag' | 'scoring' | 'explain' | 'completed';
  progress: number;
  fraudScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  tamperingCategories: string[];
  ocrText: string;
  metadata: Record<string, string>;
  cvAnalysis: {
    tamperingDetected: boolean;
    suspiciousRegions: Array<{ id: number; bbox: [number, number, number, number]; label: string; confidence: number; description: string }>;
    fontInconsistencies: string[];
  };
  signatureAnalysis: {
    detected: boolean;
    matchScore: number;
    referenceName: string;
    details: string;
    anomalyDetected: boolean;
  };
  nlpReasoning: {
    summary: string;
    inconsistencies: string[];
    riskScore: number;
  };
  explainability: {
    summary: string;
    timeline: Array<{ title: string; description: string; time: string; status: 'info' | 'warning' | 'error' }>;
    evidence: string[];
  };
}

interface AppContextType {
  documents: Document[];
  logs: AuditLog[];
  settings: {
    aiModel: string;
    cvThreshold: number;
    nlpThreshold: number;
    autoApprove: boolean;
    activeAgents: string[];
  };
  updateSettings: (settings: Partial<AppContextType['settings']>) => void;
  uploadDocument: (file: File) => void;
  deleteDocument: (id: string) => void;
  addLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
  activeDocId: string | null;
  setActiveDocId: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialDocuments: Document[] = [
  {
    id: 'doc-1',
    name: 'commercial_invoice_90882.pdf',
    type: 'PDF',
    size: '1.2 MB',
    uploadedAt: '2026-05-23T08:14:00Z',
    status: 'Completed',
    stage: 'completed',
    progress: 100,
    fraudScore: 84,
    riskLevel: 'High',
    tamperingCategories: ['Metadata Alteration', 'Amount Tampering', 'Font Inconsistency'],
    ocrText: `INVOICE TO: Apex Tech Solutions\nDATE: May 12, 2026\nINVOICE NO: #90882\n\nLine Items:\n1. Cloud Migration Consulting - Qty: 1 - Price: $45,000.00 - Total: $45,000.00\n2. Vertex AI API Nodes Deployment - Qty: 1 - Price: $15,000.00 - Total: $75,000.00\n\nSUBTOTAL: $120,000.00\nTAX (8%): $9,600.00\nTOTAL DUE: $129,600.00\n\nPayment terms: Due within 30 days.\nBank Routing: 021000021\nAccount Number: *******8821`,
    metadata: {
      'Creator': 'Adobe Acrobat Pro 2024 (Windows)',
      'Producer': 'Acrobat Distiller 22.0',
      'CreationDate': '2026-05-12T14:22:15Z',
      'ModifyDate': '2026-05-23T08:12:00Z (Altered by external binary tool)',
      'PDF Version': '1.7',
      'Language': 'en-US',
      'Author': 'Unknown'
    },
    cvAnalysis: {
      tamperingDetected: true,
      suspiciousRegions: [
        { id: 1, bbox: [480, 240, 220, 30], label: 'Font Discrepancy', confidence: 97, description: 'Line item 2 total price "$75,000.00" uses Helvetica, whereas the rest of the document uses Roboto. Alignment is off by 2 pixels vertically.' },
        { id: 2, bbox: [480, 280, 220, 35], label: 'Artifact Clustering', confidence: 91, description: 'Compression artifacts around "$75,000.00" indicate local copy-paste modification (Photoshop levels modification).' }
      ],
      fontInconsistencies: ['Helvetica vs Roboto (Line Item 2 total)', 'Kerning mismatch in total invoice amount box']
    },
    signatureAnalysis: {
      detected: true,
      matchScore: 92,
      referenceName: 'Marcus Vance (CFO)',
      details: 'Signature verified against corporate database. Authorizing signature is authentic, but the document metadata modifications suggest editing occurred AFTER the signature was affixed.',
      anomalyDetected: true
    },
    nlpReasoning: {
      summary: 'Mathematical inconsistency detected in itemized list. Line item 2: 1 unit at $15,000.00 is calculated as $75,000.00. The invoice totals ($120,000.00 subtotal) match the forged line total instead of the math products.',
      inconsistencies: ['Line Item 2 math: 1 x $15,000.00 != $75,000.00', 'Subtotal matches modified total instead of correct sum ($60,000.00)'],
      riskScore: 95
    },
    explainability: {
      summary: 'This document is classified as HIGH RISK due to combined digital forgery indicators. The PDF metadata reveals modification by an unapproved PDF tool moments before upload. Computer Vision analysis flagged a localized font modification in the price field of Line Item 2. Finally, the NLP logic agent verified that the line items mathematical sums are inconsistent, indicating the total was artificially inflated from $60,000 to $120,000, and the layout was modified to mask the edit.',
      timeline: [
        { title: 'Metadata Extraction', description: 'Extracted PDF metadata and identified external alteration flags.', time: '08:14:02', status: 'warning' },
        { title: 'Computer Vision Scan', description: 'Detected font alignment mismatch in the pricing section.', time: '08:14:04', status: 'error' },
        { title: 'Mathematical Verification', description: 'NLP Agent flagged calculation error: 1 * $15,000.00 computed as $75,000.00.', time: '08:14:06', status: 'error' },
        { title: 'RAG Reference Check', description: 'Compared signature of Marcus Vance. Signature matches corporate records.', time: '08:14:07', status: 'info' },
        { title: 'Risk Aggregation', description: 'Calculated final risk score of 84/100.', time: '08:14:09', status: 'error' }
      ],
      evidence: [
        'Photoshop compressions found around price tags.',
        'Calculated sum ($60,000) does not match invoice subtotal ($120,000).',
        'Metadata modified field altered timestamp matches upload hour.'
      ]
    }
  },
  {
    id: 'doc-2',
    name: 'passport_scan_johndoe.png',
    type: 'PNG',
    size: '2.4 MB',
    uploadedAt: '2026-05-23T07:45:00Z',
    status: 'Completed',
    stage: 'completed',
    progress: 100,
    fraudScore: 92,
    riskLevel: 'High',
    tamperingCategories: ['Photo Overlay', 'MRZ Number Mismatch'],
    ocrText: `PASSPORT\nTYPE: P - CODE: USA - PASSPORT NO: 991200382\nSURNAME: DOE\nGIVEN NAMES: JOHN ALBERT\nNATIONALITY: UNITED STATES OF AMERICA\nDATE OF BIRTH: 14 APR 1985\nSEX: M\nPLACE OF BIRTH: NEW YORK, USA\nDATE OF ISSUE: 10 OCT 2021\nDATE OF EXPIRY: 09 OCT 2031\n\nP<USADOE<<JOHN<ALBERT<<<<<<<<<<<<<<<<<<<<<<\n9912003824USA8504141M3110091<<<<<<<<<<<<<<02`,
    metadata: {
      'Image Width': '1920 px',
      'Image Height': '1080 px',
      'Color Space': 'sRGB',
      'EXIF Software': 'GIMP 2.10.30',
      'CreationDate': '2026-05-23T07:40:12Z'
    },
    cvAnalysis: {
      tamperingDetected: true,
      suspiciousRegions: [
        { id: 1, bbox: [80, 120, 180, 240], label: 'Photo Overlay Detected', confidence: 99, description: 'Underneath the current portrait, edge detection reveals a secondary face outline. The border around the photo contains micro-rotational offsets indicating it was digitally pasted over an existing passport photo.' },
        { id: 2, bbox: [200, 480, 600, 60], label: 'Font Inconsistency', confidence: 88, description: 'The MRZ text characters at the bottom use OCR-B font but show subtle variations in stroke thickness compared to standard government-issued templates.' }
      ],
      fontInconsistencies: ['MRZ typeface thickness variations', 'Date of Birth digits show slight alignment offsets']
    },
    signatureAnalysis: {
      detected: true,
      matchScore: 34,
      referenceName: 'John Albert Doe',
      details: 'Signature does not match passport database registry for John Albert Doe. The stroke velocity and pressure curves simulated by CV indicate a trace overlay rather than organic writing.',
      anomalyDetected: true
    },
    nlpReasoning: {
      summary: 'MRZ string validation checksum failed. The checksum digit for Date of Birth does not correlate to 14 APR 1985. Expiry checksum digit matches but issuer country code contains non-standard padding.',
      inconsistencies: ['MRZ DOB checksum verification failed', 'MRZ Passport Number checksum mismatch'],
      riskScore: 98
    },
    explainability: {
      summary: 'This passport scan is a digital forgery. The user overlayed a different photo onto an authentic passport background. The machine-readable zone (MRZ) checksums fail validation calculations, and EXIF metadata confirms the file was saved using the open-source editor GIMP minutes before submission.',
      timeline: [
        { title: 'EXIF Metadata Analysis', description: 'Detected software tag "GIMP 2.10.30" in the image header.', time: '07:45:02', status: 'error' },
        { title: 'Computer Vision Analysis', description: 'Identified face boundary mismatch and paste seams around photo.', time: '07:45:05', status: 'error' },
        { title: 'MRZ Validation', description: 'NLP Agent recalculating MRZ checksums flagged check digit failures.', time: '07:45:08', status: 'error' },
        { title: 'Signature Analysis', description: 'Signature compared with historical database: 34% similarity score.', time: '07:45:10', status: 'error' },
        { title: 'Final Decision', description: 'System flagged high risk and routed to manual review queue.', time: '07:45:12', status: 'error' }
      ],
      evidence: [
        'Image saved with GIMP software tag.',
        'Visible photo border outline indicating patch overlay.',
        'MRZ checksum calculation fails for DOB block.',
        'Traced signature characteristics detected.'
      ]
    }
  },
  {
    id: 'doc-3',
    name: 'employment_agreement_signed.pdf',
    type: 'PDF',
    size: '850 KB',
    uploadedAt: '2026-05-23T06:20:00Z',
    status: 'Completed',
    stage: 'completed',
    progress: 100,
    fraudScore: 12,
    riskLevel: 'Low',
    tamperingCategories: [],
    ocrText: `EMPLOYMENT CONTRACT\nThis contract is made between FutureTech Labs Inc. and Sarah Jenkins.\n\nPosition: Senior Machine Learning Engineer\nSalary: $145,000 per annum\nStart Date: June 1, 2026\n\nSignatures:\nEmployee: Sarah Jenkins\nFor Company: David Vance, Chief of HR`,
    metadata: {
      'Creator': 'Microsoft Word for Microsoft 365',
      'Producer': 'Microsoft PDF Library',
      'CreationDate': '2026-05-20T10:14:02Z',
      'ModifyDate': '2026-05-20T10:14:02Z',
      'PDF Version': '1.5'
    },
    cvAnalysis: {
      tamperingDetected: false,
      suspiciousRegions: [],
      fontInconsistencies: []
    },
    signatureAnalysis: {
      detected: true,
      matchScore: 98,
      referenceName: 'Sarah Jenkins',
      details: 'Signature matches signature on file. High confidence (98%). Brush stroke and pressure points verify organic hand-signed inputs.',
      anomalyDetected: false
    },
    nlpReasoning: {
      summary: 'Document is mathematically and logically sound. Terms correspond to company salary structures and default template clauses.',
      inconsistencies: [],
      riskScore: 5
    },
    explainability: {
      summary: 'The document shows zero indications of tampering. The metadata is clean and matches the standard export formats. Computer vision shows no pixel inconsistencies or anomalies. The signature is highly correlated with the applicant\'s identity database, and all text content is structured logically with no internal conflicts.',
      timeline: [
        { title: 'Metadata Audit', description: 'Metadata verified. Valid Microsoft Office PDF export.', time: '06:20:01', status: 'info' },
        { title: 'CV Inconsistency Check', description: 'Analyzed document structures. Font and layout matching verified.', time: '06:20:03', status: 'info' },
        { title: 'Signature Comparison', description: 'Verified signature matches reference card with 98% confidence.', time: '06:20:05', status: 'info' },
        { title: 'NLP Audit', description: 'Terms and parameters verified against standard templates.', time: '06:20:06', status: 'info' },
        { title: 'Final Rating', description: 'Assigned low-risk score of 12/100.', time: '06:20:07', status: 'info' }
      ],
      evidence: []
    }
  }
];

const initialLogs: AuditLog[] = [
  { id: 'log-1', timestamp: '2026-05-23T08:14:09Z', category: 'AI Agent', agent: 'Risk Scoring Agent', message: 'Document commercial_invoice_90882.pdf flagged with HIGH RISK (Score: 84). Fraud factors: metadata modified, amount mismatch.', severity: 'error' },
  { id: 'log-2', timestamp: '2026-05-23T08:14:06Z', category: 'AI Agent', agent: 'NLP Logic Agent', message: 'Calculation error identified in commercial_invoice_90882.pdf: Qty 1 x Price $15k evaluated to $75k total.', severity: 'error' },
  { id: 'log-3', timestamp: '2026-05-23T08:14:04Z', category: 'AI Agent', agent: 'CV Fraud Detection Tool', message: 'Detected Helvetica font override on commercial_invoice_90882.pdf page 1 sub-section B.', severity: 'warning' },
  { id: 'log-4', timestamp: '2026-05-23T08:14:02Z', category: 'AI Agent', agent: 'Metadata Tool', message: 'Extracted modified timestamp (08:12:00) does not align with creation date on commercial_invoice_90882.pdf.', severity: 'warning' },
  { id: 'log-5', timestamp: '2026-05-23T08:14:00Z', category: 'System', agent: 'Orchestrator Agent', message: 'New document upload received: commercial_invoice_90882.pdf. Starting analysis pipeline.', severity: 'info' },
  { id: 'log-6', timestamp: '2026-05-23T07:45:12Z', category: 'AI Agent', agent: 'Risk Scoring Agent', message: 'Document passport_scan_johndoe.png flagged with HIGH RISK (Score: 92). Photo overlay + MRZ checksum failure.', severity: 'error' },
  { id: 'log-7', timestamp: '2026-05-23T07:45:08Z', category: 'AI Agent', agent: 'NLP Logic Agent', message: 'MRZ birthday verification checksum failure on passport_scan_johndoe.png.', severity: 'error' },
  { id: 'log-8', timestamp: '2026-05-23T07:45:05Z', category: 'AI Agent', agent: 'CV Fraud Detection Tool', message: 'Photoshop boundary outlines detected on photo area of passport_scan_johndoe.png.', severity: 'error' },
  { id: 'log-9', timestamp: '2026-05-23T07:45:00Z', category: 'System', agent: 'Orchestrator Agent', message: 'New document upload received: passport_scan_johndoe.png. Starting analysis pipeline.', severity: 'info' },
  { id: 'log-10', timestamp: '2026-05-23T06:20:07Z', category: 'AI Agent', agent: 'Risk Scoring Agent', message: 'Document employment_agreement_signed.pdf flagged with LOW RISK (Score: 12). Approving automatically.', severity: 'info' },
  { id: 'log-11', timestamp: '2026-05-23T06:20:00Z', category: 'System', agent: 'Orchestrator Agent', message: 'New document upload received: employment_agreement_signed.pdf. Starting analysis pipeline.', severity: 'info' }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [logs, setLogs] = useState<AuditLog[]>(initialLogs);
  const [activeDocId, setActiveDocId] = useState<string | null>('doc-1');
  const [settings, setSettings] = useState({
    aiModel: 'Gemini 1.5 Pro (Vertex AI)',
    cvThreshold: 75,
    nlpThreshold: 80,
    autoApprove: false,
    activeAgents: ['Orchestrator', 'OCR Extract', 'CV Forensics', 'Signature Verifier', 'NLP Logic', 'RAG Knowledge', 'Risk Scoring', 'Explainability']
  });

  const updateSettings = (newSettings: Partial<typeof settings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const addLog = (log: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      ...log
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    if (activeDocId === id) {
      const remaining = documents.filter((doc) => doc.id !== id);
      setActiveDocId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const uploadDocument = (file: File) => {
    const docId = `doc-${Date.now()}`;
    const sizeStr = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
      : `${(file.size / 1024).toFixed(0)} KB`;
    
    const fileType = file.name.split('.').pop()?.toUpperCase() as Document['type'] || 'PDF';

    const newDoc: Document = {
      id: docId,
      name: file.name,
      type: fileType,
      size: sizeStr,
      uploadedAt: new Date().toISOString(),
      status: 'Uploading',
      stage: 'none',
      progress: 10,
      fraudScore: 0,
      riskLevel: 'Low',
      tamperingCategories: [],
      ocrText: '',
      metadata: {
        'File Size': sizeStr,
        'File Format': fileType,
        'Upload Timestamp': new Date().toISOString(),
        'Scanner': 'Vertex Online Gateway',
        'MD5 Hash': Math.random().toString(16).substr(2, 32)
      },
      cvAnalysis: { tamperingDetected: false, suspiciousRegions: [], fontInconsistencies: [] },
      signatureAnalysis: { detected: false, matchScore: 0, referenceName: '', details: '', anomalyDetected: false },
      nlpReasoning: { summary: '', inconsistencies: [], riskScore: 0 },
      explainability: { summary: '', timeline: [], evidence: [] }
    };

    setDocuments((prev) => [newDoc, ...prev]);
    setActiveDocId(docId);

    // Simulate Agent processing step-by-step
    addLog({
      category: 'System',
      agent: 'Upload Manager',
      message: `Document ${file.name} received. Parsing and uploading file buffer...`,
      severity: 'info'
    });

    let currentProgress = 10;
    const interval = setInterval(() => {
      currentProgress += 15;
      if (currentProgress >= 100) {
        clearInterval(interval);
        
        // Determine if mock document is simulated as fraud
        const isFraud = file.name.toLowerCase().includes('fraud') || file.name.toLowerCase().includes('invoice') || Math.random() > 0.5;
        const fraudScore = isFraud ? Math.floor(Math.random() * 30) + 65 : Math.floor(Math.random() * 25);
        const riskLevel = fraudScore > 70 ? 'High' : fraudScore > 35 ? 'Medium' : 'Low';
        const tamperingCats = isFraud 
          ? ['Metadata Alteration', 'Font Inconsistency']
          : [];

        const completedDoc: Document = {
          ...newDoc,
          status: 'Completed',
          stage: 'completed',
          progress: 100,
          fraudScore,
          riskLevel,
          tamperingCategories: tamperingCats,
          ocrText: isFraud 
            ? `INVOICE TO: Vertex Enterprise\nDATE: May 23, 2026\nINVOICE NO: #FV-8802\n\nTotal Due: $95,000.00\nLine Items:\nConsulting Fee - Qty: 1 - Price: $35,000.00 - Total: $95,000.00`
            : `CLEAN DOCUMENT SCAN\nNo anomalies detected.\nVerified Transaction ID: tx_991823\nDate: May 23, 2026`,
          cvAnalysis: {
            tamperingDetected: isFraud,
            suspiciousRegions: isFraud ? [
              { id: 1, bbox: [250, 180, 140, 25], label: 'Typeface Variance', confidence: 94, description: 'Pricing number uses customized Helvetica Neue instead of corporate document sans-serif.' }
            ] : [],
            fontInconsistencies: isFraud ? ['Helvetica Neue vs Arial'] : []
          },
          signatureAnalysis: {
            detected: true,
            matchScore: isFraud ? 45 : 97,
            referenceName: 'Alex Mercer (Director)',
            details: isFraud ? 'Signature mismatch detected. Signature velocity profile matches computer auto-pen tracing.' : 'Signature verified successfully.',
            anomalyDetected: isFraud
          },
          nlpReasoning: {
            summary: isFraud 
              ? 'Invoice calculation error: Qty 1 x Price $35,000 equals $95,000. Text semantic analysis reports severe risk of amount inflation.'
              : 'Semantic syntax verification passed. All fields align with transactional metadata.',
            inconsistencies: isFraud ? ['Item total mismatch: 1 x 35,000 = 95,000'] : [],
            riskScore: fraudScore
          },
          explainability: {
            summary: isFraud 
              ? 'This document was flagged as high fraud risk due to typographic modification in the pricing field, combined with signature profile anomalies indicating digital tracing, and an arithmetic mismatch in line items.'
              : 'Clean audit. All stages validated successfully. No visual, semantic, or structural anomalies detected.',
            timeline: [
              { title: 'Orchestrator Assign', description: 'Initiated processing pipeline across 8 Vertex agent tools.', time: '09:18:10', status: 'info' },
              { title: 'OCR Text Ingestion', description: 'Extracted text structure and verified field coordinates.', time: '09:18:12', status: 'info' },
              { title: 'CV Texture & Font Analysis', description: isFraud ? 'Flagged pixel variance in pricing numbers.' : 'Verified pixel density and typography.', time: '09:18:13', status: isFraud ? 'error' : 'info' },
              { title: 'Signature Authentication', description: isFraud ? 'Flagged possible autopen replication.' : 'Verified organic signature matching.', time: '09:18:15', status: isFraud ? 'warning' : 'info' },
              { title: 'Final Risk Check', description: `Assigned fraud risk score of ${fraudScore}%.`, time: '09:18:16', status: isFraud ? 'error' : 'info' }
            ],
            evidence: isFraud ? ['Visual copy-paste traces in pricing cell.', 'Autopen signature matching pattern.'] : []
          }
        };

        setDocuments((prev) => prev.map((doc) => (doc.id === docId ? completedDoc : doc)));
        
        // Add final logs
        addLog({
          category: 'AI Agent',
          agent: 'Risk Scoring Agent',
          message: `Finished audit of ${file.name}. Risk assigned: ${riskLevel} (${fraudScore}%)`,
          severity: riskLevel === 'High' ? 'error' : riskLevel === 'Medium' ? 'warning' : 'info'
        });

      } else {
        // Stepwise update for UI Agent flow visualization
        let currentStage: Document['stage'] = 'none';
        let logMsg = '';
        let logAgent = 'Orchestrator Agent';
        let logCat: AuditLog['category'] = 'AI Agent';
        
        if (currentProgress < 25) {
          currentStage = 'ocr';
          logMsg = `Extracting characters from ${file.name} using OCR-Agent`;
          logAgent = 'OCR Agent';
        } else if (currentProgress < 45) {
          currentStage = 'cv';
          logMsg = `Running computer vision forensic models for pixel manipulation detection`;
          logAgent = 'CV Fraud Agent';
        } else if (currentProgress < 65) {
          currentStage = 'signature';
          logMsg = `Checking signature stroke vectors against corporate record signatures`;
          logAgent = 'Signature Verifier';
        } else if (currentProgress < 85) {
          currentStage = 'nlp';
          logMsg = `Running natural language verification and mathematical sanity checking`;
          logAgent = 'NLP Logic Agent';
        } else {
          currentStage = 'scoring';
          logMsg = `Aggregating risk indicators and calculating fraud index`;
          logAgent = 'Risk Scoring Agent';
        }

        setDocuments((prev) =>
          prev.map((doc) =>
            doc.id === docId
              ? { ...doc, progress: currentProgress, status: 'Processing', stage: currentStage }
              : doc
          )
        );

        addLog({
          category: logCat,
          agent: logAgent,
          message: logMsg,
          severity: 'info'
        });
      }
    }, 1200);
  };

  return (
    <AppContext.Provider
      value={{
        documents,
        logs,
        settings,
        updateSettings,
        uploadDocument,
        deleteDocument,
        addLog,
        activeDocId,
        setActiveDocId
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
