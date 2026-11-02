"use client";

import { useState, useEffect } from "react";
import { searchRepertorio } from "@/lib/db/service";
import { Obra } from "@/types/sadaic";
import Link from "next/link";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"todos" | "titulo" | "autor" | "iswc">("todos");
  const [results, setResults] = useState<Obra[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const res = await searchRepertorio(query, filter);
      setResults(res);
      setIsSearching(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [query, filter, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-primary/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-2xl bg-surface-card rounded-2xl shadow-2xl border border-border-subtle overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Barra de búsqueda superior */}
        <div className="p-4 border-b border-border-subtle flex items-center gap-3 bg-surface-subtle/50">
          <span className="material-symbols-outlined text-secondary text-2xl">search</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por título, autor/compositor o código ISWC..."
            className="flex-1 bg-transparent text-text-primary text-base placeholder-text-muted focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-text-muted hover:text-text-primary p-1 text-sm rounded-md"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-1 bg-surface-card border border-border-subtle rounded text-xs text-text-muted">
            ESC
          </kbd>
        </div>

        {/* Filtros de búsqueda */}
        <div className="px-4 py-2.5 bg-surface-card border-b border-border-subtle flex items-center gap-2 overflow-x-auto text-xs font-medium">
          <span className="text-text-muted">Filtrar:</span>
          {(["todos", "titulo", "autor", "iswc"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full capitalize transition-all ${
                filter === f
                  ? "bg-secondary text-on-secondary shadow-sm"
                  : "bg-surface-container-low text-text-secondary hover:bg-surface-container"
              }`}
            >
              {f === "todos" ? "Todos los campos" : f === "titulo" ? "Título" : f === "autor" ? "Autor / Coautor" : "Código ISWC"}
            </button>
          ))}
        </div>

        {/* Resultados */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {isSearching ? (
            <div className="py-12 text-center text-text-muted">
              <span className="material-symbols-outlined animate-spin text-3xl text-secondary mb-2">progress_activity</span>
              <p className="text-sm">Buscando en catálogo nacional de obras...</p>
            </div>
          ) : results.length > 0 ? (
            results.map((obra) => (
              <div
                key={obra.id}
                className="p-3.5 rounded-xl border border-border-subtle hover:border-secondary hover:bg-surface-container-low/40 transition-all flex items-center justify-between gap-4 group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-on-secondary transition-colors shrink-0">
                    <span className="material-symbols-outlined text-xl">music_note</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary text-sm flex items-center gap-2">
                      {obra.titulo}
                      <span className="text-xs font-mono text-secondary bg-surface-container px-2 py-0.5 rounded">
                        {obra.iswc}
                      </span>
                    </h4>
                    <p className="text-xs text-text-secondary mt-0.5">
                      {obra.coautores.map((c) => c.nombre_completo).join(", ")} • {obra.genero} • {obra.duracion_formato}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center gap-1 text-[11px] text-status-success font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-status-success"></span>
                        {obra.estado_registro}
                      </span>
                      {obra.editorial && (
                        <span className="text-[11px] text-text-muted">
                          • {obra.editorial}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Link
                  href="/panel-socio"
                  onClick={onClose}
                  className="px-3 py-1.5 text-xs font-semibold text-secondary hover:bg-secondary/10 rounded-lg shrink-0 transition-colors"
                >
                  Ver Ficha →
                </Link>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-text-muted">
              <span className="material-symbols-outlined text-4xl mb-2 text-text-muted">search_off</span>
              <p className="text-sm">No se encontraron obras para los criterios ingresados.</p>
              <p className="text-xs mt-1 text-text-muted">Intentá con el título de la canción o el apellido del compositor.</p>
            </div>
          )}
        </div>

        {/* Footer del Modal */}
        <div className="p-3 bg-surface-subtle border-t border-border-subtle flex items-center justify-between text-xs text-text-muted">
          <span>Base de datos SADAIC • Interconexión CISAC WID</span>
          <button
            onClick={onClose}
            className="text-text-primary hover:text-secondary font-medium"
          >
            Cerrar ventana
          </button>
        </div>
      </div>
    </div>
  );
}
