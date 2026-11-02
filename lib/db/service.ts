import {
  MOCK_SOCIO,
  MOCK_OBRAS,
  MOCK_LIQUIDACIONES,
  MOCK_TRAMITES,
  MOCK_NOTICIAS,
  MOCK_FILIALES,
} from "@/lib/data/mock-sadaic";
import { Socio, Obra, Liquidacion, TramiteReclamo, NoticiaInstitucional, FilialSADAIC, ArancelCalculo } from "@/types/sadaic";

/**
 * Capa de Servicios de Datos SADAIC
 * 
 * NOTA DE ARQUITECTURA MYSQL:
 * La plataforma original de SADAIC está montada sobre PHP y una base de datos relacional MySQL.
 * Esta capa de servicios desacopla la UI de React/Next.js de la persistencia:
 * - Actualmente opera con Mock Data estructurada con normalización 3FN idéntica a las tablas de SADAIC.
 * - Para conectar con la base de datos MySQL real de producción, sólo se requiere descomentar la conexión
 *   con `mysql2/promise` o Prisma/Drizzle y mapear las queries SELECT/INSERT directas.
 */

// Estado en memoria mutable para permitir interactividad en runtime (como registrar nuevas obras o trámites)
let mutableObras: Obra[] = [...MOCK_OBRAS];
let mutableTramites: TramiteReclamo[] = [...MOCK_TRAMITES];

export async function getSocioActual(): Promise<Socio> {
  // Simulación de query: SELECT * FROM socios WHERE cuit_cuil = ?
  return { ...MOCK_SOCIO };
}

export async function getObrasSocio(socioId?: string): Promise<Obra[]> {
  // Simulación de query: SELECT * FROM obras JOIN obra_autores ON obras.id = obra_autores.obra_id WHERE obra_autores.socio_id = ?
  return [...mutableObras];
}

export async function getLiquidacionesSocio(socioId?: string): Promise<Liquidacion[]> {
  // Simulación de query: SELECT * FROM liquidaciones WHERE socio_id = ? ORDER BY anio DESC, trimestre DESC
  return [...MOCK_LIQUIDACIONES];
}

export async function getTramitesSocio(socioId?: string): Promise<TramiteReclamo[]> {
  // Simulación de query: SELECT * FROM tramites WHERE socio_id = ? ORDER BY fecha_actualizacion DESC
  return [...mutableTramites];
}

export async function getNoticiasInstitucionales(): Promise<NoticiaInstitucional[]> {
  // Simulación de query: SELECT * FROM noticias WHERE estado = 'publicado' ORDER BY fecha DESC LIMIT 5
  return [...MOCK_NOTICIAS];
}

export async function getFiliales(): Promise<FilialSADAIC[]> {
  // Simulación de query: SELECT * FROM filiales ORDER BY provincia ASC
  return [...MOCK_FILIALES];
}

export async function searchRepertorio(
  termino: string,
  tipoFiltro: "todos" | "titulo" | "autor" | "iswc" = "todos"
): Promise<Obra[]> {
  const query = termino.trim().toLowerCase();
  if (!query) return mutableObras.slice(0, 10);

  return mutableObras.filter((obra) => {
    const matchTitulo = obra.titulo.toLowerCase().includes(query);
    const matchIswc = obra.iswc.toLowerCase().includes(query);
    const matchAutor = obra.coautores.some((c) =>
      c.nombre_completo.toLowerCase().includes(query)
    );

    switch (tipoFiltro) {
      case "titulo":
        return matchTitulo;
      case "autor":
        return matchAutor;
      case "iswc":
        return matchIswc;
      default:
        return matchTitulo || matchIswc || matchAutor;
    }
  });
}

export async function registrarNuevaObra(payload: {
  titulo: string;
  subtitulo?: string;
  genero: string;
  duracion_formato: string;
  caracter: "Original" | "Adaptación" | "Instrumental" | "Banda de Sonido";
  editorial?: string;
  coautores: {
    nombre_completo: string;
    cuit: string;
    rol: "Compositor" | "Autor de Letra" | "Compositor y Letrista" | "Arreglador";
    porcentaje_derecho: number;
  }[];
}): Promise<{ ok: boolean; obra: Obra; expediente: string }> {
  const nroRand = Math.floor(100000 + Math.random() * 900000);
  const nuevoIswc = `T-037.${Math.floor(100 + Math.random() * 900)}.${Math.floor(100 + Math.random() * 900)}-${Math.floor(Math.random() * 9)}`;
  const expediente = `EXP-OBRA-2025-${nroRand}`;

  const nuevaObra: Obra = {
    id: `obr-${Date.now()}`,
    iswc: nuevoIswc,
    titulo: payload.titulo,
    subtitulo: payload.subtitulo,
    genero: payload.genero,
    duracion_segundos: 180,
    duracion_formato: payload.duracion_formato || "03:00",
    caracter: payload.caracter,
    fecha_registro: new Date().toISOString().split("T")[0],
    estado_registro: "En trámite",
    porcentaje_participacion_socio: payload.coautores[0]?.porcentaje_derecho || 100,
    editorial: payload.editorial || "Independiente / No declarada",
    recaudacion_acumulada: 0,
    coautores: payload.coautores.map((c, idx) => ({
      id: `coa-new-${idx}`,
      nombre_completo: c.nombre_completo,
      cuit: c.cuit,
      rol: c.rol,
      porcentaje_derecho: c.porcentaje_derecho,
      es_socio_sadaic: true,
    })),
  };

  mutableObras = [nuevaObra, ...mutableObras];

  // Agregamos también trámite de registro
  mutableTramites = [
    {
      id: `tra-${Date.now()}`,
      nro_expediente: expediente,
      tipo_tramite: "Declaración de Recital en Vivo",
      obra_relacionada: `${payload.titulo} (En trámite)`,
      fecha_inicio: new Date().toISOString().split("T")[0],
      fecha_actualizacion: new Date().toISOString().split("T")[0],
      estado: "En análisis",
      descripcion: `Declaración de obra nueva "${payload.titulo}" ingresada por Portal Digital.`,
      observaciones_revisor: "Expediente digital generado. Pendiente validación de partitura y firmas.",
    },
    ...mutableTramites,
  ];

  return { ok: true, obra: nuevaObra, expediente };
}

export async function calcularArancelEstimado(params: {
  tipo_evento: "fiesta_privada" | "recital_vivo" | "bar_restaurante" | "streaming_live";
  capacidad: number;
  precioEntrada?: number;
}): Promise<ArancelCalculo> {
  let costo = 0;
  let normativa = "Decreto 41.223 / Resolución SADAIC 2025";

  switch (params.tipo_evento) {
    case "fiesta_privada":
      // Tarifa fija escalonada por asistentes
      if (params.capacidad <= 100) costo = 45000;
      else if (params.capacidad <= 250) costo = 85000;
      else costo = 150000;
      normativa = "Arancel Fiestas Privadas (Eventos Sociales sin cobro de entrada)";
      break;
    case "recital_vivo":
      // 12% sobre la recaudación bruta estimada de boletería o mínimo fiscal
      const recaudacion = params.capacidad * (params.precioEntrada || 5000);
      costo = Math.max(recaudacion * 0.12, 120000);
      normativa = "Decreto Reglamentario Ley 11.723 - 12% Bruto de Boletería";
      break;
    case "bar_restaurante":
      // Arancel mensual por m2 y capacidad
      costo = params.capacidad * 650;
      normativa = "Arancel Mensual Locales Gastronómicos y Bares con Difusión Musical";
      break;
    case "streaming_live":
      costo = Math.max((params.capacidad * (params.precioEntrada || 3000)) * 0.08, 60000);
      normativa = "Reglamentación Streaming y Eventos Híbridos Online CISAC";
      break;
  }

  return {
    tipo_evento: params.tipo_evento,
    capacidad_asistentes: params.capacidad,
    monto_taquilla: params.precioEntrada ? params.capacidad * params.precioEntrada : undefined,
    costo_arancel_estimado: Math.round(costo),
    normativa_aplicable: normativa,
  };
}
