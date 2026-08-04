import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, PenTool, Sun, Moon } from 'lucide-react';
import { loginSchema } from '@/lib/validations';
import { useTheme } from '@/components/ThemeProvider';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { theme, toggleTheme } = useTheme();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    console.log('Login:', result.data);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left side - Form */}
      <div className="flex flex-1 flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center rounded-xl shadow-md">
                <PenTool className="w-6 h-6 text-white" />
              </div>
              <span className="font-headline text-2xl font-bold text-primary">Invoice Studio</span>
            </Link>
            <button
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant"
              title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
          </div>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-container-low border border-border-subtle rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary/10 focus:border-secondary outline-none transition-all"
              />
              {errors.email && <p className="text-status-error text-xs mt-1">{errors.email}</p>}
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
                className="w-full bg-secondary text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-all shadow-sm"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right side - Brand */}
      <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center bg-gradient-to-br from-secondary/10 via-surface to-secondary/5">
        <div className="mx-auto max-w-md px-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center rounded-2xl mx-auto shadow-lg">
            <PenTool className="w-10 h-10 text-white" />
          </div>
          <h3 className="mt-6 font-headline text-2xl font-bold text-primary">
            Create invoices that impress
          </h3>
          <p className="mt-4 text-on-surface-variant">
            Design beautiful, professional invoices with our intuitive studio tools. 
            Your clients will love the experience.
          </p>
        </div>
      </div>
    </div>
  );
}
