'use client';

import NoSSRThemeProvider from './NoSSRThemeProvider';

export default function ClientThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NoSSRThemeProvider>{children}</NoSSRThemeProvider>;
}