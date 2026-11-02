"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSocioActual, getLiquidacionesSocio, getObrasSocio } from "@/lib/db/service";
import { Socio, Liquidacion, Obra } from "@/types/sadaic";

export default function SocioPanelPage() {
  const [socio, setSocio] = useState<Socio | null>(null);
  const [liquidaciones, setLiquidaciones] = useState<Liquidacion[]>([]);
  const [obras, setObras] = useState<Obra[]>([]);
  const [selectedLiquidacion, setSelectedLiquidacion] = useState<Liquidacion | null>(null);

  useEffect(() => {
    getSocioActual().then(setSocio);
    getLiquidacionesSocio().then((res) => {
      setLiquidaciones(res);
      if (res.length > 0) setSelectedLiquidacion(res[0]);
    });
    getObrasSocio().then(setObras);
  }, []);

  const totalRecaudadoObras = obras.reduce((acc, curr) => acc + (curr.recaudacion_acumulada || 0), 0);

  return (
    <>
      <Header />

      <main className="w-full pt-28 bg-surface min-h-screen pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-text-muted mb-6">
            <Link href="/" className="hover:text-text-primary">Inicio</Link>
            <span>/</span>
            <Link href="/autogestion" className="hover:text-text-primary">Autogestión</Link>
            <span>/</span>
            <span className="text-text-primary font-medium">Panel Financiero de Socio</span>
          </div>

          {/* Header de perfil */}
          <div className="bg-primary text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-xl relative overflow-hidden">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-secondary/30 ring-2 ring-secondary flex items-center justify-center font-headline text-2xl font-bold text-white shadow-lg">
                  GC
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl sm:text-3xl font-headline font-bold text-white">
                      {socio?.nombre} {socio?.apellido}
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full bg-status-success text-white text-[11px] font-bold">
                      Socio Activo
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-primary-fixed-dim mt-1">
                    Matrícula: <span className="font-mono text-white font-semibold">{socio?.matricula_sadaic}</span> • CUIT: <span className="font-mono text-white">{socio?.cuit_cuil}</span> • CBU: <span className="font-mono text-white">{socio?.banco_alias}</span>
                  </p>
                </div>
              </div>

              {/* Botones de acción rápida */}
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/registro-obras"
                  className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-md"
                >
                  <span className="material-symbols-outlined text-base">music_note</span>
                  Registrar Nueva Obra
                </Link>
                <button
                  onClick={() => alert("Descargando certificado de retenciones impositivas AFIP F.649...")}
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all"
                >
                  <span className="material-symbols-outlined text-base">file_download</span>
                  Retenciones Fiscales
                </button>
              </div>
            </div>
          </div>

          {/* Tarjeta de Liquidación Vigente */}
          {selectedLiquidacion && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
              {/* Resumen Financiero y desglose neto */}
              <div className="lg:col-span-7 bg-surface-card rounded-2xl border border-border-subtle p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-border-subtle">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-secondary">
                      Liquidación Período Vigente
                    </span>
                    <h2 className="text-xl font-headline font-bold text-text-primary mt-0.5">
                      {selectedLiquidacion.periodo}
                    </h2>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-status-success/15 text-status-success text-xs font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-status-success"></span>
                    {selectedLiquidacion.estado_pago}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-surface-subtle">
                    <span className="text-xs text-text-secondary">Monto Bruto Liquidado:</span>
                    <div className="text-2xl font-headline font-bold text-text-primary mt-1">
                      $ {selectedLiquidacion.monto_bruto.toLocaleString("es-AR")}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-surface-container-high/60 border border-secondary/20">
                    <span className="text-xs text-secondary font-semibold">Neto Acreditado en Cuenta:</span>
                    <div className="text-2xl font-headline font-extrabold text-secondary mt-1">
                      $ {selectedLiquidacion.monto_neto.toLocaleString("es-AR")}
                    </div>
                  </div>
                </div>

                {/* Deducciones estatutarias y fiscales */}
                <div className="space-y-2.5 text-xs text-text-secondary border-t border-border-subtle pt-4">
                  <div className="flex justify-between">
                    <span>Retenciones AFIP (Ganancias e IIBB):</span>
                    <span className="font-mono text-status-error font-medium">
                      - $ {selectedLiquidacion.retenciones_afip.toLocaleString("es-AR")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Aportes Mutual y Cobertura Social Autoral (5%):</span>
                    <span className="font-mono text-status-error font-medium">
                      - $ {selectedLiquidacion.aportes_sociales.toLocaleString("es-AR")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gastos Administrativos Estatutarios SADAIC (8%):</span>
                    <span className="font-mono text-status-error font-medium">
                      - $ {selectedLiquidacion.gastos_administrativos.toLocaleString("es-AR")}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-muted">
                  <span>Recibo Oficial: <strong className="font-mono text-text-primary">{selectedLiquidacion.numero_recibo}</strong></span>
                  <button
                    onClick={() => alert(`Generando PDF oficial para recibo ${selectedLiquidacion.numero_recibo}...`)}
                    className="inline-flex items-center gap-1.5 font-semibold text-secondary hover:underline"
                  >
                    <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                    Descargar Recibo Oficial (PDF)
                  </button>
                </div>
              </div>

              {/* Evolución de Recaudación por Rubro */}
              <div className="lg:col-span-5 bg-surface-card rounded-2xl border border-border-subtle p-6 sm:p-8 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-headline font-bold text-base text-text-primary mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">pie_chart</span>
                    Evolución de Recaudación por Rubro
                  </h3>

                  <div className="space-y-4">
                    {selectedLiquidacion.rubros.map((r) => (
                      <div key={r.rubro} className="space-y-1">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-text-primary">{r.rubro}</span>
                          <span className="text-text-secondary font-mono">
                            $ {r.monto.toLocaleString("es-AR")} ({r.porcentaje}%)
                          </span>
                        </div>
                        <div className="w-full bg-surface-subtle h-2 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${r.porcentaje}%`, backgroundColor: r.color }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border-subtle text-xs text-text-muted">
                  Metadatos cruzados con IPI {socio?.ipi} y plataformas Spotify, YouTube, Warner, Sony Music.
                </div>
              </div>
            </div>
          )}

          {/* Historial de Liquidaciones Anteriores */}
          <div className="bg-surface-card rounded-2xl border border-border-subtle p-6 mb-8 shadow-sm">
            <h3 className="font-headline font-bold text-base text-text-primary mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">history</span>
              Comprobantes y Liquidaciones Emitidas
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border-subtle text-text-muted">
                    <th className="pb-3 font-semibold">Período</th>
                    <th className="pb-3 font-semibold">N° Recibo</th>
                    <th className="pb-3 font-semibold">Fecha Acreditación</th>
                    <th className="pb-3 font-semibold text-right">Bruto</th>
                    <th className="pb-3 font-semibold text-right">Neto Acreditado</th>
                    <th className="pb-3 font-semibold text-center">Estado</th>
                    <th className="pb-3 font-semibold text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {liquidaciones.map((liq) => (
                    <tr
                      key={liq.id}
                      onClick={() => setSelectedLiquidacion(liq)}
                      className={`hover:bg-surface-container-low/50 cursor-pointer transition-colors ${
                        selectedLiquidacion?.id === liq.id ? "bg-surface-container-low/80 font-medium" : ""
                      }`}
                    >
                      <td className="py-3.5 text-text-primary font-medium">{liq.periodo}</td>
                      <td className="py-3.5 font-mono text-text-secondary">{liq.numero_recibo}</td>
                      <td className="py-3.5 text-text-muted">{liq.fecha_acreditacion}</td>
                      <td className="py-3.5 text-right font-mono text-text-secondary">$ {liq.monto_bruto.toLocaleString("es-AR")}</td>
                      <td className="py-3.5 text-right font-mono font-bold text-text-primary">$ {liq.monto_neto.toLocaleString("es-AR")}</td>
                      <td className="py-3.5 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-status-success/15 text-status-success font-semibold text-[11px]">
                          {liq.estado_pago}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`Descargando comprobante fiscal para ${liq.numero_recibo}...`);
                          }}
                          className="text-secondary hover:underline font-semibold"
                        >
                          Descargar PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Catálogo y Registro de Obras */}
          <div className="bg-surface-card rounded-2xl border border-border-subtle p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-border-subtle">
              <div>
                <h3 className="font-headline font-bold text-base text-text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">library_music</span>
                  Catálogo y Registro de Obras ({obras.length})
                </h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  Recaudación acumulada histórica del catálogo: <strong className="text-secondary font-mono">$ {totalRecaudadoObras.toLocaleString("es-AR")}</strong>
                </p>
              </div>
              <Link
                href="/registro-obras"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-secondary text-white text-xs font-semibold hover:bg-secondary/90 transition-colors shadow-xs"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Declarar Nueva Obra
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {obras.map((obra) => (
                <div
                  key={obra.id}
                  className="p-5 rounded-xl border border-border-subtle bg-surface-subtle/20 hover:border-secondary transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-headline font-bold text-base text-text-primary">
                        {obra.titulo}
                      </h4>
                      <span className="font-mono text-[11px] font-semibold bg-surface-container text-secondary px-2 py-0.5 rounded">
                        {obra.iswc}
                      </span>
                    </div>

                    <p className="text-xs text-text-muted mb-3">
                      {obra.subtitulo || obra.genero} • {obra.duracion_formato}
                    </p>

                    <div className="space-y-1.5 text-xs text-text-secondary border-t border-border-subtle pt-3">
                      <div className="flex justify-between">
                        <span className="text-text-muted">Participación:</span>
                        <span className="font-semibold text-text-primary">{obra.porcentaje_participacion_socio}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Fecha registro:</span>
                        <span>{obra.fecha_registro}</span>
                      </div>
                      {obra.editorial && (
                        <div className="flex justify-between">
                          <span className="text-text-muted">Editorial:</span>
                          <span className="truncate max-w-[150px]">{obra.editorial}</span>
                        </div>
                      )}
                      {obra.recaudacion_acumulada !== undefined && (
                        <div className="flex justify-between pt-1 border-t border-border-subtle/60">
                          <span className="text-text-muted">Recaudado histórico:</span>
                          <span className="font-mono font-bold text-secondary">
                            $ {obra.recaudacion_acumulada.toLocaleString("es-AR")}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs text-status-success font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-status-success"></span>
                      {obra.estado_registro}
                    </span>
                    <button
                      onClick={() => alert(`Certificado de obra ${obra.titulo} (ISWC ${obra.iswc}) disponible para descarga.`)}
                      className="text-xs font-semibold text-secondary hover:underline"
                    >
                      Descargar Ficha
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
