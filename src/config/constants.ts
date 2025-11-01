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
  heading: 'Welcome to Hyperapex',
  subheading: 'Build amazing experiences with modern web technologies',
};

export const TYPEWRITER_CONFIG = {
  headingSpeed: 100,
  subheadingSpeed: 50,
  subheadingDelay: 500,
} as const;
