"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSocioActual, getTramitesSocio } from "@/lib/db/service";
import { Socio, TramiteReclamo } from "@/types/sadaic";

export default function AutogestionPage() {
  const [socio, setSocio] = useState<Socio | null>(null);
  const [tramites, setTramites] = useState<TramiteReclamo[]>([]);

  // Formulario nuevo reclamo
  const [showModal, setShowModal] = useState(false);
  const [tipoTramite, setTipoTramite] = useState<"Reclamo de Regalías" | "Declaración de Recital en Vivo" | "Actualización Bancaria" | "Certificado de Afiliación">("Reclamo de Regalías");
  const [obraNombre, setObraNombre] = useState("");
  const [descripcionReclamo, setDescripcionReclamo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    getSocioActual().then(setSocio);
    getTramitesSocio().then(setTramites);
  }, []);

  const handleCrearTramite = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      const nuevoExpediente = `EXP-2025-${Math.floor(1000 + Math.random() * 9000)}-SAD`;
      const nuevoTramite: TramiteReclamo = {
        id: `tra-${Date.now()}`,
        nro_expediente: nuevoExpediente,
        tipo_tramite: tipoTramite,
        obra_relacionada: obraNombre || undefined,
        fecha_inicio: new Date().toISOString().split("T")[0],
        fecha_actualizacion: new Date().toISOString().split("T")[0],
        estado: "En análisis",
        descripcion: descripcionReclamo,
        observaciones_revisor: "Expediente digital ingresado. Derivado a Gerencia de Recaudación y Liquidaciones.",
      };

      setTramites([nuevoTramite, ...tramites]);
      setSubmitting(false);
      setShowModal(false);
      setObraNombre("");
      setDescripcionReclamo("");
      setSuccessMsg(`¡Expediente ${nuevoExpediente} iniciado con éxito!`);
      setTimeout(() => setSuccessMsg(""), 6000);
    }, 600);
  };

  return (
    <>
      <Header />

      <main className="w-full pt-28 bg-surface min-h-screen pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-text-muted mb-6">
            <Link href="/" className="hover:text-text-primary">Inicio</Link>
            <span>/</span>
            <span className="text-text-primary font-medium">Autogestión de Socios</span>
          </div>

          {/* Banner de bienvenida y datos del Socio */}
          <div className="bg-primary text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-secondary/30 to-transparent pointer-events-none"></div>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-secondary/30 ring-2 ring-secondary flex items-center justify-center font-headline text-2xl font-bold text-white shadow-lg overflow-hidden">
                    GC
                  </div>
                  <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-status-success text-[10px] font-bold ring-2 ring-primary">
                    ACTIVO
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl sm:text-3xl font-headline font-bold text-white">
                      {socio?.nombre} {socio?.apellido}
                    </h1>
                  </div>
                  <p className="text-xs sm:text-sm text-primary-fixed-dim mt-1">
                    Matrícula SADAIC: <span className="font-mono text-white font-semibold">{socio?.matricula_sadaic}</span> • CUIT: <span className="font-mono text-white">{socio?.cuit_cuil}</span> • IPI: <span className="font-mono text-accent-cyan">{socio?.ipi}</span>
                  </p>
                  <p className="text-xs text-on-primary-container mt-1">
                    Radicación: {socio?.filial_radicacion} • Estado de cuenta: <span className="text-status-success font-semibold">Al día</span>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <button
                  onClick={() => setShowModal(true)}
                  className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/90 text-white px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-md"
                >
                  <span className="material-symbols-outlined text-lg">add_circle</span>
                  Nuevo Trámite / Reclamo
                </button>
                <Link
                  href="/panel-socio"
                  className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all"
                >
                  <span className="material-symbols-outlined text-lg">receipt_long</span>
                  Ver Liquidaciones
                </Link>
              </div>
            </div>
          </div>

          {/* Notificación de éxito */}
          {successMsg && (
            <div className="mb-6 p-4 rounded-xl bg-status-success/15 border border-status-success/30 text-status-success text-sm font-medium flex items-center justify-between animate-fade-in">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined">check_circle</span>
                <span>{successMsg}</span>
              </div>
              <button onClick={() => setSuccessMsg("")} className="hover:opacity-75">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          )}

          {/* Grilla principal: Trámites activos + Centro de recursos */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Columna Izquierda: Mis Trámites Activos */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-surface-card rounded-2xl border border-border-subtle p-6 shadow-sm">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-border-subtle">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">pending_actions</span>
                    <h2 className="font-headline font-bold text-lg text-text-primary">
                      Mis Trámites y Expedientes Activos
                    </h2>
                  </div>
                  <span className="text-xs bg-surface-container px-2.5 py-1 rounded-full text-secondary font-semibold">
                    {tramites.length} expedientes
                  </span>
                </div>

                <div className="space-y-4">
                  {tramites.map((t) => (
                    <div
                      key={t.id}
                      className="p-5 rounded-xl border border-border-subtle bg-surface-subtle/30 hover:border-secondary transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-secondary bg-surface-container px-2 py-0.5 rounded">
                            {t.nro_expediente}
                          </span>
                          <span className="text-xs font-semibold text-text-primary">
                            {t.tipo_tramite}
                          </span>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded-full font-semibold w-fit ${
                            t.estado === "Aprobado" || t.estado === "Finalizado"
                              ? "bg-status-success/15 text-status-success"
                              : t.estado === "Requiere comprobante"
                              ? "bg-status-warning/15 text-status-warning"
                              : "bg-secondary/15 text-secondary"
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          {t.estado}
                        </span>
                      </div>

                      {t.obra_relacionada && (
                        <p className="text-xs text-text-secondary font-medium mb-1">
                          Obra vinculada: <span className="text-text-primary">{t.obra_relacionada}</span>
                        </p>
                      )}

                      <p className="text-xs text-text-secondary leading-relaxed mb-3">
                        {t.descripcion}
                      </p>

                      {t.observaciones_revisor && (
                        <div className="bg-surface-card p-3 rounded-lg border border-border-subtle text-xs text-text-secondary flex items-start gap-2">
                          <span className="material-symbols-outlined text-secondary text-sm shrink-0 mt-0.5">feedback</span>
                          <div>
                            <span className="font-semibold text-text-primary">Dictamen SADAIC: </span>
                            {t.observaciones_revisor}
                          </div>
                        </div>
                      )}

                      <div className="mt-3 pt-3 border-t border-border-subtle flex items-center justify-between text-[11px] text-text-muted">
                        <span>Iniciado: {t.fecha_inicio}</span>
                        <span>Última actualización: {t.fecha_actualizacion}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Accesos rápidos a trámites frecuentes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link
                  href="/registro-obras"
                  className="bg-surface-card p-5 rounded-xl border border-border-subtle hover:border-secondary transition-all shadow-xs flex flex-col justify-between"
                >
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-secondary mb-3">
                    <span className="material-symbols-outlined text-xl">music_note</span>
                  </div>
                  <h3 className="font-bold text-sm text-text-primary mb-1">Declarar Obra</h3>
                  <p className="text-xs text-text-muted">Cargar partitura y obtener ISWC.</p>
                </Link>

                <div
                  onClick={() => {
                    setTipoTramite("Declaración de Recital en Vivo");
                    setShowModal(true);
                  }}
                  className="bg-surface-card p-5 rounded-xl border border-border-subtle hover:border-secondary transition-all shadow-xs flex flex-col justify-between cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-secondary mb-3">
                    <span className="material-symbols-outlined text-xl">stadium</span>
                  </div>
                  <h3 className="font-bold text-sm text-text-primary mb-1">Planilla de Show</h3>
                  <p className="text-xs text-text-muted">Declarar lista de temas en vivo.</p>
                </div>

                <div
                  onClick={() => {
                    setTipoTramite("Certificado de Afiliación");
                    setShowModal(true);
                  }}
                  className="bg-surface-card p-5 rounded-xl border border-border-subtle hover:border-secondary transition-all shadow-xs flex flex-col justify-between cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-secondary mb-3">
                    <span className="material-symbols-outlined text-xl">badge</span>
                  </div>
                  <h3 className="font-bold text-sm text-text-primary mb-1">Constancia Socio</h3>
                  <p className="text-xs text-text-muted">Descargar certificado firmado.</p>
                </div>
              </div>
            </div>

            {/* Columna Derecha: Normativa y Ayuda */}
            <div className="lg:col-span-4 space-y-6">
              {/* Material Normativo */}
              <div className="bg-surface-card rounded-2xl border border-border-subtle p-6 shadow-sm">
                <h3 className="font-headline font-bold text-base text-text-primary mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">menu_book</span>
                  Material Normativo 2025
                </h3>
                <ul className="space-y-3 text-xs">
                  <li>
                    <a
                      href="#estatuto"
                      className="p-3 rounded-xl border border-border-subtle hover:bg-surface-subtle flex items-center justify-between group transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-secondary">description</span>
                        <span className="font-medium text-text-primary">Estatuto Social SADAIC</span>
                      </div>
                      <span className="material-symbols-outlined text-text-muted group-hover:text-secondary text-sm">download</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#reparto"
                      className="p-3 rounded-xl border border-border-subtle hover:bg-surface-subtle flex items-center justify-between group transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-secondary">description</span>
                        <span className="font-medium text-text-primary">Reglamento de Reparto y Liquidaciones</span>
                      </div>
                      <span className="material-symbols-outlined text-text-muted group-hover:text-secondary text-sm">download</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#manual"
                      className="p-3 rounded-xl border border-border-subtle hover:bg-surface-subtle flex items-center justify-between group transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-secondary">description</span>
                        <span className="font-medium text-text-primary">Instructivo de Código ISWC / IPI</span>
                      </div>
                      <span className="material-symbols-outlined text-text-muted group-hover:text-secondary text-sm">download</span>
                    </a>
                  </li>
                </ul>
              </div>

              {/* Guía didáctica ISWC */}
              <div className="bg-surface-container-low/60 rounded-2xl border border-border-subtle p-6">
                <div className="flex items-center gap-2 text-secondary mb-2">
                  <span className="material-symbols-outlined text-xl">help</span>
                  <h4 className="font-bold text-sm text-text-primary">¿Qué es el código ISWC?</h4>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  El International Standard Musical Work Code (ISWC) es la cédula de identidad universal de tu composición musical. Permite que las plataformas digitales (Spotify, YouTube, Apple Music) y las emisoras de radio y TV liquiden exactamente a tu nombre en SADAIC y en las 120 sociedades hermanas de CISAC en el mundo.
                </p>
                <div className="mt-4 pt-3 border-t border-border-subtle/80 flex items-center justify-between">
                  <span className="text-[11px] text-text-muted">Formato estándar:</span>
                  <span className="font-mono text-xs font-bold text-secondary">T-000.000.000-C</span>
                </div>
              </div>

              {/* Canal de Soporte de Socios */}
              <div className="bg-primary-container text-on-primary rounded-2xl p-6">
                <h4 className="font-bold text-sm text-white mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-accent-cyan">headset_mic</span>
                  Atención Exclusiva de Socios
                </h4>
                <p className="text-xs text-primary-fixed-dim leading-relaxed mb-4">
                  Si tenés dudas con el cruce de recaudación de un evento o un tema no reconocido, comunicate directamente con tu oficial de cuenta asignado.
                </p>
                <div className="text-xs space-y-1.5 text-surface-container">
                  <p>• Línea directa: (011) 4379-8742</p>
                  <p>• E-mail: socios@sadaic.org.ar</p>
                  <p>• Horario: Lun a Vie de 9 a 17 hs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Nuevo Trámite / Reclamo */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-surface-card rounded-2xl shadow-2xl border border-border-subtle overflow-hidden">
            <div className="p-6 border-b border-border-subtle flex items-center justify-between bg-surface-subtle">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">post_add</span>
                <h3 className="font-headline font-bold text-base text-text-primary">
                  Iniciar Expediente Digital SADAIC
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-text-muted hover:text-text-primary"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCrearTramite} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Tipo de Gestión:
                </label>
                <select
                  value={tipoTramite}
                  onChange={(e) => setTipoTramite(e.target.value as any)}
                  className="w-full bg-surface-subtle border border-border-subtle rounded-xl px-4 py-2.5 text-xs text-text-primary focus:outline-none focus:border-secondary"
                >
                  <option value="Reclamo de Regalías">Reclamo de Regalías (Streaming o Difusión no liquidada)</option>
                  <option value="Declaración de Recital en Vivo">Declaración de Recital en Vivo / Planilla de Show</option>
                  <option value="Actualización Bancaria">Actualización de CBU / Cuenta Bancaria</option>
                  <option value="Certificado de Afiliación">Certificado Oficial de Afiliación</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Obra o Repertorio Involucrado (Opcional):
                </label>
                <input
                  type="text"
                  value={obraNombre}
                  onChange={(e) => setObraNombre(e.target.value)}
                  placeholder="Ej: Crimen / Show Movistar Arena"
                  className="w-full bg-surface-subtle border border-border-subtle rounded-xl px-4 py-2 text-xs text-text-primary focus:outline-none focus:border-secondary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Detalle del Trámite o Reclamo:
                </label>
                <textarea
                  rows={4}
                  required
                  value={descripcionReclamo}
                  onChange={(e) => setDescripcionReclamo(e.target.value)}
                  placeholder="Describí los detalles: fechas, enlaces a streaming, ciudades o festivales involucrados..."
                  className="w-full bg-surface-subtle border border-border-subtle rounded-xl p-3 text-xs text-text-primary focus:outline-none focus:border-secondary resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-text-secondary hover:text-text-primary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-secondary text-white text-xs font-semibold hover:bg-secondary/90 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                      Generando expediente...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm">send</span>
                      Ingresar Trámite
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
