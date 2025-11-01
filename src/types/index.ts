export interface NavLink {
  href: string;
  label: string;
}

export interface HeroContent {
  heading: string;
  subheading: string;
}

export interface ButtonProps {
  href?: string;
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}
