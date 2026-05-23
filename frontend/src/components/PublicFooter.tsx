import React from 'react';
import { ShieldCheck } from 'lucide-react';

const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-white border-t border-black/10 py-7 mt-auto">
      <div className="max-w-[960px] mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[12.5px] text-[#8C8C86]">
          <ShieldCheck className="w-3.5 h-3.5" />
          FraudShield AI © 2026
        </div>
        <div className="flex items-center gap-5">
          {['Privacy', 'Terms', 'Docs', 'About'].map(label => (
            <button
              key={label}
              className="text-[12.5px] text-[#8C8C86] hover:text-[#4A4A45] transition-colors cursor-pointer border-none bg-transparent font-['DM_Sans']"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
