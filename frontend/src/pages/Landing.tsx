import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  ArrowRight,
  Search,
  Fingerprint,
  BarChart2,
  Monitor,
  Play,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Terminal,
  Lock,
  Award,
} from 'lucide-react';
import PublicNav from '../components/PublicNav';
import PublicFooter from '../components/PublicFooter';

/* ─── types ─────────────────────────────────────────────────────────────── */
type PayloadKey = 'invoice' | 'passport' | 'contract';
type RiskLevel  = 'Low' | 'High';

interface ScanResult {
  risk: RiskLevel;
  score: number;
  issues: string[];
}

/* ─── data ───────────────────────────────────────────────────────────────── */
const STATS = [
  { value: '99.8%',  label: 'Detection accuracy', desc: 'Verified by Vertex AI' },
  { value: '<2.4s',  label: 'Forensic latency',   desc: 'Parallel agent execution' },
  { value: '14.2M+', label: 'Documents scanned',  desc: 'Invoices, IDs, contracts' },
  { value: '0.04%',  label: 'False positive rate', desc: 'Dual RAG verification' },
];

const FEATURES = [
  {
    Icon: Search,
    title: 'Digital tampering forensic lens',
    desc:  'Deep computer vision detects local JPEG compression artifacts, pixel-level overlays, photo substitutions, and hidden Photoshop metadata across any document type.',
  },
  {
    Icon: Fingerprint,
    title: 'Signature biophysical profiling',
    desc:  'Compares signature geometry, pen-stroke velocity vectors, and pressure points against secure historical database profiles with 94%+ biophysical correlation.',
  },
  {
    Icon: BarChart2,
    title: 'Cross-field semantic verification',
    desc:  'Verifies item prices against subtotals, cross-checks dates and reference codes for compliance gaps, and reconciles multi-page logical consistency.',
  },
  {
    Icon: Monitor,
    title: 'Agent swarm orchestration',
    desc:  'Coordinates multiple independent specialist agents simultaneously, using shared context memory to reach weighted consensus on document risk scores.',
  },
];

const STEPS = [
  { num: '01', title: 'Document ingestion',    desc: 'Securely upload PDFs, PNGs, JPGs or TIFFs via API or web console. End-to-end encrypted in transit and at rest.' },
  { num: '02', title: 'Parallel agent dispatch', desc: 'CV, OCR, and metadata agents inspect files simultaneously, each maintaining specialist context for their domain.' },
  { num: '03', title: 'RAG cross-reference',   desc: 'Compare extracted details against historical business data and entity registries to surface discrepancies.' },
  { num: '04', title: 'Consensus reasoning',   desc: 'Explainability agents compile a full forensic evidence log with a weighted risk score and actionable findings.' },
];

const SCAN_DATA: Record<PayloadKey, { logs: string[]; result: ScanResult }> = {
  invoice: {
    logs: [
      'Ingesting invoice_vertex_test_99.pdf (1.2 MB)…',
      'Dispatching CV, OCR, and metadata agents in parallel…',
      'OCR extraction complete. Parsing line-item structure…',
      'Cross-checking line totals: Item 1 $125k × 1 = $125k … OK',
      'Comparing signature vectors against historical anchors…',
      'Signature check: MATCH (94.8 % biophysical correlation)',
      'Analyzing EXIF headers and JPEG compression params…',
      'Metadata validation complete. 0 alterations detected.',
    ],
    result: {
      risk: 'Low',
      score: 4,
      issues: ['Signature verified (94.8 % match)', 'All line totals reconcile correctly', 'No metadata anomalies detected'],
    },
  },
  passport: {
    logs: [
      'Ingesting passport_scan_altered_v2.png (890 KB)…',
      'Dispatching CV and OCR agents…',
      'CV agent: Detecting pixel-level overlays on portrait field…',
      'TAMPER DETECTED — substitutive compression artifacts in photo region',
      'OCR agent: Extracting MRZ text strings…',
      'Checksum verification: FAIL — document ID check digit mismatch',
      'Metadata agent: Analyzing EXIF headers…',
      'Metadata flag: File last saved by GIMP v2.10 (photo editor)',
    ],
    result: {
      risk: 'High',
      score: 88,
      issues: ['Portrait substitution artifacts detected', 'MRZ checksum failed (ID field)', 'GIMP metadata signature confirmed'],
    },
  },
  contract: {
    logs: [
      'Ingesting clean_employment_contract.pdf (4.8 MB)…',
      'Dispatching all 4 forensic agents…',
      'Semantic agent: Parsing clause structure and entity references…',
      'CV agent: Scanning signatures for cut-and-paste manipulation…',
      'Stroke flow check: OK — natural velocity vectors detected',
      'RAG agent: Cross-referencing legal entities with registry…',
      'Registry lookup: MATCH FOUND — Active Corp ID 9021-X verified',
      'Consensus: All agents report clean. File verified.',
    ],
    result: {
      risk: 'Low',
      score: 8,
      issues: ['Signature strokes match historical records', 'Corporate ID verified against registry', 'Semantic structure consistent throughout'],
    },
  },
};

/* ─── sub-components ────────────────────────────────────────────────────── */

/** Tiny animated dot */
const PulseDot: React.FC<{ color?: string }> = ({ color = 'bg-[#1A3CFF]' }) => (
  <span className={`inline-block w-1.5 h-1.5 rounded-full ${color} animate-pulse`} />
);

/** Stat strip item */
const StatItem: React.FC<{ value: string; label: string; desc: string; border?: boolean }> = ({
  value, label, desc, border = true,
}) => (
  <div className={`px-6 first:pl-0 last:border-r-0 ${border ? 'border-r border-black/10' : ''}`}>
    <div className="text-[26px] font-semibold tracking-[-0.04em] text-[#0F0F0E] leading-none mb-1">{value}</div>
    <div className="text-[12px] font-medium text-[#0F0F0E] mb-0.5">{label}</div>
    <div className="text-[11.5px] text-[#8C8C86]">{desc}</div>
  </div>
);

/** Feature card */
const FeatureCard: React.FC<{ Icon: React.FC<{ className?: string }>; title: string; desc: string }> = ({
  Icon, title, desc,
}) => (
  <div className="bg-white p-7 hover:bg-[#F7F6F3] transition-colors duration-150 group">
    <div className="w-9 h-9 bg-[#0F0F0E] rounded-[9px] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
      <Icon className="w-4 h-4 text-white" />
    </div>
    <h4 className="text-[13.5px] font-semibold text-[#0F0F0E] mb-2">{title}</h4>
    <p className="text-[13px] text-[#4A4A45] leading-relaxed">{desc}</p>
  </div>
);

/** Process step card */
const StepCard: React.FC<{ num: string; title: string; desc: string }> = ({ num, title, desc }) => (
  <div className="bg-white p-6 pb-8">
    <div className="font-mono text-[11px] font-medium text-[#8C8C86] tracking-[0.06em] mb-5">{num} —</div>
    <h4 className="text-[13.5px] font-semibold text-[#0F0F0E] mb-2">{title}</h4>
    <p className="text-[12.5px] text-[#4A4A45] leading-relaxed">{desc}</p>
  </div>
);

/* ─── Sandbox ────────────────────────────────────────────────────────────── */
const Sandbox: React.FC = () => {
  const [active, setActive]     = useState<PayloadKey | null>(null);
  const [logs, setLogs]         = useState<string[]>([]);
  const [result, setResult]     = useState<ScanResult | null>(null);
  const [scanning, setScanning] = useState(false);
  const consoleRef              = useRef<HTMLDivElement>(null);
  const intervalRef             = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearScan = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setLogs([]);
    setResult(null);
    setScanning(false);
  };

  const runScan = (key: PayloadKey) => {
    clearScan();
    setActive(key);
    setScanning(true);
    const data = SCAN_DATA[key];
    let i = 0;

    intervalRef.current = setInterval(() => {
      if (i < data.logs.length) {
        setLogs(prev => [...prev, data.logs[i]]);
        i++;
      } else {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setResult(data.result);
        setScanning(false);
      }
    }, 480);
  };

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const payloads: { key: PayloadKey; label: string; activeClass: string; dotColor: string }[] = [
    {
      key: 'invoice',
      label: 'invoice_vertex_test_99.pdf',
      activeClass: 'border-[#1A3CFF] bg-[#EEF1FF] text-[#1A3CFF]',
      dotColor: 'bg-[#1A3CFF]',
    },
    {
      key: 'passport',
      label: 'passport_scan_altered_v2.png',
      activeClass: 'border-[#CC2B2B] bg-[#FFF0F0] text-[#CC2B2B]',
      dotColor: 'bg-[#CC2B2B]',
    },
    {
      key: 'contract',
      label: 'clean_employment_contract.pdf',
      activeClass: 'border-[#0D7A4F] bg-[#EDFAF4] text-[#0D7A4F]',
      dotColor: 'bg-[#0D7A4F]',
    },
  ];

  return (
    <div className="bg-white border border-black/10 rounded-2xl overflow-hidden shadow-sm">
      {/* header */}
      <div className="flex items-center justify-between px-6 py-4 bg-[#F7F6F3] border-b border-black/10">
        <div className="flex items-center gap-2">
          <PulseDot color="bg-[#0D7A4F]" />
          <span className="text-[11.5px] font-semibold text-[#0F0F0E] tracking-[0.04em]">SECURE FORENSIC SANDBOX</span>
        </div>
        <span className="font-mono text-[11px] text-[#8C8C86]">NODE: VTX-US1</span>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* left: payload picker */}
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#8C8C86] mb-3">
            1. Select payload
          </div>
          <div className="flex flex-col gap-2">
            {payloads.map(({ key, label, activeClass, dotColor }) => (
              <button
                key={key}
                onClick={() => runScan(key)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 border rounded-[10px] text-[13px] font-medium text-left cursor-pointer transition-all duration-150 ${
                  active === key
                    ? activeClass
                    : 'border-black/12 bg-transparent text-[#4A4A45] hover:bg-[#F7F6F3] hover:border-black/20 hover:text-[#0F0F0E]'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${active === key ? dotColor : 'bg-[#8C8C86]'}`} />
                <span className="truncate">{label}</span>
              </button>
            ))}
          </div>

          {/* result panel */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 p-4 rounded-[10px] border border-black/10 bg-[#F7F6F3]"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#8C8C86]">
                    Forensic verdict
                  </span>
                  <span
                    className={`text-[11.5px] font-semibold px-2.5 py-0.5 rounded-md border ${
                      result.risk === 'High'
                        ? 'bg-[#FFF0F0] text-[#CC2B2B] border-[#CC2B2B]/20'
                        : 'bg-[#EDFAF4] text-[#0D7A4F] border-[#0D7A4F]/20'
                    }`}
                  >
                    {result.risk} risk · {result.score}/100
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  {result.issues.map((issue, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-[12px] text-[#4A4A45]">
                      {result.risk === 'High' ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-[#CC2B2B] flex-shrink-0 mt-px" />
                      ) : (
                        <CheckCircle className="w-3.5 h-3.5 text-[#0D7A4F] flex-shrink-0 mt-px" />
                      )}
                      {issue}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* right: console */}
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#8C8C86] mb-3">
            2. Agent output
          </div>
          <div
            ref={consoleRef}
            className="bg-[#0F0F0E] rounded-[10px] p-4 font-mono text-[11.5px] leading-relaxed min-h-[200px] max-h-[240px] overflow-y-auto"
          >
            {logs.length === 0 && !scanning ? (
              <div className="flex flex-col items-center justify-center h-full gap-2 text-[#3A3A36] text-center pt-8">
                <Terminal className="w-5 h-5" />
                <span>Select a payload to begin scanning…</span>
              </div>
            ) : (
              <div className="flex flex-col gap-0.5">
                {logs.map((log, idx) => {
                  const isErr = log.includes('FAIL') || log.includes('TAMPER');
                  const isOk  = log.includes('OK') || log.includes('MATCH') || log.includes('verified') || log.includes('complete') || log.includes('Consensus');
                  return (
                    <div key={idx} className="flex items-start gap-1.5">
                      <span className="text-[#3A3A36] flex-shrink-0">&gt;</span>
                      <span className={isErr ? 'text-[#F07070] font-medium' : isOk ? 'text-[#4CAF7D]' : 'text-[#C8C8C2]'}>
                        {log}
                      </span>
                    </div>
                  );
                })}
                {scanning && (
                  <div className="flex items-center gap-2 text-[#6075FF] mt-1">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Agent working…</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── main Landing component ─────────────────────────────────────────────── */
const Landing: React.FC = () => {
  const navigate = useNavigate();

  const scrollToSandbox = () => {
    document.getElementById('sandbox')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F7F6F3] text-[#0F0F0E] font-sans flex flex-col">

      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <PublicNav />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="max-w-[960px] mx-auto w-full px-8 pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#EEF1FF] border border-[#1A3CFF]/15 rounded-full mb-7">
            <PulseDot />
            <span className="text-[11.5px] font-semibold text-[#1A3CFF] tracking-[0.02em]">
              Vertex AI multi-agent forensics
            </span>
          </div>

          <h1 className="text-[clamp(38px,5vw,58px)] font-normal leading-[1.07] tracking-[-0.035em] text-[#0F0F0E] mb-5">
            Document fraud<br />
            detected before it<br />
            <em className="font-['Instrument_Serif'] italic">costs you.</em>
          </h1>

          <p className="text-[15px] text-[#4A4A45] leading-[1.65] max-w-[480px] mb-9">
            FraudShield AI coordinates parallel specialist agents to cross-verify signatures,
            detect pixel-level tampering, and flag mathematical anomalies across your document pipeline.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-2.5 mb-10">
            <button
              onClick={scrollToSandbox}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#0F0F0E] text-white text-[13.5px] font-medium rounded-[9px] cursor-pointer hover:opacity-85 transition-opacity border-none"
            >
              <Play className="w-3.5 h-3.5" />
              Try the sandbox
            </button>
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#0F0F0E] text-[13.5px] font-medium rounded-[9px] cursor-pointer border border-black/15 hover:border-black/25 hover:bg-[#F7F6F3] transition-all"
            >
              Read the docs
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* trust badges */}
          <div className="flex flex-wrap items-center gap-6">
            {[
              { Icon: ShieldCheck, label: 'SOC 2 Type II' },
              { Icon: Lock,        label: 'GDPR compliant' },
              { Icon: Award,       label: 'ISO 27001 certified' },
            ].map(({ Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-[11.5px] font-medium text-[#8C8C86]">
                <Icon className="w-3.5 h-3.5" />
                {label}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Stats strip ──────────────────────────────────────────────────── */}
      <div className="bg-white border-y border-black/10">
        <div className="max-w-[960px] mx-auto px-8 py-7 grid grid-cols-2 md:grid-cols-4">
          {STATS.map((s, i) => (
            <StatItem key={i} {...s} border={i < STATS.length - 1} />
          ))}
        </div>
      </div>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section className="max-w-[960px] mx-auto w-full px-8 py-[72px]">
        <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#1A3CFF] mb-3">
          Forensic capabilities
        </div>
        <h2 className="text-[clamp(26px,3.5vw,38px)] font-normal leading-[1.12] tracking-[-0.03em] mb-3">
          Four pillars of{' '}
          <em className="font-['Instrument_Serif'] italic">document intelligence</em>
        </h2>
        <p className="text-[14px] text-[#4A4A45] leading-[1.7] max-w-[460px] mb-10">
          Complementary scanning protocols reconstruct evidence timelines and identify
          mathematical, visual, and electronic alterations.
        </p>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={{ visible: { transition: { staggerChildren: 0.08 } }, hidden: {} }}
          className="grid grid-cols-1 md:grid-cols-2 gap-px bg-black/10 border border-black/10 rounded-2xl overflow-hidden"
        >
          {FEATURES.map(({ Icon, title, desc }, idx) => (
            <motion.div
              key={idx}
              variants={{
                hidden:  { opacity: 0, y: 14 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
              }}
            >
              <FeatureCard Icon={Icon} title={title} desc={desc} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Process steps ────────────────────────────────────────────────── */}
      <section className="max-w-[960px] mx-auto w-full px-8 pb-[72px]">
        <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#1A3CFF] mb-3">
          How it works
        </div>
        <h2 className="text-[clamp(26px,3.5vw,38px)] font-normal leading-[1.12] tracking-[-0.03em] mb-10">
          <em className="font-['Instrument_Serif'] italic">Four steps</em> to a forensic verdict
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-black/10 border border-black/10 rounded-2xl overflow-hidden">
          {STEPS.map(s => (
            <StepCard key={s.num} {...s} />
          ))}
        </div>
      </section>

      {/* ── Sandbox ──────────────────────────────────────────────────────── */}
      <section id="sandbox" className="max-w-[960px] mx-auto w-full px-8 pb-[72px]">
        <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#1A3CFF] mb-3">
          Live demonstration
        </div>
        <h2 className="text-[clamp(26px,3.5vw,38px)] font-normal leading-[1.12] tracking-[-0.03em] mb-7">
          Try the <em className="font-['Instrument_Serif'] italic">forensic sandbox</em>
        </h2>
        <Sandbox />
      </section>

      {/* ── CTA band ─────────────────────────────────────────────────────── */}
      <div className="bg-[#0F0F0E] py-[60px]">
        <div className="max-w-[960px] mx-auto px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h2 className="text-[clamp(22px,3vw,34px)] font-normal tracking-[-0.03em] text-white leading-[1.2] mb-2">
              Ready to stop fraud{' '}
              <br className="hidden md:block" />
              at the{' '}
              <em className="font-['Instrument_Serif'] italic text-[#B0B8FF]">source?</em>
            </h2>
            <p className="text-[13.5px] text-white/50 leading-[1.6] max-w-[340px]">
              Join enterprise underwriting teams processing millions of documents monthly with confidence.
            </p>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="flex-shrink-0 px-5 py-2.5 bg-white text-[#0F0F0E] text-[13.5px] font-medium rounded-[9px] cursor-pointer hover:opacity-88 transition-opacity border-none"
          >
            View pricing →
          </button>
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <PublicFooter />
    </div>
  );
};

export default Landing;