import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface WordProps {
  children: string;
  progress: any;
  range: [number, number];
  isHighlight?: boolean;
}

const Word = ({ children, progress, range, isHighlight }: WordProps) => {
  const opacity = useTransform(progress, range, [0, 1]);
  const y = useTransform(progress, range, [4, 0]);

  return (
    <span className="relative inline-block mr-2.5 my-1 font-heading font-bold">
      {/* Dim Base / Ghost Word (Guarantees High Legibility on Cream Background) */}
      <span className="text-[#BFB8AB]/50 select-none">
        {children}
      </span>

      {/* Progressively Illuminated Foreground Word */}
      <motion.span
        style={{ opacity, y }}
        className={`absolute inset-0 select-text ${
          isHighlight
            ? 'text-[#D8A7B1] italic font-serif'
            : 'text-[#121110]'
        }`}
      >
        {children}
      </motion.span>
    </span>
  );
};

export const ScrollTextReveal = ({ text }: { text: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.80', 'start 0.25']
  });

  const words = text.split(' ');
  const highlightWords = ['radiant,', 'timeless', 'botanical', 'beauty.', 'harmony.'];

  return (
    <div ref={containerRef} className="max-w-5xl mx-auto py-20 px-4 sm:px-6 lg:px-8 text-center">
      <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white border border-[#D8D2C8] rounded-full shadow-2xs text-[11px] font-bold uppercase tracking-widest text-rose-gold mb-8">
        <Sparkles size={12} /> Brand Philosophy
      </div>

      <div className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.35] max-w-4xl mx-auto">
        {words.map((word, i) => {
          const start = i / words.length;
          const end = start + 1 / words.length;
          const isHighlight = highlightWords.some(
            (hw) => word.toLowerCase() === hw.toLowerCase()
          );

          return (
            <Word
              key={i}
              progress={scrollYProgress}
              range={[start, end]}
              isHighlight={isHighlight}
            >
              {word}
            </Word>
          );
        })}
      </div>

      <div className="pt-8 flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-[#57534E]">
        <span className="w-8 h-[1px] bg-rose-gold inline-block" />
        <span>Cosmalac Formulation Ethos</span>
        <span className="w-8 h-[1px] bg-rose-gold inline-block" />
      </div>
    </div>
  );
};

export default ScrollTextReveal;
