import { Link } from 'react-router-dom';
import {
  PlayCircle,
  Users,
  Zap,
  Mail,
  Globe,
  PenTool,
  Sun,
  Moon,
} from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { EditorAnimation } from '@/components/EditorAnimation';
import type { LucideIcon } from 'lucide-react';

const features: Array<{
  name: string;
  description: string;
  image?: string;
  hasImage: boolean;
  icon?: LucideIcon;
}> = [
  {
    name: 'Smart Invoicing',
    description: 'Create professional invoices in seconds with automated tax calculations, discounts, and multi-currency support.',
    image: '/images/feature-invoicing.png',
    hasImage: true,
  },
  {
    name: 'Invoice Templates',
    description: 'Choose from five polished templates — Minimal, Corporate, Modern, Agency, and Elegant — to match your brand.',
    image: '/images/feature-revenue.png',
    hasImage: true,
  },
  {
    name: 'Client Directory',
    description: 'Keep your clients organized in one place. Create, edit, and manage client details for faster invoicing.',
    icon: Users,
    hasImage: false,
  },
  {
    name: 'PDF Export',
    description: 'Download invoices as professional PDF files with print-ready formatting and your branding applied automatically.',
    icon: Zap,
    hasImage: false,
  },
];

const footerLinks = {
  Product: ['Invoicing', 'Reporting', 'CRM', 'Integrations'],
  Company: ['About Us', 'Careers', 'Press', 'Contact'],
  Resources: ['Blog', 'Documentation', 'Help Center', 'Security'],
};

export function Landing() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="bg-surface/80 backdrop-blur-md sticky top-0 z-50 border-b border-border-subtle">
        <div className="flex justify-between items-center w-full px-4 sm:px-8 py-4 max-w-[1440px] mx-auto">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-secondary flex items-center justify-center rounded-lg shadow-sm">
                <PenTool className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-primary tracking-tight font-headline whitespace-nowrap">Invoice Studio</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a className="text-sm font-bold text-secondary border-b-2 border-secondary pb-0.5" href="#features">Features</a>
              <a className="text-sm font-medium text-on-surface-variant hover:text-secondary transition-colors" href="#about">About</a>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant"
              title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <Link to="/login" className="hidden sm:inline px-4 py-2 text-sm font-medium text-primary hover:text-secondary transition-colors">Sign In</Link>
            <Link to="/signup" className="px-4 sm:px-6 py-2 bg-secondary text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all">Get Started</Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-20 sm:pt-28 pb-24 sm:pb-36 overflow-hidden px-4 sm:px-8">
          <div className="max-w-[1440px] mx-auto text-center mb-14 sm:mb-20 relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-secondary/20 bg-secondary/5 text-secondary text-xs font-semibold mb-8 tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              Now available — Ship invoices in seconds
            </div>

            <h1 className="font-headline text-[44px] sm:text-[56px] md:text-[72px] leading-[1.05] mb-7 tracking-tight max-w-5xl mx-auto">
              Invoicing that{' '}
              <span className="text-secondary">
                works as hard
              </span>{' '}
              as you do.
            </h1>
            <p className="text-lg sm:text-xl text-on-surface-variant max-w-2xl mx-auto mb-12 leading-relaxed">
              Create professional invoices with live previews, download as PDF, and manage clients and products — all in one clean, fast interface.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 px-2">
              <Link
                to="/signup"
                className="group relative px-10 py-4 bg-secondary text-white rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span className="relative z-10">Get Started Free</span>
              </Link>
              <a
                href="#about"
                className="px-10 py-4 bg-surface-container-low border border-border-subtle rounded-xl text-lg font-semibold hover:bg-surface-container hover:border-secondary/30 transition-all flex items-center justify-center gap-2"
              >
                <PlayCircle className="w-5 h-5 text-secondary" />
                See in Action
              </a>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section id="features" className="py-20 sm:py-28 px-4 sm:px-8">
          <div className="max-w-[1440px] mx-auto">
            <div className="text-center mb-14">
              <h2 className="font-headline text-3xl sm:text-[40px] mb-4">Everything you need to invoice professionally</h2>
              <p className="text-lg text-on-surface-variant max-w-xl mx-auto">Create, manage, and download invoices — with a clean interface that stays out of your way.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {features.map((feature) => (
                <div
                  key={feature.name}
                  className="group p-6 bg-surface-container-lowest border border-border-subtle rounded-2xl flex flex-col gap-4 hover:border-secondary/40 hover:shadow-lg hover:shadow-secondary/5 transition-all duration-300"
                >
                  {feature.hasImage ? (
                    <div className="w-full h-32 mb-2 overflow-hidden rounded-lg">
                      <img alt={feature.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={feature.image} />
                    </div>
                  ) : feature.icon ? (
                    <div className="w-12 h-12 bg-secondary/10 text-secondary flex items-center justify-center rounded-xl">
                      <feature.icon className="w-6 h-6" />
                    </div>
                  ) : null}
                  <div>
                    <h3 className="font-headline text-base font-semibold mb-2">{feature.name}</h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Invoice Builder Feature */}
        <section id="about" className="py-20 sm:py-28 bg-surface-container-low border-y border-border-subtle px-4 sm:px-8">
          <div className="max-w-[1440px] mx-auto">
            <div className="text-center mb-12">
              <span className="text-secondary text-xs font-bold uppercase tracking-widest mb-4 block">Live Preview</span>
              <h2 className="font-headline text-[40px] sm:text-[48px] leading-tight mb-4">The Invoice Builder</h2>
              <p className="text-lg text-on-surface-variant max-w-xl mx-auto">
                Edit your data on the left, watch your professional document update in real-time on the right. No guesswork, just precision.
              </p>
            </div>
            <EditorAnimation />
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest border-t border-border-subtle">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 gap-y-12 px-4 sm:px-8 py-12 sm:py-16 max-w-[1440px] mx-auto">
          <div className="col-span-1 md:col-span-1">
            <span className="text-base font-semibold text-primary mb-4 block font-headline">Invoice Studio</span>
            <p className="text-sm text-on-surface-variant mb-6">
              Precision Fintech for the modern professional. Building the future of freelance financial infrastructure.
            </p>
            <div className="flex gap-4">
              <a className="text-on-surface-variant hover:text-secondary" href="#"><Mail className="w-5 h-5" /></a>
              <a className="text-on-surface-variant hover:text-secondary" href="#"><Globe className="w-5 h-5" /></a>
            </div>
          </div>
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-headline text-base font-semibold mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a className="text-sm text-on-surface-variant hover:underline hover:text-secondary decoration-secondary" href="#">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-border-subtle py-8 px-4 sm:px-8 max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-on-surface-variant">© 2024 Invoice Studio. All rights reserved. Precision Fintech for the modern professional.</p>
          <div className="flex gap-6">
            <a className="text-sm text-on-surface-variant hover:text-primary" href="#">Legal</a>
            <a className="text-sm text-on-surface-variant hover:text-primary" href="#">Privacy Policy</a>
            <a className="text-sm text-on-surface-variant hover:text-primary" href="#">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}