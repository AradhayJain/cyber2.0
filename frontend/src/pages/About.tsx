import React from 'react';
import PublicNav from '../components/PublicNav';
import PublicFooter from '../components/PublicFooter';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F7F6F3] text-[#0F0F0E] font-sans flex flex-col">
      <PublicNav />
      <main className="flex-1 max-w-[960px] mx-auto w-full px-8 pt-20 pb-16">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#1A3CFF] mb-3">
            About FraudShield AI
          </div>
          <h1 className="text-[clamp(38px,5vw,58px)] font-normal leading-[1.07] tracking-[-0.035em] text-[#0F0F0E] mb-5">
            Built by <em className="font-['Instrument_Serif'] italic">security engineers.</em>
          </h1>
          <p className="text-[15px] text-[#4A4A45] leading-[1.65] max-w-[480px]">
            We are a team of data scientists and cybersecurity researchers committed to eliminating institutional fraud via bleeding-edge machine intelligence.
          </p>
        </motion.div>
      </main>
      <PublicFooter />
    </div>
  );
};

export default About;
