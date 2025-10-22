'use client';

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

const ThemeProvider = dynamic(
  () => import('@/contexts/ThemeContext').then(mod => ({ default: mod.ThemeProvider })),
  {
    ssr: false,
    loading: () => <div style={{ visibility: 'hidden' }}>Loading...</div>
  }
);

interface NoSSRThemeProviderProps {
  children: ReactNode;
}

export default function NoSSRThemeProvider({ children }: NoSSRThemeProviderProps) {
  return <ThemeProvider>{children}</ThemeProvider>;
}