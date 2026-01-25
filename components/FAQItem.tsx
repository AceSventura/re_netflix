'use client';
import { useState } from 'react';

export const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-2 w-full max-w-4xl mx-auto">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between w-full p-6 bg-[#2d2d2d] hover:bg-[#414141] text-left text-2xl"
      >
        <span>{question}</span>
        <span>{isOpen ? '✕' : '＋'}</span>
      </button>
      {isOpen && (
        <div className="p-6 bg-[#2d2d2d] mt-px text-2xl leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
};