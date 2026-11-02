"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import SearchModal from "@/components/SearchModal";

export default function Header() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Inicio", href: "/" },
    { name: "Autogestión de Socios", href: "/autogestion" },
    { name: "Panel de Socio", href: "/panel-socio" },
    { name: "Registro de Obras", href: "/registro-obras" },
    { name: "Consulta de Repertorio", href: "/#repertorio" },
    { name: "Trámites y Aranceles", href: "/#aranceles" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-40 bg-surface/95 backdrop-blur-md border-b border-border-subtle shadow-sm">
        {/* Banner Institucional Superior */}
        <div className="bg-primary-container text-on-primary-container px-4 sm:px-8 py-1.5 text-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
              <span className="material-symbols-outlined text-accent-cyan text-base shrink-0">info</span>
              <span className="truncate">
                Liquidación Trimestral en Curso: Consulte su estado de cuenta y comprobantes fiscales
              </span>
            </div>
            <Link
              href="/panel-socio"
              className="text-accent-cyan hover:underline hidden sm:inline-flex items-center gap-1 font-semibold shrink-0"
            >
              Consultar Liquidación →
            </Link>
          </div>
        </div>

        {/* Barra de Navegación Principal */}
        <div className="h-20 max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between gap-4">
          {/* Logo SADAIC */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold shadow-md group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-2xl">graphic_eq</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline font-bold text-xl text-on-surface leading-tight tracking-tight">
                SADAIC
              </span>
              <span className="text-[11px] text-text-secondary hidden md:block">
                Sociedad Argentina de Autores y Compositores
              </span>
            </div>
          </Link>

          {/* Navegación Desktop */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-surface-container-high text-on-surface font-semibold shadow-xs"
                      : "text-text-secondary hover:text-on-surface hover:bg-surface-container-low"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Acciones del Header */}
          <div className="flex items-center gap-3">
            {/* Buscador Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              type="button"
              className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-container-low text-text-secondary hover:bg-surface-container hover:text-on-surface transition-all text-xs border border-border-subtle"
            >
              <span className="material-symbols-outlined text-base">search</span>
              <span>Buscar repertorio</span>
              <kbd className="bg-surface-card px-1.5 py-0.5 rounded text-[10px] text-text-muted shadow-2xs border border-border-subtle">
                ⌘K
              </kbd>
            </button>

            {/* Portal de Autores Direct Link */}
            <Link
              href="/panel-socio"
              className="inline-flex items-center gap-2 bg-primary text-on-primary hover:bg-primary-container hover:text-primary-fixed px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all shadow-xs"
            >
              <span className="material-symbols-outlined text-base">lock</span>
              <span className="hidden sm:inline">Portal de Autores</span>
              <span className="sm:hidden">Portal</span>
            </Link>

            {/* Avatar Socio Conectado */}
            <Link
              href="/panel-socio"
              title="Gustavo Cerati (Socio Activo)"
              className="relative p-0.5 rounded-full ring-2 ring-secondary/30 hover:ring-secondary transition-all"
            >
              <div className="w-9 h-9 rounded-full bg-secondary/15 flex items-center justify-center font-bold text-secondary text-sm">
                GC
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-status-success ring-2 ring-white"></span>
            </Link>

            {/* Botón Menú Mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-text-secondary hover:bg-surface-container"
              aria-label="Menú principal"
            >
              <span className="material-symbols-outlined text-2xl">
                {isMobileMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>

        {/* Menú Mobile Desplegable */}
        {isMobileMenuOpen && (
          <div className="xl:hidden bg-surface-card border-b border-border-subtle px-4 py-4 space-y-2 shadow-lg animate-fade-in">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsSearchOpen(true);
              }}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-surface-container-low text-text-secondary text-sm"
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">search</span>
                Buscar en catálogo...
              </span>
              <kbd className="px-2 py-0.5 rounded bg-surface-card text-xs">⌘K</kbd>
            </button>
            <div className="pt-2 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${
                    pathname === link.href
                      ? "bg-secondary text-white"
                      : "text-text-primary hover:bg-surface-container-low"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Modal de búsqueda universal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
