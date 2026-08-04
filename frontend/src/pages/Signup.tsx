import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Wallet } from 'lucide-react';
import { signupSchema } from '@/lib/validations';

export function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const result = signupSchema.safeParse({ name, email, password, company: company || undefined });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    console.log('Signup:', result.data);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left side - Form */}
      <div className="flex flex-1 flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          <div>
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary flex items-center justify-center rounded">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <span className="font-headline text-2xl font-bold text-primary">Invoice Studio</span>
            </Link>
            <h2 className="mt-8 font-headline text-3xl font-bold tracking-tight text-primary">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-on-surface-variant">
              Already a member?{' '}
              <Link
                to="/login"
                className="font-semibold text-secondary hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-on-surface-variant mb-1"
              >
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-surface-container-low border border-border-subtle rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary/10 focus:border-secondary outline-none transition-all"
              />
              {errors.name && <p className="text-status-error text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-on-surface-variant mb-1"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-container-low border border-border-subtle rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary/10 focus:border-secondary outline-none transition-all"
              />
              {errors.email && <p className="text-status-error text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label
                htmlFor="company"
                className="block text-sm font-medium text-on-surface-variant mb-1"
              >
                Company name <span className="text-on-surface-variant/60">(optional)</span>
              </label>
              <input
                id="company"
                name="company"
                type="text"
                autoComplete="organization"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-surface-container-low border border-border-subtle rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary/10 focus:border-secondary outline-none transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-on-surface-variant mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-container-low border border-border-subtle rounded-lg px-4 py-2.5 pr-10 text-sm focus:ring-2 focus:ring-secondary/10 focus:border-secondary outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && <p className="text-status-error text-xs mt-1">{errors.password}</p>}
              <p className="mt-2 text-xs text-on-surface-variant">
                Must be at least 8 characters
              </p>
            </div>

            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 rounded border-border-subtle text-secondary focus:ring-secondary mt-0.5"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-on-surface-variant">
                I agree to the{' '}
                <a href="#" className="font-semibold text-secondary hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="font-semibold text-secondary hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-all shadow-sm"
              >
                Create account
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right side - Brand */}
      <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center bg-surface-container-low">
        <div className="mx-auto max-w-md px-8 text-center">
          <div className="w-20 h-20 bg-primary flex items-center justify-center rounded-2xl mx-auto">
            <Wallet className="w-12 h-12 text-white" />
          </div>
          <h3 className="mt-6 font-headline text-2xl font-bold text-primary">
            Start invoicing in minutes
          </h3>
          <p className="mt-4 text-on-surface-variant">
            Join thousands of freelancers and businesses who trust Invoice Studio
            to manage their invoicing.
          </p>
        </div>
      </div>
    </div>
  );
}
