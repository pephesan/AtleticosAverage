// src/components/PlayerCardHover.tsx
'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export function PlayerCardHover({ children }: { children: ReactNode }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {children}
    </motion.div>
  );
}