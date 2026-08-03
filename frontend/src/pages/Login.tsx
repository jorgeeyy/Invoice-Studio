import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Wallet } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login:', { email, password });
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
              <span className="font-headline text-2xl font-bold text-primary">Freelance Pro</span>
            </Link>
            <h2 className="mt-8 font-headline text-3xl font-bold tracking-tight text-primary">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-on-surface-variant">
              Not a member?{' '}
              <Link
                to="/signup"
                className="font-semibold text-secondary hover:underline"
              >
                Start a free trial
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  autoComplete="current-password"
                  required
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
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-border-subtle text-secondary focus:ring-secondary"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-on-surface-variant"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-semibold text-secondary hover:underline"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-all shadow-sm"
              >
                Sign in
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
            Manage your invoices with ease
          </h3>
          <p className="mt-4 text-on-surface-variant">
            Create professional invoices, track payments, and grow your business
            with our powerful invoicing platform.
          </p>
        </div>
      </div>
    </div>
  );
}
