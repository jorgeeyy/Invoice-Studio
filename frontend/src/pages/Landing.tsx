import { Link } from 'react-router-dom';
import { 
  PlayCircle,
  CheckCircle,
  Users,
  Zap,
  Mail,
  Globe,
} from 'lucide-react';
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
    description: 'Create professional, pixel-perfect documents in seconds. Automated tax calculations and multi-currency support included.',
    image: '/images/feature-invoicing.png',
    hasImage: true,
  },
  {
    name: 'Revenue Tracking',
    description: 'Real-time financial analytics. Visualize your cash flow and forecast future earnings with high-precision charts.',
    image: '/images/feature-revenue.png',
    hasImage: true,
  },
  {
    name: 'Client Management',
    description: 'Centralized CRM for your freelance business. Track projects, contact history, and individual client billing cycles.',
    icon: Users,
    hasImage: false,
  },
  {
    name: 'Payment Automation',
    description: 'Integrated Stripe and Card payments. Set up automatic reminders and recurring billing with ease.',
    icon: Zap,
    hasImage: false,
  },
];

const pricingPlans = [
  {
    name: 'Starter',
    price: '$0',
    features: ['5 Invoices/month', 'Basic CRM', 'Revenue Tracking'],
    cta: 'Select Plan',
    popular: false,
  },
  {
    name: 'Professional',
    price: '$24',
    features: ['Unlimited Invoices', 'Advanced Analytics', 'Payment Automation', 'Custom Branding'],
    cta: 'Select Plan',
    popular: true,
  },
  {
    name: 'Agency',
    price: '$59',
    features: ['Multi-user Access', 'Team Analytics', 'White-label Solution'],
    cta: 'Select Plan',
    popular: false,
  },
];

const footerLinks = {
  Product: ['Invoicing', 'Reporting', 'CRM', 'Integrations'],
  Company: ['About Us', 'Careers', 'Press', 'Contact'],
  Resources: ['Blog', 'Documentation', 'Help Center', 'Security'],
};

export function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="bg-surface/80 backdrop-blur-md sticky top-0 z-50 border-b border-border-subtle">
        <div className="flex justify-between items-center w-full px-8 py-4 max-w-[1440px] mx-auto">
          <div className="flex items-center gap-8">
            <span className="text-xl font-bold text-primary tracking-tight font-headline">Freelance Pro</span>
            <div className="hidden md:flex items-center gap-6">
              <a className="text-sm font-bold text-secondary border-b-2 border-secondary pb-0.5" href="#features">Features</a>
              <a className="text-sm font-medium text-on-surface-variant hover:text-secondary transition-colors" href="#pricing">Pricing</a>
              <a className="text-sm font-medium text-on-surface-variant hover:text-secondary transition-colors" href="#about">About</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="px-4 py-2 text-sm font-medium text-primary hover:text-secondary transition-colors">Sign In</Link>
            <Link to="/signup" className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-80 transition-all">Get Started</Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden px-8">
          <div className="max-w-[1440px] mx-auto text-center mb-16">
            <h1 className="font-headline text-[48px] md:text-[64px] leading-tight mb-6 tracking-tighter max-w-4xl mx-auto">
              Professional invoicing, <br /><span className="text-secondary">built for builders.</span>
            </h1>
            <p className="text-lg text-on-surface-variant max-w-2xl mx-auto mb-10">
              Manage clients, track revenue, and get paid faster with systematic precision. The all-in-one financial toolkit designed for high-performance freelancers.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/signup" className="px-8 py-4 bg-primary text-white rounded-xl text-lg font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all">
                Get Started Free
              </Link>
              <button className="px-8 py-4 bg-surface-container-low border border-border-subtle rounded-xl text-lg font-semibold hover:bg-surface-container transition-all flex items-center justify-center gap-2">
                <PlayCircle className="w-5 h-5" />
                See in Action
              </button>
            </div>
          </div>
          
          {/* Dashboard Preview */}
          <div className="max-w-[1200px] mx-auto relative">
            <div className="bg-white border border-border-subtle rounded-2xl overflow-hidden shadow-xl" style={{ boxShadow: '0 0 80px -20px rgba(0, 81, 213, 0.15)' }}>
              <img 
                alt="Professional fintech dashboard in a modern home office" 
                className="w-full h-full object-cover" 
                src="/images/hero-dashboard.png" 
              />
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-12 border-y border-border-subtle bg-white">
          <div className="max-w-[1440px] mx-auto px-8">
            <p className="text-center text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-8">Trusted by 10,000+ top-tier freelancers</p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              <img className="h-6" src="/images/logo-vertex.png" alt="Vertex Design" />
              <img className="h-6" src="/images/logo-codestack.png" alt="CodeStack" />
              <img className="h-6" src="/images/logo-nova.png" alt="Nova Consulting" />
              <img className="h-6" src="/images/logo-byteflow.png" alt="Byteflow Solutions" />
              <img className="h-6" src="/images/logo-stellar.png" alt="Stellar Creative" />
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section id="features" className="py-24 px-8">
          <div className="max-w-[1440px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {features.map((feature) => (
                <div 
                  key={feature.name}
                  className="p-6 bg-white border border-border-subtle rounded-2xl flex flex-col gap-4 hover:border-secondary transition-all duration-200"
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  {feature.hasImage ? (
                    <div className="w-full h-32 mb-4 overflow-hidden rounded-lg">
                      <img alt={feature.name} className="w-full h-full object-cover" src={feature.image} />
                    </div>
                  ) : feature.icon ? (
                    <div className="w-12 h-12 bg-secondary/10 text-secondary flex items-center justify-center rounded-lg">
                      <feature.icon className="w-6 h-6" />
                    </div>
                  ) : null}
                  <div>
                    <h3 className="font-headline text-base font-semibold mb-2">{feature.name}</h3>
                    <p className="text-sm text-on-surface-variant">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Invoice Builder Feature */}
        <section className="py-24 bg-surface-container-low border-y border-border-subtle px-8">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-white rounded-2xl border border-border-subtle overflow-hidden shadow-sm">
                <div className="flex border-b border-border-subtle">
                  <div className="w-1/3 p-6 border-r border-border-subtle bg-surface">
                    <h4 className="text-xs font-bold text-on-surface-variant mb-6 uppercase tracking-wider">Editor</h4>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <div className="h-2 w-12 bg-outline-variant rounded"></div>
                        <div className="h-8 w-full bg-white border border-border-subtle rounded"></div>
                      </div>
                      <div className="space-y-1">
                        <div className="h-2 w-20 bg-outline-variant rounded"></div>
                        <div className="h-24 w-full bg-white border border-border-subtle rounded"></div>
                      </div>
                      <div className="space-y-1">
                        <div className="h-2 w-16 bg-outline-variant rounded"></div>
                        <div className="h-8 w-full bg-secondary text-white rounded flex items-center justify-center text-[10px]">Add Item</div>
                      </div>
                    </div>
                  </div>
                  <div className="w-2/3 p-8">
                    <div className="flex justify-between mb-12">
                      <div className="h-10 w-10 bg-primary/10 rounded"></div>
                      <div className="text-right">
                        <div className="h-4 w-24 bg-primary/10 rounded mb-1 ml-auto"></div>
                        <div className="h-3 w-16 bg-surface-container rounded ml-auto"></div>
                      </div>
                    </div>
                    <div className="space-y-4 mb-8">
                      <div className="flex justify-between border-b border-surface-container pb-2">
                        <div className="h-3 w-32 bg-surface-container rounded"></div>
                        <div className="h-3 w-12 bg-surface-container rounded"></div>
                      </div>
                      <div className="flex justify-between border-b border-surface-container pb-2">
                        <div className="h-3 w-40 bg-surface-container rounded"></div>
                        <div className="h-3 w-12 bg-surface-container rounded"></div>
                      </div>
                    </div>
                    <div className="flex justify-end pt-4">
                      <div className="text-right">
                        <div className="h-2 w-12 bg-outline-variant rounded ml-auto mb-1"></div>
                        <div className="h-6 w-24 bg-primary/20 rounded ml-auto"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="font-headline text-[40px] leading-tight mb-6">The Invoice Builder</h2>
              <p className="text-lg text-on-surface-variant mb-8">
                Experience our unique dual-pane builder. Edit your data on the left, watch your professional document update in real-time on the right. No guesswork, just precision.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-sm">
                  <CheckCircle className="w-5 h-5 text-status-paid flex-shrink-0" />
                  Dynamic live-preview with industrial-grade layouts.
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <CheckCircle className="w-5 h-5 text-status-paid flex-shrink-0" />
                  One-click export to PDF or direct secure link.
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <CheckCircle className="w-5 h-5 text-status-paid flex-shrink-0" />
                  Custom branding and color profile matching.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="py-24 px-8">
          <div className="max-w-[800px] mx-auto text-center">
            <span className="text-secondary text-4xl mb-6 block">"</span>
            <blockquote className="text-xl italic mb-8 text-primary">
              "Freelance Pro has completely streamlined my billing workflow. I used to spend hours every month chasing payments and manually calculating revenue. Now it's all automated, allowing me to focus entirely on building products for my clients."
            </blockquote>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-border-subtle">
                <img className="w-full h-full object-cover" src="/images/avatar-alex.png" alt="Alex Rivera" />
              </div>
              <p className="font-semibold text-primary">Alex Rivera</p>
              <p className="text-xs text-on-surface-variant uppercase tracking-widest">Senior Full-Stack Developer</p>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-24 bg-surface px-8">
          <div className="max-w-[1440px] mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-headline text-[40px] mb-4">Straightforward Pricing</h2>
              <p className="text-lg text-on-surface-variant">Choose the plan that fits your current business scale.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1100px] mx-auto">
              {pricingPlans.map((plan) => (
                <div 
                  key={plan.name}
                  className={`p-8 bg-white rounded-2xl flex flex-col relative ${
                    plan.popular ? 'border-2 border-secondary' : 'border border-border-subtle'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      Most Popular
                    </div>
                  )}
                  <h3 className="font-headline text-base font-semibold mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-[32px] font-bold">{plan.price}</span>
                    <span className="text-on-surface-variant text-sm">/month</span>
                  </div>
                  <ul className="space-y-4 mb-8 flex-grow">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-on-surface-variant">
                        <CheckCircle className={`w-4 h-4 ${plan.popular ? 'text-secondary' : ''}`} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-3 rounded-lg font-semibold text-sm transition-all ${
                    plan.popular 
                      ? 'bg-secondary text-white hover:opacity-90' 
                      : 'border border-primary hover:bg-primary hover:text-white'
                  }`}>
                    {plan.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-8 relative overflow-hidden bg-primary">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          </div>
          <div className="max-w-[1440px] mx-auto text-center relative z-10">
            <h2 className="font-headline text-[48px] md:text-[56px] text-white mb-8">Ready to get serious about your business?</h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto mb-12">
              Join thousands of professionals who have optimized their financial operations with Freelance Pro. Start your 14-day free trial today.
            </p>
            <Link to="/signup" className="inline-block px-12 py-5 bg-white text-primary rounded-xl text-lg font-semibold hover:scale-[1.05] active:scale-[0.98] transition-all shadow-lg">
              Join Freelance Pro
            </Link>
            <p className="mt-6 text-sm text-white/50">No credit card required. Cancel anytime.</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest border-t border-border-subtle">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-8 py-16 max-w-[1440px] mx-auto">
          <div className="col-span-1 md:col-span-1">
            <span className="text-base font-semibold text-primary mb-4 block font-headline">Freelance Pro</span>
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
        <div className="border-t border-border-subtle py-8 px-8 max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-on-surface-variant">© 2024 Freelance Pro. All rights reserved. Precision Fintech for the modern professional.</p>
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
