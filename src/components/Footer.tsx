import { Shield } from "lucide-react";

const platformLinks = [
  { label: "PREVENT", href: "#" },
  { label: "DETECT", href: "#" },
  { label: "RESPOND", href: "#" },
  { label: "HEAL", href: "#" },
  { label: "AI Analyst", href: "#" },
];

const productLinks = [
  { label: "NETWORK", href: "#" },
  { label: "EMAIL", href: "#" },
  { label: "ENDPOINT", href: "#" },
  { label: "CLOUD", href: "#" },
  { label: "OT", href: "#" },
  { label: "IDENTITY", href: "#" },
  { label: "SECURE AI", href: "#" },
];

export default function Footer() {
  return (
    <footer className="relative bg-surface">
      {/* Gradient top border */}
      <div className="h-px bg-gradient-to-r from-primary via-accent to-primary" />

      <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Branding */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold text-white">
                Darktrace ActiveAI Platform
              </span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-text-secondary">
              Self-learning AI that detects, responds to, and autonomously
              remediates cyber threats across your entire digital estate in
              real time.
            </p>
          </div>

          {/* Platform links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Platform
            </h3>
            <ul className="space-y-2">
              {platformLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-text-secondary transition-colors hover:text-accent"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Product links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Products
            </h3>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-text-secondary transition-colors hover:text-accent"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-surface-border pt-8 sm:flex-row">
          <p className="text-xs text-text-secondary">
            &copy; 2024 Darktrace Holdings Limited. All rights reserved.
          </p>
          <p className="text-xs text-text-secondary">
            Built with{" "}
            <span className="text-accent">Self-Learning AI</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
