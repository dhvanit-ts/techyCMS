"use client"

import { ISection } from "@/types/ILink";
import fetcher from "@/utils/fetcher";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

type SocialLink = { label: string; href: string; icon?: React.ReactNode; ariaLabel?: string };

type FooterProps = {
  companyName?: string;
  logo?: React.ReactNode;
  section?: ISection;
  social?: SocialLink[];
  copyrightYear?: number;
  className?: string;
};

export function Footer({
  companyName = "Your Company",
  logo,
  section,
  social = [
    {
      label: "Twitter",
      href: "https://twitter.com/",
      ariaLabel: "Visit our Twitter (opens in a new tab)",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
          <path d="M22 5.8c-.6.3-1.2.5-1.9.6.7-.4 1.2-1.1 1.4-1.9-.6.4-1.3.7-2 .9-.6-.6-1.5-1-2.4-1C14.9 4 13 5.9 13 8.2c0 .4 0 .8.1 1.2C9 9.3 5.7 7.4 3.6 4.7c-.5.9-.3 2 .3 2.8-.5 0-1-.1-1.5-.4 0 1.4.9 2.6 2.2 3-.5 0-1 .1-1.4.1.4 1.4 1.6 2.4 3.1 2.4-1.1.9-2.6 1.5-4.1 1.5H3c1.5.9 3.3 1.4 5.1 1.4 6.1 0 9.4-5 9.4-9.4v-.4c.7-.5 1.3-1.2 1.7-2z" />
        </svg>
      ),
    },
  ],
  copyrightYear,
  className = "",
}: FooterProps) {
  const year = copyrightYear ?? new Date().getFullYear();
  const pathname = usePathname();

  const nav =
    section?.links
      .filter((link) => !link.parentId)
      .map((link) => ({
        title: link.label,
        items: (link.children || []).map((child) => ({
          label: child.label,
          href: child.href || "#",
          external: child.target === "_blank",
        })),
      })) || [];

  return (
    <footer className={`bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 ${className}`} aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand + Description + Newsletter */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              {logo ? (
                <div className="shrink-0">{logo}</div>
              ) : (
                <div className="w-10 h-10 rounded-md bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold">
                  {companyName.slice(0, 2).toUpperCase()}
                </div>
              )}
              <span className="text-lg font-semibold">{companyName}</span>
            </div>
            <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
              Build faster with components, patterns, and a tiny bit of judgement. Keep the UX consistent and accessible.
            </p>

            {/* Newsletter (client-side only stub) */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const target = e.target as HTMLFormElement & { email: { value: string } };
                const email = target.email.value;
                // TODO: wire to an API route (see notes). For now, optimistic message:
                alert(`Pretend-subscribed ${email}. Hook this to /api/subscribe`);
                target.reset();
              }}
              className="flex flex-col sm:flex-row gap-2 sm:items-center"
              aria-label="Subscribe to newsletter"
            >
              <label htmlFor="footer-email" className="sr-only">Email address</label>
              <input
                id="footer-email"
                name="email"
                type="email"
                required
                placeholder="Your email"
                className="min-w-0 w-full sm:w-auto px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-gray-500 dark:text-gray-400">We respect your privacy — no spam. Read our <Link className="underline" href="/privacy">privacy policy</Link>.</p>
          </div>

          {/* Navigation columns */}
          <nav aria-label="Footer navigation" className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-6">
            {nav.map((col) => (
              <div key={col.title}>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{col.title}</h3>
                <ul className="mt-4 space-y-2">
                  {col.items.map((item) => (
                    <li key={item.label}>
                      {item.external ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
                        >
                          {item.label}
                        </a>
                      ) : (
                        <Link href={item.href} className={`text-sm hover:underline ${pathname === item.href ? "font-semibold" : ""}`}>{item.label}</Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Divider */}
        <div className="mt-8 border-t border-gray-200 dark:border-gray-800" />

        {/* Bottom row */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">&copy; {year} {companyName}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-3">
              {social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label={s.ariaLabel ?? s.label}
                >
                  <span className="sr-only">{s.label}</span>
                  {s.icon ?? <DefaultExternalIcon />}
                </a>
              ))}
            </div>
            <Link href="/terms" className="text-sm hover:underline text-gray-600 dark:text-gray-400">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function DefaultExternalIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3z" />
      <path d="M5 5h5V3H3v7h2V5zM3 19h7v2H3v-7h2v5z" />
    </svg>
  );
}

function PublicFooter() {
  const [footer, setFooter] = useState<ISection | null>(null)

  useEffect(() => {
    (async () => {
      try {
        const res = await fetcher.get<{ data: ISection }>({
          endpointPath: '/sections/5edb327f-a0bc-4764-9362-5a414e91a4b6',
          returnNullIfError: true
        })

        const data = res.data
        console.log(data)
        setFooter(data);
      } catch (error) {
        console.log(error)
      }
    })()
  }, [])

  return (
    footer ? <Footer companyName="ICMS" section={footer} /> : null
  )
}

export default PublicFooter