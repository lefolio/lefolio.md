'use client';

import Link from 'next/link';
import { useEffect, useId, useState } from 'react';
import { usePathname } from 'next/navigation';
import type { ContentManifest } from '@lefolio/engine/template';
import BrandName from './BrandName';

function isActive(pathname: string, href: string) {
  const normalized = href.replace(/\/$/, '') || '/';
  const current = pathname.replace(/\/$/, '') || '/';
  if (normalized === '/') return current === '/';
  return current === normalized || current.startsWith(`${normalized}/`);
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

interface NavbarProps {
  manifest: ContentManifest;
}

export default function Navbar({ manifest }: NavbarProps) {
  const pathname = usePathname();
  const menuId = useId();
  const [menuOpen, setMenuOpen] = useState(false);
  const { config, navigation } = manifest;
  const siteTitle = config.site.title;
  const github =
    config.author?.links?.github || 'https://github.com/lefolio/lefolio.md';

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const links = navigation.map((item) => {
    const active = isActive(pathname, item.href);
    const className = active ? 'showcase-nav showcase-nav-active' : 'showcase-nav';
    if (item.type === 'external' || /^(https?:|mailto:|tel:)/i.test(item.href)) {
      return (
        <a
          key={`${item.label}-${item.href}`}
          href={item.href}
          className={className}
          target="_blank"
          rel="noopener noreferrer"
          onClick={closeMenu}
        >
          {item.label}
        </a>
      );
    }
    return (
      <Link
        key={`${item.label}-${item.href}`}
        href={item.href}
        className={className}
        onClick={closeMenu}
      >
        {item.label}
      </Link>
    );
  });

  return (
    <header className={`showcase-header sticky top-0 z-50 border-b backdrop-blur${menuOpen ? ' is-open' : ''}`}>
      <div className="showcase-container showcase-header-inner">
        <Link href="/" className="showcase-brand flex items-center gap-3 no-underline" onClick={closeMenu}>
          <BrandName name={siteTitle} className="showcase-brand-name--nav" />
        </Link>

        <button
          type="button"
          className="showcase-nav-toggle"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>

        <nav
          id={menuId}
          className={`showcase-nav-panel${menuOpen ? ' is-open' : ''}`}
          aria-label="Main"
        >
          <div className="showcase-nav-links">{links}</div>
          <a
            href={github}
            className="showcase-cta-secondary showcase-nav-github"
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
