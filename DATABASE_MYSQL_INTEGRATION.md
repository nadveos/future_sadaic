# Guía de Arquitectura e Integración MySQL para SADAIC Moderno

Este proyecto moderniza la interfaz y experiencia de usuario (UI/UX) del portal institucional de **SADAIC** partiendo de los diseños generados en Stitch (ID de proyecto: `6945332248623310548`).

## 1. Estado Actual (Mock Data 100% Tipada)
Actualmente, el portal opera con una capa desacoplada en:
- `types/sadaic.ts`: Modelos de dominio normalizados (`Socio`, `Obra`, `Liquidacion`, `TramiteReclamo`, `ArancelCalculo`).
- `lib/data/mock-sadaic.ts`: Datos realistas y enriquecidos de autores (Gustavo Cerati), obras clásicas registradas con ISWC/IPI, liquidaciones por rubro (streaming, TV/radio, vivo, CISAC) y expedientes.
- `lib/db/service.ts`: Capa de servicio asíncrona con contratos idénticos a los que consumirá la base de datos MySQL real.

---

## 2. Esquema Sugerido para MySQL (SADAIC Legacy / Moderno)

El backend histórico de SADAIC en PHP típicamente se organiza sobre tablas relacionales como las siguientes:

```sql
-- 1. Tabla de Socios / Autores
CREATE TABLE `socios` (
  `id` VARCHAR(36) PRIMARY KEY,
  `matricula_sadaic` VARCHAR(20) NOT NULL UNIQUE,
  `cuit_cuil` VARCHAR(20) NOT NULL UNIQUE,
  `nombre` VARCHAR(100) NOT NULL,
  `apellido` VARCHAR(100) NOT NULL,
  `tipo_socio` ENUM('Activo', 'Administrado', 'Adherente', 'Heredero') NOT NULL,
  `ipi` VARCHAR(30),
  `email` VARCHAR(150),
  `telefono` VARCHAR(50),
  `estado_cuenta` ENUM('Al día', 'Observado', 'En revisión') DEFAULT 'Al día',
  `filial_radicacion` VARCHAR(100),
  `banco_cbu` VARCHAR(22),
  `banco_alias` VARCHAR(50),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Tabla de Obras Musicales
CREATE TABLE `obras` (
  `id` VARCHAR(36) PRIMARY KEY,
  `iswc` VARCHAR(30) NOT NULL UNIQUE,
  `titulo` VARCHAR(200) NOT NULL,
  `subtitulo` VARCHAR(200),
  `genero` VARCHAR(100) NOT NULL,
  `duracion_segundos` INT NOT NULL,
  `duracion_formato` VARCHAR(10) NOT NULL,
  `caracter` ENUM('Original', 'Adaptación', 'Instrumental', 'Banda de Sonido') DEFAULT 'Original',
  `fecha_registro` DATE NOT NULL,
  `estado_registro` ENUM('Aprobada', 'En trámite', 'Observada', 'Pendiente documentación') DEFAULT 'En trámite',
  `editorial` VARCHAR(150),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Tabla Relacional de Coautorías (Porcentajes de Derecho de Autor)
CREATE TABLE `obra_coautores` (
  `id` VARCHAR(36) PRIMARY KEY,
  `obra_id` VARCHAR(36) NOT NULL,
  `socio_id` VARCHAR(36),
  `nombre_completo` VARCHAR(200) NOT NULL,
  `cuit` VARCHAR(20) NOT NULL,
  `rol` ENUM('Compositor', 'Autor de Letra', 'Compositor y Letrista', 'Arreglador') NOT NULL,
  `porcentaje_derecho` DECIMAL(5,2) NOT NULL,
  FOREIGN KEY (`obra_id`) REFERENCES `obras`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`socio_id`) REFERENCES `socios`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Liquidaciones de Regalías
CREATE TABLE `liquidaciones` (
  `id` VARCHAR(36) PRIMARY KEY,
  `socio_id` VARCHAR(36) NOT NULL,
  `numero_recibo` VARCHAR(50) NOT NULL UNIQUE,
  `periodo` VARCHAR(100) NOT NULL,
  `trimestre` TINYINT NOT NULL,
  `anio` INT NOT NULL,
  `monto_bruto` DECIMAL(12,2) NOT NULL,
  `retenciones_afip` DECIMAL(12,2) NOT NULL,
  `aportes_sociales` DECIMAL(12,2) NOT NULL,
  `gastos_administrativos` DECIMAL(12,2) NOT NULL,
  `monto_neto` DECIMAL(12,2) NOT NULL,
  `estado_pago` ENUM('Acreditado', 'En proceso de pago', 'Retenido') DEFAULT 'Acreditado',
  `fecha_acreditacion` DATE NOT NULL,
  `comprobante_url` VARCHAR(255),
  FOREIGN KEY (`socio_id`) REFERENCES `socios`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Expedientes y Trámites Digitales
CREATE TABLE `tramites_expedientes` (
  `id` VARCHAR(36) PRIMARY KEY,
  `socio_id` VARCHAR(36) NOT NULL,
  `nro_expediente` VARCHAR(50) NOT NULL UNIQUE,
  `tipo_tramite` VARCHAR(100) NOT NULL,
  `obra_relacionada` VARCHAR(200),
  `descripcion` TEXT NOT NULL,
  `observaciones_revisor` TEXT,
  `estado` ENUM('En análisis', 'Aprobado', 'Requiere comprobante', 'Finalizado') DEFAULT 'En análisis',
  `fecha_inicio` DATE NOT NULL,
  `fecha_actualizacion` DATE NOT NULL,
  FOREIGN KEY (`socio_id`) REFERENCES `socios`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## 3. Pasos para conectar MySQL en Next.js

Cuando se disponga del servidor MySQL:

1. **Instalar el conector**:
   ```bash
   npm install mysql2
   ```

2. **Configurar variables de entorno en `.env.local`**:
   ```env
   MYSQL_HOST=127.0.0.1
   MYSQL_PORT=3306
   MYSQL_USER=sadaic_app
   MYSQL_PASSWORD=tu_password_seguro
   MYSQL_DATABASE=sadaic_db
   ```

3. **Reemplazar la implementación en `lib/db/service.ts`**:
   Las firmas `getSocioActual()`, `getObrasSocio()`, `getLiquidacionesSocio()`, `searchRepertorio()`, y `registrarNuevaObra()` ya son `async` y devuelven las interfaces TypeScript esperadas, por lo que la UI no requerirá ninguna modificación.
