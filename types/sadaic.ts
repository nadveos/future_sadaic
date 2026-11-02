export interface Socio {
  id: string;
  nombre: string;
  apellido: string;
  tipo_socio: "Activo" | "Administrado" | "Adherente" | "Heredero";
  matricula_sadaic: string;
  cuit_cuil: string;
  ipi: string;
  email: string;
  telefono: string;
  estado_cuenta: "Al día" | "Observado" | "En revisión";
  avatar_url?: string;
  filial_radicacion: string;
  banco_cbu?: string;
  banco_alias?: string;
}

export interface Coautor {
  id: string;
  nombre_completo: string;
  cuit: string;
  ipi?: string;
  rol: "Compositor" | "Autor de Letra" | "Compositor y Letrista" | "Arreglador";
  porcentaje_derecho: number; // Ej: 50.00
  es_socio_sadaic: boolean;
}

export interface Obra {
  id: string;
  iswc: string;
  titulo: string;
  subtitulo?: string;
  genero: string;
  subgenero?: string;
  duracion_segundos: number;
  duracion_formato: string; // Ej: "03:45"
  caracter: "Original" | "Adaptación" | "Instrumental" | "Banda de Sonido";
  fecha_registro: string;
  estado_registro: "Aprobada" | "En trámite" | "Observada" | "Pendiente documentación";
  porcentaje_participacion_socio: number;
  coautores: Coautor[];
  editorial?: string;
  recaudacion_acumulada?: number;
}

export interface RubroRecaudacion {
  rubro: "Streaming Digital" | "Radio & TV Abierta" | "Recitales y En Vivo" | "Internacional CISAC" | "Locales Comerciales & Bares" | "Cine y Teatro";
  monto: number;
  porcentaje: number;
  color: string;
}

export interface Liquidacion {
  id: string;
  numero_recibo: string;
  periodo: string; // Ej: "3° Trimestre 2025"
  trimestre: 3;
  anio: 2025;
  monto_bruto: number;
  retenciones_afip: number;
  aportes_sociales: number;
  gastos_administrativos: number;
  monto_neto: number;
  estado_pago: "Acreditado" | "En proceso de pago" | "Retenido";
  fecha_acreditacion: string;
  comprobante_url: string;
  rubros: RubroRecaudacion[];
}

export interface TramiteReclamo {
  id: string;
  nro_expediente: string;
  tipo_tramite: "Reclamo de Regalías" | "Declaración de Recital en Vivo" | "Actualización Bancaria" | "Certificado de Afiliación" | "Cambio de Categoría";
  obra_relacionada?: string;
  fecha_inicio: string;
  fecha_actualizacion: string;
  estado: "En análisis" | "Aprobado" | "Requiere comprobante" | "Finalizado";
  descripcion: string;
  observaciones_revisor?: string;
}

export interface ArancelCalculo {
  tipo_evento: "fiesta_privada" | "recital_vivo" | "bar_restaurante" | "streaming_live";
  capacidad_asistentes?: number;
  monto_taquilla?: number;
  costo_arancel_estimado: number;
  normativa_aplicable: string;
}

export interface NoticiaInstitucional {
  id: string;
  titulo: string;
  bajada: string;
  fecha: string;
  categoria: "Institucional" | "Liquidaciones" | "Cultura" | "Normativa";
  imagen_url: string;
  tiempo_lectura: string;
}

export interface FilialSADAIC {
  id: string;
  provincia: string;
  ciudad: string;
  direccion: string;
  telefono: string;
  horario: string;
  email: string;
}
