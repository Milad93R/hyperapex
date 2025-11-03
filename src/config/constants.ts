import { NavLink, HeroContent } from '@/types';

export const SITE_CONFIG = {
  name: 'Hyperapex',
  title: 'Hyperapex - Next.js Full-Stack Application',
  description: 'A modern full-stack application built with Next.js 15',
} as const;

export const NAV_LINKS: NavLink[] = [
  { href: '#home', label: 'Home' },
  { href: '#features', label: 'Features' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
];

export const HERO_CONTENT: HeroContent = {
  heading: `Welcome to ${SITE_CONFIG.name}`,
  subheading: 'Build amazing experiences with modern web technologies',
};

/**
 * Allowed email addresses for dashboard access
 * Only users with these email addresses can access the dashboard
 * If empty array, all authenticated users can access the dashboard
 * Reads from environment variable: ALLOWED_DASHBOARD_EMAILS (comma-separated)
 */
export const getAllowedDashboardEmails = (): string[] => {
  const envEmails = process.env.NEXT_PUBLIC_ALLOWED_DASHBOARD_EMAILS;
  
  if (!envEmails || envEmails.trim() === '') {
    return []; // Empty array means all emails are allowed
  }
  
  // Split by comma and filter out empty strings
  return envEmails
    .split(',')
    .map(email => email.trim())
    .filter(email => email.length > 0);
};

export const ALLOWED_DASHBOARD_EMAILS: string[] = getAllowedDashboardEmails();

export const TYPEWRITER_CONFIG = {
  headingSpeed: 100,
  subheadingSpeed: 50,
  subheadingDelay: 500,
} as const;
