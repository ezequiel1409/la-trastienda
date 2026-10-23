import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { Store, Lock, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "La Trastienda | Plataforma de Tiendas Online",
  description: "Creá tu tienda online independiente en minutos. Múltiples medios de pago, catálogo con variantes y 0% de comisión por venta.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col justify-between">
        <header className="border-b border-stone-200 bg-white/90 backdrop-blur sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 text-stone-900 font-bold text-xl tracking-tight">
              <div className="w-9 h-9 bg-stone-900 text-stone-100 rounded-lg flex items-center justify-center shadow-xs">
                <Store className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-stone-950">La Trastienda</span>
            </Link>

            <nav className="flex items-center gap-6 text-sm font-medium">
              <Link href="/#planes" className="text-stone-600 hover:text-stone-950 transition hidden sm:inline">
                Planes y Precios
              </Link>
              <Link
                href="/guia"
                className="text-stone-600 hover:text-stone-950 flex items-center gap-1.5 transition"
              >
                <BookOpen className="w-4 h-4 text-stone-500" />
                <span>Manual de Uso</span>
              </Link>
              <Link
                href="/nuevo"
                className="bg-stone-900 hover:bg-stone-800 text-white px-4 py-2 rounded-lg font-semibold shadow-xs transition"
              >
                Crear Tienda Gratis
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-stone-200 bg-stone-100/60 py-10 text-center text-sm text-stone-500">
          <div className="max-w-6xl mx-auto px-4 space-y-4">
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-stone-600">
              <Link href="/#planes" className="hover:text-stone-900">Planes y Precios</Link>
              <Link href="/guia" className="hover:text-stone-900">Manual de Uso para Comerciantes</Link>
              <Link href="/nuevo" className="hover:text-stone-900">Crear Tienda Gratis</Link>
            </div>

            <p className="font-semibold text-stone-800">La Trastienda</p>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Plataforma de comercio electrónico independiente para marcas y comercios. 0% de comisión por venta.
            </p>

            <div className="pt-2">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1 text-[11px] text-stone-400 hover:text-stone-600 transition"
              >
                <Lock className="w-3 h-3" />
                <span>Acceso Administrador</span>
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
