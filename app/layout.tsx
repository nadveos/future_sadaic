import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "SADAIC | Sociedad Argentina de Autores y Compositores - Portal Institucional",
  description: "Protegemos, administramos y valorizamos la música de nuestros autores y compositores. Gestión colectiva de derechos de autor con transparencia institucional.",
};

const tailwindConfigScript = `
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "surface-container-low": "#eff4ff",
        "surface-container-high": "#dce9ff",
        "tertiary": "#000000",
        "secondary": "#006398",
        "tertiary-container": "#2a1700",
        "border-focus": "#0284C7",
        "inverse-primary": "#b9c7e4",
        "status-warning": "#F59E0B",
        "surface-container": "#e5eeff",
        "on-primary": "#ffffff",
        "primary-fixed": "#d6e3ff",
        "on-secondary-fixed": "#001d31",
        "on-secondary": "#ffffff",
        "background": "#f8f9ff",
        "surface-container-lowest": "#ffffff",
        "on-surface-variant": "#44474d",
        "surface-variant": "#d3e4fe",
        "on-primary-fixed": "#0d1c32",
        "tertiary-fixed": "#ffddb8",
        "accent-cyan": "#06B6D4",
        "surface-tint": "#515f78",
        "on-secondary-container": "#00476e",
        "surface-container-highest": "#d3e4fe",
        "on-tertiary-container": "#b87500",
        "surface-canvas": "#F8FAFC",
        "on-secondary-fixed-variant": "#004b73",
        "inverse-on-surface": "#eaf1ff",
        "surface": "#f8f9ff",
        "text-primary": "#0F172A",
        "on-primary-fixed-variant": "#39475f",
        "tertiary-fixed-dim": "#ffb95f",
        "surface-card": "#FFFFFF",
        "outline-variant": "#c5c6cd",
        "surface-subtle": "#F1F5F9",
        "secondary-container": "#5bb8fe",
        "surface-dim": "#cbdbf5",
        "outline": "#75777e",
        "secondary-fixed": "#cce5ff",
        "on-error-container": "#93000a",
        "error-container": "#ffdad6",
        "text-muted": "#94A3B8",
        "on-background": "#0b1c30",
        "text-secondary": "#475569",
        "primary": "#0a192f",
        "on-error": "#ffffff",
        "inverse-surface": "#213145",
        "status-success": "#10B981",
        "border-subtle": "#E2E8F0",
        "error": "#ba1a1a",
        "primary-container": "#0d1c32",
        "status-error": "#EF4444",
        "on-surface": "#0b1c30",
        "secondary-fixed-dim": "#93ccff",
        "primary-fixed-dim": "#b9c7e4",
        "on-tertiary": "#ffffff",
        "on-primary-container": "#76849f",
        "on-tertiary-fixed-variant": "#653e00",
        "on-tertiary-fixed": "#2a1700",
        "surface-bright": "#f8f9ff"
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px"
      },
      spacing: {
        "gutter-mobile": "1rem",
        "margin": "2rem",
        "space-md": "1rem",
        "space-xs": "0.25rem",
        "gutter": "1.5rem",
        "space-lg": "1.5rem",
        "space-sm": "0.5rem",
        "margin-mobile": "1rem",
        "space-xl": "2.5rem"
      },
      fontFamily: {
        "label-lg": ["Inter", "sans-serif"],
        "display-lg-mobile": ["Plus Jakarta Sans", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "label-md": ["Inter", "sans-serif"],
        "body-sm": ["Inter", "sans-serif"],
        "headline-xl": ["Plus Jakarta Sans", "sans-serif"],
        "label-sm": ["Inter", "sans-serif"],
        "headline-md": ["Plus Jakarta Sans", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "headline-xl-mobile": ["Plus Jakarta Sans", "sans-serif"],
        "display-lg": ["Plus Jakarta Sans", "sans-serif"],
        "headline-sm": ["Plus Jakarta Sans", "sans-serif"],
        "headline-lg": ["Plus Jakarta Sans", "sans-serif"]
      }
    }
  }
};
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* Tailwind Engine CDN from Stitch */}
        <script src="https://cdn.tailwindcss.com"></script>
        <script dangerouslySetInnerHTML={{ __html: tailwindConfigScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-surface font-body-md text-on-surface antialiased">
        {children}
      </body>
    </html>
  );
}
