import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-primary text-on-primary border-t border-primary-container pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-primary-container">
          {/* Columna Institucional */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-accent-cyan flex items-center justify-center text-white font-bold shadow-md">
                <span className="material-symbols-outlined text-2xl">graphic_eq</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline font-bold text-xl text-white tracking-tight">
                  SADAIC
                </span>
                <span className="text-xs text-primary-fixed-dim">
                  Sociedad Argentina de Autores y Compositores
                </span>
              </div>
            </div>
            <p className="text-sm text-on-primary-container max-w-sm leading-relaxed">
              Entidad de gestión colectiva sin fines de lucro, amparada por la Ley Nacional 11.723 y Decretos Reglamentarios. Defendemos el valor moral y patrimonial de las obras de música en toda la República Argentina.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container text-xs text-accent-cyan font-medium">
                <span className="material-symbols-outlined text-sm">shield</span>
                Miembro CISAC (París)
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container text-xs text-secondary-fixed font-medium">
                <span className="material-symbols-outlined text-sm">verified</span>
                Auditoría ISO 9001
              </span>
            </div>
          </div>

          {/* Columna Autores & Socios */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-secondary-fixed">
              Autores y Socios
            </h4>
            <ul className="space-y-2 text-sm text-on-primary-container">
              <li>
                <Link href="/panel-socio" className="hover:text-white transition-colors">
                  Consulta de Liquidaciones
                </Link>
              </li>
              <li>
                <Link href="/registro-obras" className="hover:text-white transition-colors">
                  Registro de Obras Digital
                </Link>
              </li>
              <li>
                <Link href="/autogestion" className="hover:text-white transition-colors">
                  Reclamos y Regalías
                </Link>
              </li>
              <li>
                <Link href="/panel-socio" className="hover:text-white transition-colors">
                  Planillas de Recitales
                </Link>
              </li>
              <li>
                <a href="#estatuto" className="hover:text-white transition-colors">
                  Estatuto Social SADAIC
                </a>
              </li>
            </ul>
          </div>

          {/* Columna Usuarios de Música */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-secondary-fixed">
              Usuarios y Aranceles
            </h4>
            <ul className="space-y-2 text-sm text-on-primary-container">
              <li>
                <Link href="/#aranceles" className="hover:text-white transition-colors">
                  Calculador de Aranceles
                </Link>
              </li>
              <li>
                <a href="#licencias" className="hover:text-white transition-colors">
                  Licencias de Streaming y Web
                </a>
              </li>
              <li>
                <a href="#comercios" className="hover:text-white transition-colors">
                  Comercios y Gastronomía
                </a>
              </li>
              <li>
                <a href="#eventos" className="hover:text-white transition-colors">
                  Festivales y Recitales Masivos
                </a>
              </li>
              <li>
                <a href="#pagos" className="hover:text-white transition-colors">
                  Medios de Pago Habilitados
                </a>
              </li>
            </ul>
          </div>

          {/* Columna Sede Central y Contacto */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-secondary-fixed">
              Sede Central
            </h4>
            <p className="text-sm text-on-primary-container leading-relaxed">
              Lavalle 1547 (C1048AAK)<br />
              Ciudad Autónoma de Buenos Aires<br />
              Argentina
            </p>
            <div className="text-sm text-on-primary-container space-y-1 pt-1">
              <p className="flex items-center gap-2">
                <span className="material-symbols-outlined text-accent-cyan text-base">call</span>
                (011) 4379-8600 / 8700
              </p>
              <p className="flex items-center gap-2">
                <span className="material-symbols-outlined text-accent-cyan text-base">mail</span>
                consultas@sadaic.org.ar
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-on-primary-container">
          <p>© 2026 SADAIC. Todos los derechos reservados. Registro Nacional de la Propiedad Intelectual.</p>
          <div className="flex items-center gap-6">
            <a href="#terminos" className="hover:text-white transition-colors">Términos y Condiciones</a>
            <a href="#privacidad" className="hover:text-white transition-colors">Protección de Datos Personales</a>
            <a href="#transparencia" className="hover:text-white transition-colors">Portal de Transparencia</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
