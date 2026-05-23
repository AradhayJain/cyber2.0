import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  CheckSquare,
  Sparkles
} from 'lucide-react';

const DocumentIntelligence: React.FC = () => {
  const { documents, activeDocId, setActiveDocId } = useApp();
  const activeDoc = documents.find(doc => doc.id === activeDocId) || documents[0];

  // Mock extracted entities for structured intelligence output
  const extractedEntities = React.useMemo(() => {
    if (!activeDoc) return [];
    
    if (activeDoc.id === 'doc-1') {
      return [
        { field: 'Vendor Name', value: 'Apex Tech Solutions', type: 'Entity (Organization)', confidence: 99, status: 'Verified' },
        { field: 'Invoice No', value: '#90882', type: 'Identifier', confidence: 98, status: 'Verified' },
        { field: 'Subtotal Amount', value: '$120,000.00', type: 'Financial (Calculated)', confidence: 84, status: 'Tamper Suspect', anomaly: 'Subtotal calculation inflated based on unit multiplier.' },
        { field: 'Total Due', value: '$129,600.00', type: 'Financial (Sum)', confidence: 81, status: 'Tamper Suspect', anomaly: 'Total due computed with modified Line Item totals.' },
        { field: 'Routing Number', value: '021000021', type: 'Financial (Routing)', confidence: 95, status: 'Verified' },
        { field: 'Authorized Signee', value: 'Marcus Vance (CFO)', type: 'Signature Entity', confidence: 92, status: 'Signature Validated' },
      ];
    } else if (activeDoc.id === 'doc-2') {
      return [
        { field: 'Document Type', value: 'PASSPORT (P)', type: 'Document Identity', confidence: 99, status: 'Verified' },
        { field: 'Issuer Code', value: 'USA', type: 'Country Code', confidence: 98, status: 'Verified' },
        { field: 'Passport Number', value: '991200382', type: 'Identifier (Check Digit Failed)', confidence: 64, status: 'Checksum Failure', anomaly: 'MRZ checksum index 9 fails birthday formula correlation.' },
        { field: 'Given Names', value: 'JOHN ALBERT', type: 'Entity (Person)', confidence: 98, status: 'Verified' },
        { field: 'Surname', value: 'DOE', type: 'Entity (Person)', confidence: 99, status: 'Verified' },
        { field: 'Date of Birth', value: '14 APR 1985', type: 'Temporal Entity', confidence: 85, status: 'Photo Overlay Suspect', anomaly: 'DOB boundary pixels contain trace photo overlay borders.' }
      ];
    } else {
      return [
        { field: 'Employer Name', value: 'FutureTech Labs Inc.', type: 'Entity (Organization)', confidence: 99, status: 'Verified' },
        { field: 'Employee Name', value: 'Sarah Jenkins', type: 'Entity (Person)', confidence: 99, status: 'Verified' },
        { field: 'Base Salary', value: '$145,000.00', type: 'Financial', confidence: 98, status: 'Verified' },
        { field: 'Role Title', value: 'Senior Machine Learning Engineer', type: 'Role Entity', confidence: 97, status: 'Verified' },
        { field: 'Start Date', value: 'June 1, 2026', type: 'Temporal Entity', confidence: 99, status: 'Verified' }
      ];
    }
  }, [activeDoc]);

  // Typography inspector specifications
  const typographyMetrics = React.useMemo(() => {
    if (!activeDoc) return [];
    if (activeDoc.id === 'doc-1') {
      return [
        { metric: 'Average Kerning Deflection', value: '1.2px', threshold: '0.5px', status: 'Warning', desc: 'Spacing around Line Item 2 values deviates from standard PDF matrix.' },
        { metric: 'Typeface Diversity Index', value: '2 Fonts', threshold: '1 Font', status: 'Warning', desc: 'Identified overlapping Roboto and Helvetica font declarations.' },
        { metric: 'Baseline Horizontal Shift', value: '0.1° tilt', threshold: '0.05°', status: 'Normal', desc: 'Document layout tilt is within normal flatbed scanner values.' }
      ];
    } else if (activeDoc.id === 'doc-2') {
      return [
        { metric: 'MRZ Stroke Thickness Variance', value: '0.24mm', threshold: '0.10mm', status: 'Warning', desc: 'Bottom line MRZ print stroke thickness is non-uniform.' },
        { metric: 'Face Photo Border Seam Deviation', value: '98% confidence', threshold: '90%', status: 'Critical', desc: 'Edge continuity check shows localized 2px color discontinuity seam.' },
        { metric: 'UV Fluorescent Pattern Sim', value: 'Match Failed', threshold: 'Match', status: 'Critical', desc: 'Underlying paper matrix does not present standard UV background seals.' }
      ];
    } else {
      return [
        { metric: 'Average Kerning Deflection', value: '0.1px', threshold: '0.5px', status: 'Normal', desc: 'Perfect glyph mapping and standard printer matrix spacing.' },
        { metric: 'Typeface Diversity Index', value: '1 Font', threshold: '2 Fonts', status: 'Normal', desc: 'Unified fonts detected. No external software patches found.' },
        { metric: 'Baseline Horizontal Shift', value: '0°', threshold: '0.05°', status: 'Normal', desc: 'Perfect layout alignment.' }
      ];
    }
  }, [activeDoc]);

  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/50 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Structured Document Intelligence</h1>
          <p className="text-xs text-slate-500">View extracted semantic entity schemas, compliance checkers, and layout typography metrics.</p>
        </div>
        
        {/* Selector */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-400 uppercase">Document Profile:</label>
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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Key-Value Schema Extraction Table (col-span-2) */}
        <div className="xl:col-span-2 p-5 rounded-3xl bg-white border border-slate-200/60 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Extracted Schema Model</h3>
            </div>
            <span className="text-[10px] font-bold text-slate-400">Vertex AI Schema Extractor</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400">
                  <th className="pb-3.5 font-bold uppercase text-[9px]">Extracted Field</th>
                  <th className="pb-3.5 font-bold uppercase text-[9px]">Data Value</th>
                  <th className="pb-3.5 font-bold uppercase text-[9px]">Schema Type</th>
                  <th className="pb-3.5 font-bold uppercase text-[9px] text-center">Confidence</th>
                  <th className="pb-3.5 font-bold uppercase text-[9px] text-right">Integrity Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-medium">
                {extractedEntities.map((entity, i) => (
                  <tr key={i} className="group hover:bg-slate-50/40 transition-colors">
                    <td className="py-3 font-bold text-slate-700">{entity.field}</td>
                    <td className="py-3 font-mono text-slate-800">{entity.value}</td>
                    <td className="py-3 text-slate-400 text-[10px]">{entity.type}</td>
                    <td className="py-3 text-center">
                      <div className="inline-flex items-center justify-center px-2 py-0.5 rounded-sm font-mono text-[10px] font-bold bg-slate-100 text-slate-600">
                        {entity.confidence}%
                      </div>
                    </td>
                    <td className="py-3 text-right">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        entity.status.includes('Suspect') || entity.status.includes('Failure')
                          ? 'bg-red-50 text-red-600'
                          : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {entity.status.includes('Suspect') || entity.status.includes('Failure') ? (
                          <AlertTriangle className="w-3 h-3 text-red-500" />
                        ) : (
                          <CheckCircle className="w-3 h-3 text-emerald-500" />
                        )}
                        {entity.status}
                      </span>
                      {entity.anomaly && (
                        <p className="text-[9px] text-red-400 mt-1 max-w-[200px] inline-block font-normal text-left">
                          {entity.anomaly}
                        </p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Layout & Typography Auditor */}
        <div className="space-y-6">
          <div className="p-5 rounded-3xl bg-white border border-slate-200/60 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <FileText className="w-4 h-4 text-indigo-500" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Typography Forensic Scans</h3>
            </div>

            <div className="space-y-4">
              {typographyMetrics.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-700">{item.metric}</span>
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-sm ${
                      item.status === 'Critical' ? 'bg-red-100 text-red-700' :
                      item.status === 'Warning' ? 'bg-amber-100 text-amber-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>{item.status}</span>
                  </div>
                  <div className="grid grid-cols-2 text-[10px] text-slate-400 bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <div>Measured: <span className="font-bold font-mono text-slate-700">{item.value}</span></div>
                    <div>Acceptable: &lt; <span className="font-bold font-mono text-slate-700">{item.threshold}</span></div>
                    <p className="col-span-2 text-[10px] text-slate-500 leading-normal mt-1 pt-1 border-t border-slate-200/40">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Underwriting Rules Compliance Checklist */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/60 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <CheckSquare className="w-4 h-4 text-indigo-500" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Underwriting Compliance</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50/50">
                <CheckCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-800">Signature Block Validation</h4>
                  <p className="text-[10px] text-slate-500">Verifies matching signatory names against database authorizations.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50/50">
                {activeDoc.riskLevel === 'High' ? (
                  <AlertTriangle className="w-4.5 h-4.5 text-red-500 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="font-bold text-slate-800">Visual Texture Continuity</h4>
                  <p className="text-[10px] text-slate-500">Requires zero JPEG patch anomalies, Photoshop export EXIF tags, or overlay seams.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50/50">
                {activeDoc.riskLevel === 'High' ? (
                  <AlertTriangle className="w-4.5 h-4.5 text-red-500 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="font-bold text-slate-800">Field Math Verification</h4>
                  <p className="text-[10px] text-slate-500">Confirms items calculation products perfectly match subtotal structures.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentIntelligence;
