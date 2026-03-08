import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-base-black border-t-2 border-base-white/10">
      <div className="max-w-[120rem] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="font-heading text-3xl mb-4">
              <span className="text-accent-hot-pink">NEURAL</span>
              <span className="text-base-white">FUNNEL</span>
            </div>
            <p className="font-paragraph text-sm text-base-white/60 max-w-xs">
              Enterprise-grade growth analytics platform for data-driven decision making.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-heading text-xl mb-4 text-accent-bright-cyan">NAVIGATION</h3>
            <nav className="flex flex-col gap-3">
              <Link to="/" className="font-paragraph text-sm text-base-white/70 hover:text-accent-hot-pink transition-colors">
                Home
              </Link>
              <Link to="/dashboard" className="font-paragraph text-sm text-base-white/70 hover:text-accent-hot-pink transition-colors">
                Dashboard
              </Link>
              <Link to="/visualization" className="font-paragraph text-sm text-base-white/70 hover:text-accent-hot-pink transition-colors">
                Visualization
              </Link>
              <Link to="/reports" className="font-paragraph text-sm text-base-white/70 hover:text-accent-hot-pink transition-colors">
                Reports
              </Link>
            </nav>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-heading text-xl mb-4 text-accent-bright-cyan">CONNECT</h3>
            <div className="flex gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 border-2 border-base-white/20 flex items-center justify-center hover:border-accent-hot-pink hover:text-accent-hot-pink transition-colors"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 border-2 border-base-white/20 flex items-center justify-center hover:border-accent-hot-pink hover:text-accent-hot-pink transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 border-2 border-base-white/20 flex items-center justify-center hover:border-accent-hot-pink hover:text-accent-hot-pink transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t-2 border-base-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-paragraph text-sm text-base-white/50">
              © {currentYear} Neural Funnel. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#privacy" className="font-paragraph text-sm text-base-white/50 hover:text-accent-bright-cyan transition-colors">
                Privacy Policy
              </a>
              <a href="#terms" className="font-paragraph text-sm text-base-white/50 hover:text-accent-bright-cyan transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
