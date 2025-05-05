'use client';

import { motion } from 'framer-motion';

export const AnimatedGradient = () => {
  return (
    <motion.div
      className="fixed inset-0 -z-10 opacity-100"
      animate={{
        background: [
          'radial-gradient(circle,rgba(194, 83, 83, 1) 0%, rgba(119, 105, 3, 1) 9%, rgba(69, 15, 65, 1) 31%, rgba(0, 0, 0, 1) 72%, rgba(0, 0, 0, 1) 100%)',
          'radial-gradient(circle,rgba(0, 0, 0, 1) 0%, rgba(3, 27, 119, 1) 33%, rgba(0, 0, 0, 1) 42%, rgba(0, 0, 0, 1) 72%, rgba(0, 0, 0, 1) 100%)'
        ]
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'linear'
      }}
      style={{
        filter: 'blur(100px)'
      }}
    />
  );
};