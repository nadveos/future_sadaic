"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { registrarNuevaObra } from "@/lib/db/service";
import { Obra } from "@/types/sadaic";

export default function RegistroObrasPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Paso 1: Datos de la obra
  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [genero, setGenero] = useState("Rock / Pop");
  const [caracter, setCaracter] = useState<"Original" | "Adaptación" | "Instrumental" | "Banda de Sonido">("Original");
  const [duracion, setDuracion] = useState("03:30");
  const [editorial, setEditorial] = useState("");

  // Paso 2: Coautores y porcentajes
  const [coautores, setCoautores] = useState<
    {
      nombre_completo: string;
      cuit: string;
      rol: "Compositor" | "Autor de Letra" | "Compositor y Letrista" | "Arreglador";
      porcentaje_derecho: number;
    }[]
  >([
    {
      nombre_completo: "Gustavo Adrián Cerati",
      cuit: "20-13894210-9",
      rol: "Compositor y Letrista",
      porcentaje_derecho: 100,
    },
  ]);

  // Paso 3: Documentación
  const [partituraName, setPartituraName] = useState<string | null>(null);
  const [audioName, setAudioName] = useState<string | null>(null);
  const [letraName, setLetraName] = useState<string | null>(null);
  const [aceptoTerminos, setAceptoTerminos] = useState(false);

  // Estados de resultado
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [obraRegistrada, setObraRegistrada] = useState<{ obra: Obra; expediente: string } | null>(null);

  const sumaPorcentajes = coautores.reduce((acc, c) => acc + (Number(c.porcentaje_derecho) || 0), 0);
  const porcentajeValido = sumaPorcentajes === 100;

  const agregarCoautor = () => {
    setCoautores([
      ...coautores,
      {
        nombre_completo: "",
        cuit: "",
        rol: "Compositor",
        porcentaje_derecho: 0,
      },
    ]);
  };

  const eliminarCoautor = (index: number) => {
    if (coautores.length <= 1) return;
    setCoautores(coautores.filter((_, i) => i !== index));
  };

  const actualizarCoautor = (index: number, campo: string, valor: any) => {
    const nuevos = [...coautores];
    nuevos[index] = { ...nuevos[index], [campo]: valor };
    setCoautores(nuevos);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!porcentajeValido || !aceptoTerminos || !titulo) return;

    setIsSubmitting(true);
    try {
      const res = await registrarNuevaObra({
        titulo,
        subtitulo,
        genero,
        duracion_formato: duracion,
        caracter,
        editorial,
        coautores,
      });
      setObraRegistrada(res);
    } catch (err) {
      alert("Error al registrar obra.");
    } finally {
      setIsSubmitting(false);
    }
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
            <span className="text-text-primary font-medium">Registro de Obras</span>
          </div>

          {/* Banner de Título */}
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-secondary">
              Protección y Gestión Colectiva
            </span>
            <h1 className="text-2xl sm:text-3xl font-headline font-bold text-text-primary mt-1">
              Registro y Declaración de Nuevas Obras Musicales
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Declaración 100% digital bajo la Ley Nacional 11.723. Generación de código ISWC y resguardo de coautorías.
            </p>
          </div>

          {/* Si ya se registró la obra */}
          {obraRegistrada ? (
            <div className="bg-surface-card rounded-3xl border border-status-success/30 p-8 sm:p-12 shadow-xl max-w-2xl mx-auto text-center space-y-6 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-status-success/20 text-status-success mx-auto flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl">verified</span>
              </div>
              <div>
                <h2 className="text-2xl font-headline font-bold text-text-primary">
                  ¡Declaración Ingresada Exitosamente!
                </h2>
                <p className="text-sm text-text-secondary mt-2">
                  Se ha generado el expediente digital para la obra <strong className="text-text-primary">"{obraRegistrada.obra.titulo}"</strong>.
                </p>
              </div>

              <div className="bg-surface-subtle p-5 rounded-2xl text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-text-muted">N° de Expediente:</span>
                  <span className="font-mono font-bold text-secondary text-sm">{obraRegistrada.expediente}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Código ISWC Provisorio:</span>
                  <span className="font-mono font-bold text-text-primary text-sm">{obraRegistrada.obra.iswc}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Género:</span>
                  <span className="text-text-primary">{obraRegistrada.obra.genero}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Carácter:</span>
                  <span className="text-text-primary">{obraRegistrada.obra.caracter}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Coautores declarados:</span>
                  <span className="text-text-primary font-medium">
                    {obraRegistrada.obra.coautores.map((c) => `${c.nombre_completo} (${c.porcentaje_derecho}%)`).join(", ")}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <Link
                  href="/panel-socio"
                  className="px-6 py-3 rounded-xl bg-secondary text-white font-semibold text-sm hover:bg-secondary/90 transition-colors shadow-md"
                >
                  Ver en Mi Catálogo
                </Link>
                <button
                  onClick={() => {
                    setObraRegistrada(null);
                    setTitulo("");
                    setSubtitulo("");
                    setStep(1);
                  }}
                  className="px-6 py-3 rounded-xl bg-surface-subtle text-text-primary font-semibold text-sm hover:bg-surface-container transition-colors"
                >
                  Registrar Otra Obra
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Columna Izquierda: Formulario por Pasos */}
              <div className="lg:col-span-8 space-y-6">
                {/* Indicador de pasos */}
                <div className="bg-surface-card rounded-2xl border border-border-subtle p-4 shadow-sm flex items-center justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className={`flex items-center gap-2 text-xs font-semibold ${
                      step === 1 ? "text-secondary" : "text-text-muted hover:text-text-primary"
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      step === 1 ? "bg-secondary text-white" : "bg-surface-subtle text-text-muted"
                    }`}>1</span>
                    <span className="hidden sm:inline">Identificación de la Obra</span>
                  </button>

                  <div className="h-0.5 flex-1 bg-border-subtle mx-3"></div>

                  <button
                    onClick={() => setStep(2)}
                    className={`flex items-center gap-2 text-xs font-semibold ${
                      step === 2 ? "text-secondary" : "text-text-muted hover:text-text-primary"
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      step === 2 ? "bg-secondary text-white" : "bg-surface-subtle text-text-muted"
                    }`}>2</span>
                    <span className="hidden sm:inline">Reparto y Coautorías</span>
                  </button>

                  <div className="h-0.5 flex-1 bg-border-subtle mx-3"></div>

                  <button
                    onClick={() => setStep(3)}
                    className={`flex items-center gap-2 text-xs font-semibold ${
                      step === 3 ? "text-secondary" : "text-text-muted hover:text-text-primary"
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      step === 3 ? "bg-secondary text-white" : "bg-surface-subtle text-text-muted"
                    }`}>3</span>
                    <span className="hidden sm:inline">Partituras y Declaración</span>
                  </button>
                </div>

                {/* Contenido del Paso */}
                <form onSubmit={handleSubmit} className="bg-surface-card rounded-2xl border border-border-subtle p-6 sm:p-8 shadow-sm space-y-6">
                  {/* PASO 1 */}
                  {step === 1 && (
                    <div className="space-y-5 animate-fade-in">
                      <div className="pb-3 border-b border-border-subtle">
                        <h2 className="font-headline font-bold text-lg text-text-primary">
                          1. Identificación de la Creación Musical
                        </h2>
                        <p className="text-xs text-text-secondary mt-0.5">
                          Ingresá los datos identificatorios de la obra para su catálogo en el WID (CISAC).
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-text-primary mb-1">
                          Título de la Obra *
                        </label>
                        <input
                          type="text"
                          required
                          value={titulo}
                          onChange={(e) => setTitulo(e.target.value)}
                          placeholder="Ej: Lago en el Cielo, En la Ciudad de la Furia..."
                          className="w-full bg-surface-subtle border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-secondary"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-text-primary mb-1">
                            Subtítulo / Versión Alternativa (Opcional)
                          </label>
                          <input
                            type="text"
                            value={subtitulo}
                            onChange={(e) => setSubtitulo(e.target.value)}
                            placeholder="Ej: Versión acústica, Tema principal..."
                            className="w-full bg-surface-subtle border border-border-subtle rounded-xl px-4 py-2.5 text-xs text-text-primary focus:outline-none focus:border-secondary"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-text-primary mb-1">
                            Género / Ritmo *
                          </label>
                          <select
                            value={genero}
                            onChange={(e) => setGenero(e.target.value)}
                            className="w-full bg-surface-subtle border border-border-subtle rounded-xl px-4 py-2.5 text-xs text-text-primary focus:outline-none focus:border-secondary"
                          >
                            <option value="Rock / Pop">Rock / Pop</option>
                            <option value="Tango / Milonga">Tango / Milonga</option>
                            <option value="Folklore Argentino (Chacarera, Zamba)">Folklore Argentino</option>
                            <option value="Música Urbana / Trap / Hip-Hop">Música Urbana / Trap</option>
                            <option value="Cumbia / Cuarteto / Tropical">Cumbia / Cuarteto</option>
                            <option value="Jazz / Fusión / Instrumental">Jazz / Fusión / Instrumental</option>
                            <option value="Banda Sonora Cine / Televisión">Banda Sonora Cine / TV</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-text-primary mb-1">
                            Carácter de la Creación *
                          </label>
                          <select
                            value={caracter}
                            onChange={(e) => setCaracter(e.target.value as any)}
                            className="w-full bg-surface-subtle border border-border-subtle rounded-xl px-4 py-2.5 text-xs text-text-primary focus:outline-none focus:border-secondary"
                          >
                            <option value="Original">Obra Original</option>
                            <option value="Adaptación">Adaptación Autorizada</option>
                            <option value="Instrumental">Instrumental Puro</option>
                            <option value="Banda de Sonido">Banda Sonora / Sync</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-text-primary mb-1">
                            Duración Estimada (mm:ss) *
                          </label>
                          <input
                            type="text"
                            value={duracion}
                            onChange={(e) => setDuracion(e.target.value)}
                            placeholder="03:45"
                            className="w-full bg-surface-subtle border border-border-subtle rounded-xl px-4 py-2.5 text-xs text-text-primary font-mono focus:outline-none focus:border-secondary"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-text-primary mb-1">
                            Editorial Musical (Publishing)
                          </label>
                          <input
                            type="text"
                            value={editorial}
                            onChange={(e) => setEditorial(e.target.value)}
                            placeholder="Ej: Sony / Independiente"
                            className="w-full bg-surface-subtle border border-border-subtle rounded-xl px-4 py-2.5 text-xs text-text-primary focus:outline-none focus:border-secondary"
                          />
                        </div>
                      </div>

                      <div className="pt-4 flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            if (!titulo) {
                              alert("Por favor ingresá el título de la obra.");
                              return;
                            }
                            setStep(2);
                          }}
                          className="px-6 py-2.5 rounded-xl bg-secondary text-white text-xs font-semibold hover:bg-secondary/90 transition-colors flex items-center gap-1.5"
                        >
                          Siguiente: Coautores y Reparto →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* PASO 2 */}
                  {step === 2 && (
                    <div className="space-y-5 animate-fade-in">
                      <div className="pb-3 border-b border-border-subtle flex items-center justify-between">
                        <div>
                          <h2 className="font-headline font-bold text-lg text-text-primary">
                            2. Reparto de Derechos y Coautorías
                          </h2>
                          <p className="text-xs text-text-secondary mt-0.5">
                            La sumatoria de porcentajes entre autores y compositores debe dar exactamente el 100%.
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            porcentajeValido
                              ? "bg-status-success/15 text-status-success"
                              : "bg-status-error/15 text-status-error"
                          }`}
                        >
                          Suma: {sumaPorcentajes}% / 100%
                        </span>
                      </div>

                      <div className="space-y-4">
                        {coautores.map((c, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-xl border border-border-subtle bg-surface-subtle/40 space-y-3"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-text-primary">
                                Coautor #{idx + 1} {idx === 0 && "(Declarante Titular)"}
                              </span>
                              {coautores.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => eliminarCoautor(idx)}
                                  className="text-xs text-status-error hover:underline flex items-center gap-1"
                                >
                                  <span className="material-symbols-outlined text-sm">delete</span>
                                  Quitar
                                </button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[11px] font-semibold text-text-secondary mb-1">
                                  Nombre Completo:
                                </label>
                                <input
                                  type="text"
                                  value={c.nombre_completo}
                                  onChange={(e) => actualizarCoautor(idx, "nombre_completo", e.target.value)}
                                  placeholder="Nombre y Apellido"
                                  className="w-full bg-surface-card border border-border-subtle rounded-lg px-3 py-2 text-xs text-text-primary"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-text-secondary mb-1">
                                  CUIT / CUIL:
                                </label>
                                <input
                                  type="text"
                                  value={c.cuit}
                                  onChange={(e) => actualizarCoautor(idx, "cuit", e.target.value)}
                                  placeholder="20-xxxxxxxx-x"
                                  className="w-full bg-surface-card border border-border-subtle rounded-lg px-3 py-2 text-xs text-text-primary font-mono"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[11px] font-semibold text-text-secondary mb-1">
                                  Rol en la Obra:
                                </label>
                                <select
                                  value={c.rol}
                                  onChange={(e) => actualizarCoautor(idx, "rol", e.target.value)}
                                  className="w-full bg-surface-card border border-border-subtle rounded-lg px-3 py-2 text-xs text-text-primary"
                                >
                                  <option value="Compositor y Letrista">Compositor y Letrista (Música y Letra)</option>
                                  <option value="Compositor">Compositor (Solo Música)</option>
                                  <option value="Autor de Letra">Autor de Letra (Solo Letra)</option>
                                  <option value="Arreglador">Arreglador Musical</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-[11px] font-semibold text-text-secondary mb-1">
                                  Porcentaje de Participación (%):
                                </label>
                                <input
                                  type="number"
                                  min="1"
                                  max="100"
                                  value={c.porcentaje_derecho}
                                  onChange={(e) => actualizarCoautor(idx, "porcentaje_derecho", parseFloat(e.target.value) || 0)}
                                  className="w-full bg-surface-card border border-border-subtle rounded-lg px-3 py-2 text-xs text-text-primary font-mono font-bold"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={agregarCoautor}
                        className="w-full py-2.5 rounded-xl border border-dashed border-secondary text-secondary hover:bg-secondary/5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">person_add</span>
                        Agregar Otro Coautor / Letrista
                      </button>

                      <div className="pt-4 flex items-center justify-between border-t border-border-subtle">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="px-4 py-2 text-xs font-semibold text-text-secondary hover:text-text-primary"
                        >
                          ← Volver a Datos
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (!porcentajeValido) {
                              alert(`El porcentaje actual es de ${sumaPorcentajes}%. Debe sumar exactamente 100%.`);
                              return;
                            }
                            setStep(3);
                          }}
                          className="px-6 py-2.5 rounded-xl bg-secondary text-white text-xs font-semibold hover:bg-secondary/90 transition-colors"
                        >
                          Siguiente: Adjuntar Archivos →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* PASO 3 */}
                  {step === 3 && (
                    <div className="space-y-5 animate-fade-in">
                      <div className="pb-3 border-b border-border-subtle">
                        <h2 className="font-headline font-bold text-lg text-text-primary">
                          3. Carga de Partituras, Letra y Maqueta Sonora
                        </h2>
                        <p className="text-xs text-text-secondary mt-0.5">
                          Adjuntá la documentación respaldatoria requerida por el Departamento de Registro.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Partitura */}
                        <div className="border border-dashed border-border-subtle hover:border-secondary rounded-2xl p-4 text-center bg-surface-subtle/30 cursor-pointer">
                          <span className="material-symbols-outlined text-3xl text-secondary mb-1">picture_as_pdf</span>
                          <h4 className="font-bold text-xs text-text-primary">Partitura / Tablatura</h4>
                          <p className="text-[11px] text-text-muted mt-1">PDF de pentagrama o cifrado</p>
                          <label className="mt-3 inline-block px-3 py-1 rounded-lg bg-surface-card border border-border-subtle text-[11px] font-semibold text-secondary hover:bg-surface-container cursor-pointer">
                            {partituraName || "Seleccionar PDF"}
                            <input
                              type="file"
                              accept=".pdf"
                              className="hidden"
                              onChange={(e) => setPartituraName(e.target.files?.[0]?.name || null)}
                            />
                          </label>
                        </div>

                        {/* Maqueta Audio */}
                        <div className="border border-dashed border-border-subtle hover:border-secondary rounded-2xl p-4 text-center bg-surface-subtle/30 cursor-pointer">
                          <span className="material-symbols-outlined text-3xl text-secondary mb-1">audio_file</span>
                          <h4 className="font-bold text-xs text-text-primary">Audio de Referencia</h4>
                          <p className="text-[11px] text-text-muted mt-1">MP3, WAV o M4A (hasta 50MB)</p>
                          <label className="mt-3 inline-block px-3 py-1 rounded-lg bg-surface-card border border-border-subtle text-[11px] font-semibold text-secondary hover:bg-surface-container cursor-pointer">
                            {audioName || "Seleccionar Audio"}
                            <input
                              type="file"
                              accept="audio/*"
                              className="hidden"
                              onChange={(e) => setAudioName(e.target.files?.[0]?.name || null)}
                            />
                          </label>
                        </div>

                        {/* Letra */}
                        <div className="border border-dashed border-border-subtle hover:border-secondary rounded-2xl p-4 text-center bg-surface-subtle/30 cursor-pointer">
                          <span className="material-symbols-outlined text-3xl text-secondary mb-1">description</span>
                          <h4 className="font-bold text-xs text-text-primary">Letra de la Canción</h4>
                          <p className="text-[11px] text-text-muted mt-1">PDF o TXT con estrofas</p>
                          <label className="mt-3 inline-block px-3 py-1 rounded-lg bg-surface-card border border-border-subtle text-[11px] font-semibold text-secondary hover:bg-surface-container cursor-pointer">
                            {letraName || "Seleccionar Letra"}
                            <input
                              type="file"
                              accept=".pdf,.txt,.docx"
                              className="hidden"
                              onChange={(e) => setLetraName(e.target.files?.[0]?.name || null)}
                            />
                          </label>
                        </div>
                      </div>

                      {/* Declaración Jurada */}
                      <div className="p-4 rounded-xl bg-surface-subtle border border-border-subtle space-y-3">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={aceptoTerminos}
                            onChange={(e) => setAceptoTerminos(e.target.checked)}
                            className="mt-0.5 rounded text-secondary focus:ring-secondary"
                          />
                          <span className="text-xs text-text-secondary leading-relaxed">
                            Declaro bajo juramento que los datos manifestados son verídicos, que la obra referenciada no constituye plagio ni infracción de derechos de terceros, asumiendo la responsabilidad conforme al Código Penal y la Ley Nacional de Propiedad Intelectual 11.723.
                          </span>
                        </label>
                      </div>

                      <div className="pt-4 flex items-center justify-between border-t border-border-subtle">
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="px-4 py-2 text-xs font-semibold text-text-secondary hover:text-text-primary"
                        >
                          ← Volver a Coautores
                        </button>
                        <button
                          type="submit"
                          disabled={!aceptoTerminos || isSubmitting}
                          className="px-6 py-3 rounded-xl bg-secondary text-white text-xs font-semibold hover:bg-secondary/90 transition-colors shadow-md disabled:opacity-50 flex items-center gap-2"
                        >
                          {isSubmitting ? (
                            <>
                              <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                              Transmitiendo a Registro SADAIC...
                            </>
                          ) : (
                            <>
                              <span className="material-symbols-outlined text-sm">verified_user</span>
                              Confirmar y Firmar Declaración Digital
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </div>

              {/* Columna Derecha: Resumen de Expediente en Tiempo Real */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-surface-card rounded-2xl border border-border-subtle p-6 shadow-sm sticky top-32">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-border-subtle">
                    <span className="text-xs font-bold uppercase tracking-wider text-secondary">
                      Borrador de Expediente
                    </span>
                    <span className="text-xs bg-surface-container px-2 py-0.5 rounded text-secondary font-semibold">
                      En preparación
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-text-muted">Título declarado:</span>
                      <p className="font-headline font-bold text-sm text-text-primary mt-0.5">
                        {titulo || "Sin título aún"}
                      </p>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-text-muted">Género:</span>
                      <span className="font-medium text-text-primary">{genero}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-text-muted">Carácter:</span>
                      <span className="font-medium text-text-primary">{caracter}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-text-muted">Duración:</span>
                      <span className="font-mono text-text-primary">{duracion}</span>
                    </div>

                    <div className="border-t border-border-subtle pt-3 space-y-1.5">
                      <span className="text-text-muted font-semibold">Coautores ({coautores.length}):</span>
                      {coautores.map((c, i) => (
                        <div key={i} className="flex justify-between text-[11px]">
                          <span className="truncate max-w-[150px]">{c.nombre_completo || `Coautor #${i+1}`}</span>
                          <span className="font-mono font-bold text-secondary">{c.porcentaje_derecho}%</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-border-subtle pt-3 flex justify-between items-center">
                      <span className="font-semibold text-text-primary">Sumatoria Total:</span>
                      <span className={`font-mono font-bold text-sm ${porcentajeValido ? "text-status-success" : "text-status-error"}`}>
                        {sumaPorcentajes}%
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 p-3 rounded-xl bg-surface-subtle text-[11px] text-text-secondary space-y-1">
                    <p className="flex items-center gap-1.5 font-semibold text-text-primary">
                      <span className="material-symbols-outlined text-sm text-secondary">info</span>
                      Emisión de Código ISWC
                    </p>
                    <p>
                      Al completar el paso 3 y aceptar la DDJJ, el sistema conectará con CISAC y emitirá el código internacional inmediatamente.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
