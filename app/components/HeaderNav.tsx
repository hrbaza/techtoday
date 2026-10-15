"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import ThemeToggle from "./ThemeToggle";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Articles" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

// The sticky site header. `children` is the brand link, rendered on the
// server and passed in so the logo stays out of the client bundle.
export default function HeaderNav({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const nav = useRef<HTMLElement>(null);
  const indicator = useRef<HTMLSpanElement>(null);

  // Glides the highlight pill under a link, or fades it out. Positions are
  // written straight to the DOM so hovering never re-renders the header.
  const moveIndicator = useCallback((link: HTMLElement | null) => {
    const pill = indicator.current;
    if (!pill) return;
    if (link) {
      pill.style.width = `${link.offsetWidth}px`;
      pill.style.transform = `translateX(${link.offsetLeft}px)`;
      pill.style.opacity = "1";
    } else {
      pill.style.opacity = "0";
    }
    // The first placement snaps into place; later moves animate.
    if (!pill.dataset.ready) {
      requestAnimationFrame(() => {
        pill.dataset.ready = "true";
      });
    }
  }, []);

  const activeLink = useCallback(
    () => nav.current?.querySelector<HTMLElement>('a[aria-current="page"]') ?? null,
    [],
  );

  // Rest the pill on the current page's link (again once web fonts load,
  // since they change link widths) and keep it there on resize.
  useEffect(() => {
    const place = () => moveIndicator(activeLink());
    place();
    nav.current?.setAttribute("data-enhanced", "true");
    document.fonts?.ready.then(place);
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [pathname, moveIndicator, activeLink]);

  // A soft shadow under the header once the page is scrolled.
  useEffect(() => {
    const el = header.current;
    if (!el) return;
    const update = () => {
      el.dataset.scrolled = window.scrollY > 8 ? "true" : "false";
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header ref={header} className="site-header">
      <div className="container header-inner">
        {children}

        <nav
          ref={nav}
          className="nav-links"
          aria-label="Main navigation"
          onMouseLeave={() => moveIndicator(activeLink())}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
              moveIndicator(activeLink());
            }
          }}
        >
          <span ref={indicator} className="nav-indicator" aria-hidden="true" />
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(pathname, link.href) ? "page" : undefined}
              onMouseEnter={(event) => moveIndicator(event.currentTarget)}
              onFocus={(event) => moveIndicator(event.currentTarget)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <ThemeToggle />
          <button
            type="button"
            className="icon-btn menu-btn"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="burger" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      <div id="mobile-menu" className="mobile-menu" data-open={open}>
        <nav className="container" aria-label="Mobile navigation">
          <div className="mobile-menu-inner">
            {LINKS.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                style={{ "--i": index } as React.CSSProperties}
                tabIndex={open ? undefined : -1}
                onClick={() => setOpen(false)}
                aria-current={isActive(pathname, link.href) ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
