import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

const PublicNav: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-[#F7F6F3]/90 backdrop-blur-md border-b border-black/10 px-8 h-[58px] flex items-center justify-between">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
        <div className="w-[30px] h-[30px] bg-[#0F0F0E] rounded-[7px] flex items-center justify-center">
          <ShieldCheck className="w-4 h-4 text-white" />
        </div>
        <span className="text-[13px] font-semibold tracking-tight">FraudShield AI</span>
      </div>

      <div className="flex items-center gap-1">
        {['Platform', 'Pricing', 'Docs', 'About'].map(label => (
          <button
            key={label}
            onClick={() => navigate(`/${label.toLowerCase()}`)}
            className="px-3.5 py-1.5 text-[13px] font-medium text-[#4A4A45] hover:bg-black/5 hover:text-[#0F0F0E] rounded-lg transition-all cursor-pointer border-none bg-transparent"
          >
            {label}
          </button>
        ))}
      </div>

      <button
        onClick={() => navigate('/login')}
        className="px-4 py-[7px] bg-[#0F0F0E] text-white text-[13px] font-medium rounded-[9px] cursor-pointer hover:opacity-85 transition-opacity border-none"
      >
        Request demo
      </button>
    </header>
  );
};

export default PublicNav;
