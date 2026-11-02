"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { searchRepertorio, calcularArancelEstimado, getNoticiasInstitucionales, getFiliales } from "@/lib/db/service";
import { Obra, NoticiaInstitucional, FilialSADAIC, ArancelCalculo } from "@/types/sadaic";

export default function HomePage() {
  // Buscador de repertorio en vivo en Home
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState<"todos" | "titulo" | "autor" | "iswc">("todos");
  const [obrasResult, setObrasResult] = useState<Obra[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Calculadora interactiva de aranceles
  const [calcTipo, setCalcTipo] = useState<"fiesta_privada" | "recital_vivo" | "bar_restaurante" | "streaming_live">("fiesta_privada");
  const [calcCapacidad, setCalcCapacidad] = useState<number>(120);
  const [calcPrecioEntrada, setCalcPrecioEntrada] = useState<number>(4500);
  const [calcResultado, setCalcResultado] = useState<ArancelCalculo | null>(null);

  // Noticias y filiales
  const [noticias, setNoticias] = useState<NoticiaInstitucional[]>([]);
  const [filiales, setFiliales] = useState<FilialSADAIC[]>([]);

  useEffect(() => {
    getNoticiasInstitucionales().then(setNoticias);
    getFiliales().then(setFiliales);
    searchRepertorio("", "todos").then(setObrasResult);
  }, []);

  // Recalcular búsqueda al escribir
  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(async () => {
      const res = await searchRepertorio(query, filterType);
      setObrasResult(res);
      setIsSearching(false);
    }, 250);
    return () => clearTimeout(timer);
  }, [query, filterType]);

  // Recalcular aranceles al cambiar parámetros
  useEffect(() => {
    calcularArancelEstimado({
      tipo_evento: calcTipo,
      capacidad: calcCapacidad,
      precioEntrada: calcTipo === "recital_vivo" || calcTipo === "streaming_live" ? calcPrecioEntrada : undefined,
    }).then(setCalcResultado);
  }, [calcTipo, calcCapacidad, calcPrecioEntrada]);

  return (
    <>
      <Header />

      <main className="w-full pt-28 bg-surface min-h-screen flex flex-col">
        {/* =========================================
            HERO SECTION CON MONITOR INSTITUCIONAL
           ========================================= */}
        <section className="relative w-full bg-primary-container text-on-primary overflow-hidden pb-20 pt-10">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-secondary opacity-25 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-accent-cyan opacity-15 blur-3xl pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
            {/* Pill de confianza institucional */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-high/20 backdrop-blur-md text-surface-container text-xs font-semibold tracking-wide border border-white/10">
                <span className="material-symbols-outlined text-status-warning text-sm">verified</span>
                Ley Nacional 11.723 • Más de 88 años protegiendo el patrimonio musical argentino
              </span>
              <span className="inline-flex items-center gap-2 text-accent-cyan text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-status-success animate-pulse"></span>
                Sistemas en Línea Operativos
              </span>
            </div>

            {/* Grid Asimétrico Hero */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 flex flex-col gap-6">
                <div className="space-y-3">
                  <p className="text-accent-cyan text-xs sm:text-sm font-bold tracking-widest uppercase">
                    Sociedad de Gestión Colectiva de Argentina
                  </p>
                  <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
                    Protegemos, administramos y valorizamos la música de nuestros autores y compositores
                  </h1>
                </div>

                <p className="text-base sm:text-lg text-primary-fixed-dim max-w-2xl leading-relaxed">
                  Gestión colectiva de derechos de autor con transparencia institucional comprobada, liquidaciones en tiempo real y trámites 100% digitales para autores y compositores de todo el país.
                </p>

                {/* Botones de acción principal */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href="/panel-socio"
                    className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base shadow-lg transition-all transform hover:-translate-y-0.5"
                  >
                    <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
                    <span>Portal Socios / Autogestión</span>
                  </Link>

                  <Link
                    href="/registro-obras"
                    className="inline-flex items-center gap-2 bg-surface-card text-text-primary hover:bg-surface-subtle px-5 py-3.5 rounded-xl font-semibold text-sm sm:text-base shadow-md transition-all"
                  >
                    <span className="material-symbols-outlined text-secondary text-xl">music_note</span>
                    <span>Registrar Nueva Obra</span>
                  </Link>

                  <a
                    href="#aranceles"
                    className="inline-flex items-center gap-2 text-white hover:text-accent-cyan px-4 py-3.5 font-semibold text-sm transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">calculate</span>
                    <span>Calcular Arancel Evento →</span>
                  </a>
                </div>

                {/* Micro-badges de garantía */}
                <div className="flex flex-wrap items-center gap-6 pt-4 text-on-primary-container text-xs font-medium border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-accent-cyan text-base">security</span>
                    <span>Encriptación Bancaria y Firma Digital</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-accent-cyan text-base">sync</span>
                    <span>Interconexión Internacional CISAC</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-accent-cyan text-base">domain</span>
                    <span>42 Filiales en Argentina</span>
                  </div>
                </div>
              </div>

              {/* Monitor Institucional en Vivo (Tarjeta interactiva) */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl bg-surface-card text-text-primary p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-border-subtle">
                  {/* Barra decorativa superior */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-secondary via-accent-cyan to-status-warning"></div>

                  <div className="flex items-center justify-between pb-4 mb-5 border-b border-border-subtle">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-status-success animate-ping"></span>
                      <span className="font-semibold text-xs tracking-wider uppercase text-text-primary">
                        Monitor Institucional Q3
                      </span>
                    </div>
                    <span className="text-xs bg-surface-container-high px-2.5 py-1 rounded-full text-secondary font-bold">
                      Septiembre 2025
                    </span>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="text-xs font-medium text-text-secondary">Liquidación Período Vigente</span>
                        <span className="text-xs text-status-success font-semibold flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">trending_up</span> En distribución
                        </span>
                      </div>
                      <div className="text-3xl sm:text-4xl font-headline font-extrabold text-text-primary tracking-tight">
                        $ 4.280.910.450
                      </div>
                      <div className="w-full bg-surface-subtle h-2.5 rounded-full overflow-hidden mt-3">
                        <div className="bg-secondary h-full rounded-full w-4/5 transition-all duration-1000"></div>
                      </div>
                      <p className="text-xs text-text-secondary mt-1.5">
                        82% de fondos ya acreditados en cuentas de autores
                      </p>
                    </div>

                    <div className="bg-surface-subtle rounded-xl p-4 space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-text-secondary">Obras Registradas este año</span>
                        <span className="font-bold text-text-primary">+46.320 obras</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-text-secondary">Autores beneficiados</span>
                        <span className="font-bold text-text-primary">32.840 socios</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-text-secondary">Cruces Streaming Procesados</span>
                        <span className="font-bold text-secondary">2.8B reproducciones</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Link
                        href="/panel-socio"
                        className="w-full py-2.5 px-4 bg-primary text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 hover:bg-primary-container transition-colors"
                      >
                        <span className="material-symbols-outlined text-base">receipt_long</span>
                        Ver Detalle de Mi Liquidación
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            SERVICIOS TRONCALES SADAIC
           ========================================= */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-8 w-full">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-secondary">Ecosistema Integral</span>
            <h2 className="text-2xl sm:text-3xl font-headline font-bold text-text-primary mt-1">
              Servicios Digitales para Autores, Compositores y Productores
            </h2>
            <p className="text-sm sm:text-base text-text-secondary mt-2">
              Plataforma modernizada para realizar todos tus trámites sin intermediarios, con firma electrónica y trazabilidad total.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Autogestión */}
            <div className="bg-surface-card rounded-2xl p-7 border border-border-subtle shadow-sm hover:shadow-md hover:border-secondary transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-secondary mb-5 group-hover:bg-secondary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-2xl">manage_accounts</span>
                </div>
                <h3 className="font-headline font-bold text-lg text-text-primary mb-2">
                  Portal de Autogestión de Socios
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-4">
                  Consultá tus estados de cuenta, liquidaciones periódicas, retenciones impositivas AFIP y emití reclamos por regalías no percibidas.
                </p>
              </div>
              <Link
                href="/autogestion"
                className="inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:text-primary transition-colors"
              >
                Ingresar a Autogestión →
              </Link>
            </div>

            {/* Card 2: Registro de Obras */}
            <div className="bg-surface-card rounded-2xl p-7 border border-border-subtle shadow-sm hover:shadow-md hover:border-secondary transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-secondary mb-5 group-hover:bg-secondary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-2xl">library_music</span>
                </div>
                <h3 className="font-headline font-bold text-lg text-text-primary mb-2">
                  Registro 100% Digital de Obras
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-4">
                  Declaración online de temas inéditos o editados. Carga de partituras, audios, porcentaje de coautorías y emisión instantánea de código ISWC.
                </p>
              </div>
              <Link
                href="/registro-obras"
                className="inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:text-primary transition-colors"
              >
                Declarar Nueva Canción →
              </Link>
            </div>

            {/* Card 3: Aranceles y Usuarios */}
            <div className="bg-surface-card rounded-2xl p-7 border border-border-subtle shadow-sm hover:shadow-md hover:border-secondary transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-secondary mb-5 group-hover:bg-secondary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-2xl">point_of_sale</span>
                </div>
                <h3 className="font-headline font-bold text-lg text-text-primary mb-2">
                  Trámites, Aranceles y Licencias
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-4">
                  Si organizás recitales, fiestas o tenés un local comercial, calculá y aboná el arancel reglamentario conforme al marco legal de la Ley 11.723.
                </p>
              </div>
              <a
                href="#aranceles"
                className="inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:text-primary transition-colors"
              >
                Calcular Tarifa →
              </a>
            </div>
          </div>
        </section>

        {/* =========================================
            BUSCADOR PÚBLICO DE REPERTORIO NACIONAL
           ========================================= */}
        <section id="repertorio" className="py-16 bg-surface-container-low/50 border-y border-border-subtle">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-secondary">Catálogo Público</span>
                <h2 className="text-2xl sm:text-3xl font-headline font-bold text-text-primary mt-1">
                  Consulta de Repertorio y Código ISWC
                </h2>
                <p className="text-sm text-text-secondary mt-1">
                  Búsqueda directa de obras registradas en Argentina y cruzadas con el índice mundial CISAC.
                </p>
              </div>
              <div className="text-xs text-text-muted flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-status-success">check_circle</span>
                Base de datos actualizada al día de hoy
              </div>
            </div>

            {/* Caja de búsqueda con controles */}
            <div className="bg-surface-card p-4 sm:p-6 rounded-2xl border border-border-subtle shadow-sm mb-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <span className="material-symbols-outlined absolute left-3.5 top-3.5 text-text-muted">search</span>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Escribí el nombre de la obra (ej. Crimen, De Música Ligera) o compositor..."
                    className="w-full pl-11 pr-4 py-3 bg-surface-subtle rounded-xl text-sm text-text-primary border border-border-subtle focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15"
                  />
                </div>

                <div className="flex items-center gap-2">
                  {(["todos", "titulo", "autor", "iswc"] as const).map((fil) => (
                    <button
                      key={fil}
                      onClick={() => setFilterType(fil)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                        filterType === fil
                          ? "bg-primary text-white"
                          : "bg-surface-subtle text-text-secondary hover:bg-surface-container"
                      }`}
                    >
                      {fil === "todos" ? "Todos" : fil === "titulo" ? "Título" : fil === "autor" ? "Autor" : "ISWC"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Grilla de resultados de obras */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isSearching ? (
                <div className="col-span-full py-12 text-center text-text-muted">
                  <span className="material-symbols-outlined animate-spin text-3xl text-secondary mb-2">progress_activity</span>
                  <p className="text-sm">Consultando base de datos musical...</p>
                </div>
              ) : obrasResult.length > 0 ? (
                obrasResult.map((obra) => (
                  <div
                    key={obra.id}
                    className="bg-surface-card p-5 rounded-xl border border-border-subtle hover:border-secondary transition-all shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-headline font-bold text-base text-text-primary">
                          {obra.titulo}
                        </h4>
                        <span className="text-[11px] font-mono font-semibold bg-surface-container text-secondary px-2 py-0.5 rounded">
                          {obra.iswc}
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary mb-3">
                        {obra.subtitulo || obra.genero}
                      </p>

                      <div className="space-y-1 text-xs text-text-secondary border-t border-border-subtle pt-3">
                        <div className="flex justify-between">
                          <span className="text-text-muted">Autores:</span>
                          <span className="font-medium text-text-primary">
                            {obra.coautores.map((c) => c.nombre_completo).join(", ")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-muted">Duración:</span>
                          <span className="font-mono text-text-primary">{obra.duracion_formato}</span>
                        </div>
                        {obra.editorial && (
                          <div className="flex justify-between">
                            <span className="text-text-muted">Editorial:</span>
                            <span className="text-text-primary truncate max-w-[180px]">{obra.editorial}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-xs text-status-success font-medium">
                        <span className="w-2 h-2 rounded-full bg-status-success"></span>
                        {obra.estado_registro}
                      </span>
                      <Link
                        href="/panel-socio"
                        className="text-xs font-semibold text-secondary hover:underline"
                      >
                        Ver detalles →
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-10 text-center text-text-muted">
                  No se encontraron obras coincidentes. Probá con otra búsqueda.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* =========================================
            CALCULADORA DE ARANCELES INTERACTIVA
           ========================================= */}
        <section id="aranceles" className="py-16 max-w-7xl mx-auto px-4 sm:px-8 w-full">
          <div className="bg-primary text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-accent-cyan">
                  Herramienta para Organizadores y Locales
                </span>
                <h2 className="text-2xl sm:text-3xl font-headline font-bold">
                  Simulador de Arancel de Derechos de Autor
                </h2>
                <p className="text-sm text-primary-fixed-dim leading-relaxed">
                  Conocé de antemano el importe correspondiente a la reproducción pública de música conforme a la normativa vigente del Decreto 41.223.
                </p>

                {/* Formulario del simulador */}
                <div className="space-y-4 pt-4">
                  <div>
                    <label className="block text-xs font-semibold text-primary-fixed-dim mb-1.5">
                      Tipo de Evento o Establecimiento:
                    </label>
                    <select
                      value={calcTipo}
                      onChange={(e) => setCalcTipo(e.target.value as any)}
                      className="w-full bg-primary-container text-white border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-cyan"
                    >
                      <option value="fiesta_privada">Fiesta Privada / Evento Social (Cumpleaños, Casamiento)</option>
                      <option value="recital_vivo">Recital / Concierto en Vivo con Venta de Entradas</option>
                      <option value="bar_restaurante">Bar, Pub o Restaurante con Ambientación Sonora</option>
                      <option value="streaming_live">Transmisión Streaming / Festival Online</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-primary-fixed-dim mb-1.5">
                        Capacidad / Asistentes Estimados:
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={calcCapacidad}
                        onChange={(e) => setCalcCapacidad(Math.max(1, parseInt(e.target.value) || 0))}
                        className="w-full bg-primary-container text-white border border-white/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent-cyan"
                      />
                    </div>

                    {(calcTipo === "recital_vivo" || calcTipo === "streaming_live") && (
                      <div>
                        <label className="block text-xs font-semibold text-primary-fixed-dim mb-1.5">
                          Precio Promedio Entrada ($ ARS):
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={calcPrecioEntrada}
                          onChange={(e) => setCalcPrecioEntrada(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full bg-primary-container text-white border border-white/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent-cyan"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Resultado del cálculo */}
              <div className="lg:col-span-6">
                <div className="bg-surface-card text-text-primary rounded-2xl p-6 sm:p-8 shadow-xl border border-border-subtle">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-border-subtle">
                    <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                      Presupuesto Estimado
                    </span>
                    <span className="text-xs bg-surface-container px-2 py-0.5 rounded text-secondary font-semibold">
                      Cotización Oficial
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <span className="text-xs text-text-secondary">Arancel Sugerido SADAIC:</span>
                      <div className="text-3xl sm:text-4xl font-headline font-extrabold text-secondary mt-1">
                        $ {calcResultado ? calcResultado.costo_arancel_estimado.toLocaleString("es-AR") : "0"}
                      </div>
                      <p className="text-xs text-text-muted mt-1">
                        Monto sujeto a verificación de bordereaux oficial y aforos habilitados.
                      </p>
                    </div>

                    <div className="bg-surface-subtle p-3 rounded-xl text-xs space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-text-muted">Normativa base:</span>
                        <span className="font-medium text-text-primary text-right">{calcResultado?.normativa_aplicable}</span>
                      </div>
                      {calcResultado?.monto_taquilla && (
                        <div className="flex justify-between">
                          <span className="text-text-muted">Recaudación taquilla:</span>
                          <span className="font-mono text-text-primary">$ {calcResultado.monto_taquilla.toLocaleString("es-AR")}</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => alert("Simulación generada. Podés iniciar la declaración de evento en filiales o portal.")}
                      className="w-full py-3 bg-secondary text-white rounded-xl text-sm font-semibold hover:bg-secondary/90 transition-colors shadow-md flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-base">receipt</span>
                      Generar Constancia de Pago / Arancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            NOTICIAS Y COMUNICADOS
           ========================================= */}
        <section className="py-16 bg-surface max-w-7xl mx-auto px-4 sm:px-8 w-full">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-secondary">Novedades</span>
              <h2 className="text-2xl sm:text-3xl font-headline font-bold text-text-primary mt-1">
                Noticias Institucionales y Comunicados
              </h2>
            </div>
            <a href="#todas-noticias" className="text-xs sm:text-sm font-semibold text-secondary hover:underline">
              Ver archivo de prensa →
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {noticias.map((noticia) => (
              <article
                key={noticia.id}
                className="bg-surface-card rounded-2xl border border-border-subtle overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 w-full bg-surface-container relative overflow-hidden">
                    <img
                      src={noticia.imagen_url}
                      alt={noticia.titulo}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary text-white backdrop-blur-md">
                      {noticia.categoria}
                    </span>
                  </div>
                  <div className="p-5 space-y-2">
                    <div className="text-xs text-text-muted flex items-center gap-2">
                      <span>{noticia.fecha}</span>
                      <span>•</span>
                      <span>{noticia.tiempo_lectura}</span>
                    </div>
                    <h3 className="font-headline font-bold text-base text-text-primary leading-snug">
                      {noticia.titulo}
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
                      {noticia.bajada}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <a
                    href="#leer-mas"
                    className="text-xs font-semibold text-secondary hover:underline inline-flex items-center gap-1"
                  >
                    Leer comunicado completo →
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* =========================================
            FILIALES Y ATENCIÓN FEDERAL
           ========================================= */}
        <section className="py-16 bg-surface-container-low/40 border-t border-border-subtle">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-secondary">Presencia Nacional</span>
              <h2 className="text-2xl sm:text-3xl font-headline font-bold text-text-primary mt-1">
                Filiales y Delegaciones en Todo el País
              </h2>
              <p className="text-sm text-text-secondary mt-1">
                42 sedes para atención presencial a autores, compositores y usuarios en las 24 provincias argentinas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filiales.map((f) => (
                <div
                  key={f.id}
                  className="bg-surface-card p-5 rounded-xl border border-border-subtle shadow-xs hover:border-secondary transition-all"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-secondary text-xl">location_city</span>
                    <h4 className="font-bold text-text-primary text-sm">{f.provincia}</h4>
                  </div>
                  <p className="text-xs text-text-secondary font-medium">{f.direccion}</p>
                  <div className="mt-3 pt-3 border-t border-border-subtle space-y-1 text-xs text-text-muted">
                    <p className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">phone</span>
                      {f.telefono}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">schedule</span>
                      {f.horario}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
