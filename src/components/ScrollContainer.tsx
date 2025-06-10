'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Orb from './Orb';

interface ScrollContainerProps {
  children: React.ReactNode;
}

export const ScrollContainer: React.FC<ScrollContainerProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start', 'end']
  });

  // Transform values for content scaling and positioning
  const scale = useTransform(scrollYProgress, [0, 0.3], [0.1, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const blur = useTransform(scrollYProgress, [0, 0.3], [0, 10]);
  const orbOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight * 3); // 3 full scrolls
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: `${contentHeight}px` }}
    >
      <div className="fixed inset-0 w-full h-screen overflow-hidden">
        <motion.div
          style={{ opacity: orbOpacity }}
          className="absolute inset-0 z-0"
        >
          <Orb />
        </motion.div>

        <motion.div
          ref={contentRef}
          style={{
            scale,
            opacity,
            filter: `blur(${blur}px)`,
          }}
          className="absolute inset-0 z-10 flex items-center justify-center"
        >
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
};