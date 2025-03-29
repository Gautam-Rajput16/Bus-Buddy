import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxSectionProps {
  children: React.ReactNode;
  offset?: number;
  className?: string;
}

const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  children,
  offset = 50,
  className = '',
}) => {
  const [elementTop, setElementTop] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  const { scrollY } = useScroll();

  const initial = elementTop - clientHeight;
  const final = elementTop + offset;

  const y = useTransform(scrollY, [initial, final], [offset, -offset]);

  useEffect(() => {
    if (!ref) return;
    
    const setValues = () => {
      setElementTop(ref.offsetTop);
      setClientHeight(window.innerHeight);
    };

    setValues();
    document.addEventListener('load', setValues);
    window.addEventListener('resize', setValues);

    return () => {
      document.removeEventListener('load', setValues);
      window.removeEventListener('resize', setValues);
    };
  }, [ref]);

  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div ref={setRef} className={`relative overflow-hidden ${className}`}>
      <motion.div
        style={prefersReducedMotion ? {} : { y }}
        transition={{ type: 'spring', stiffness: 50 }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default ParallaxSection;