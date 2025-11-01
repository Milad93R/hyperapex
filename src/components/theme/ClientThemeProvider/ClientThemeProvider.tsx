'use client';

import { NoSSRThemeProvider } from '../NoSSRThemeProvider';

export function ClientThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NoSSRThemeProvider>{children}</NoSSRThemeProvider>;
}
