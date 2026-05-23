import React from 'react';

const GridBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Cyber Grid Background */}
      <div className="absolute inset-0 cyber-grid opacity-60 animate-grid-fade" />
      
      {/* Ambient Gradient Glows */}
      <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] radial-glow-1 pointer-events-none" />
      <div className="absolute top-[40%] -right-[15%] w-[60%] h-[60%] radial-glow-2 pointer-events-none" />
      <div className="absolute -bottom-[10%] left-[20%] w-[55%] h-[55%] radial-glow-3 pointer-events-none" />
      
      {/* Subtle bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-slate-50/50 to-transparent pointer-events-none" />
    </div>
  );
};

export default GridBackground;
