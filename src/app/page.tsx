import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  QrCode,
  Zap,
  Sparkles,
  Percent,
  Layers,
  Smartphone,
  ShieldCheck,
  MessageCircle,
  ShoppingBag,
} from "lucide-react";
import { HeroDomainInput } from "@/components/landing/HeroDomainInput";
import { SavingsCalculator } from "@/components/landing/SavingsCalculator";
import { PlansComparison } from "@/components/landing/PlansComparison";
import { FaqAccordion } from "@/components/landing/FaqAccordion";

export default function HomePage() {
  return (
    <div className="space-y-28 py-12 px-4 max-w-6xl mx-auto">
      {/* 1. HERO SECTION ALTA CONVERSIÓN */}
      <section className="text-center space-y-6 pt-4 pb-2">
        <div className="inline-flex items-center gap-2 bg-stone-100 border border-stone-200 text-stone-700 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-stone-700" />
          <span>La plataforma de ecommerce para marcas independientes</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-stone-950 tracking-tight max-w-4xl mx-auto leading-[1.1]">
          Vendé por internet con tu propia tienda online,{" "}
          <span className="text-stone-800 underline decoration-stone-300 decoration-wavy decoration-2">
            sin comisiones sobre tus ventas.
          </span>
        </h1>

        <p className="text-base sm:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
          Centralizá tus ventas de Instagram y WhatsApp en una web profesional: catálogo con talles y colores, cobro automático y control de stock en tiempo real.
        </p>

        {/* INPUT DIRECTO DE NOMBRE ESTILO TIENDANUBE */}
        <HeroDomainInput />

        {/* BENEFICIOS DESTACADOS */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-xs sm:text-sm font-medium text-stone-600">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 0% comisión por venta
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Cobro directo a tu CBU o Mercado Pago
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 14 días de prueba gratis sin tarjeta
          </span>
        </div>
      </section>

      {/* 2. PUNTOS DE DOLOR RESUELTOS (¿POR QUÉ LA TRASTIENDA?) */}
      <section className="space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Todo lo que tu marca necesita para vender más y trabajar menos
          </h2>
          <p className="text-stone-500 text-sm">
            Diseñada para resolver los problemas reales de los comercios y emprendimientos:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 bg-rose-50 text-rose-700 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-stone-900">
              Basta de responder &ldquo;Precio por privado&rdquo;
            </h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Pegá el link de tu tienda en tu biografía de Instagram y WhatsApp. Tus clientes eligen el producto, ven el stock en vivo y pagan solos sin hacerte perder tiempo.
            </p>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-stone-900">
              Variantes exactas: Talles y Colores
            </h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Cada prenda o artículo tiene su foto por color y stock real por talle (numérico o letras). Si se agota un talle, el sistema no permite comprarlo para evitar sobreventas.
            </p>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-3">
            <div className="w-10 h-10 bg-amber-50 text-amber-700 rounded-xl flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-stone-900">
              Todos los Medios de Pago Locales
            </h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Cobrá por transferencia con descuento automático (CBU/CVU), Mercado Pago, MODO, Payway o efectivo contra entrega. Todos los bancos y billeteras de Argentina integrados.
            </p>
          </div>
        </div>
      </section>

      {/* 3. SIMULADOR DE AHORRO EN COMISIONES */}
      <section>
        <SavingsCalculator />
      </section>

      {/* 4. PASO A PASO: CÓMO FUNCIONA */}
      <section className="bg-white border border-stone-200 rounded-3xl p-8 sm:p-12 shadow-xs space-y-10">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Rápido y sin vueltas
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Tu tienda lista en 3 simples pasos
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative">
          <div className="space-y-3 text-center sm:text-left">
            <div className="w-10 h-10 bg-stone-900 text-white rounded-xl flex items-center justify-center font-bold text-base shadow-xs mx-auto sm:mx-0">
              1
            </div>
            <h3 className="text-base font-bold text-stone-900">Elegí tu nombre y rubro</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Completás el formulario con el nombre de tu marca y el rubro de tu negocio (indumentaria, calzado, ferretería, etc.).
            </p>
          </div>

          <div className="space-y-3 text-center sm:text-left">
            <div className="w-10 h-10 bg-stone-900 text-white rounded-xl flex items-center justify-center font-bold text-base shadow-xs mx-auto sm:mx-0">
              2
            </div>
            <h3 className="text-base font-bold text-stone-900">El orquestador fabrica tu tienda</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              En 30 segundos se crea tu base de datos dedicada, se configuran las pasarelas de pago y se publica tu catálogo en la nube.
            </p>
          </div>

          <div className="space-y-3 text-center sm:text-left">
            <div className="w-10 h-10 bg-stone-900 text-white rounded-xl flex items-center justify-center font-bold text-base shadow-xs mx-auto sm:mx-0">
              3
            </div>
            <h3 className="text-base font-bold text-stone-900">Cargás tus productos y vendés</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Ingresás a tu panel de control, subís tus fotos y precios, y compartís el link con tus clientes para empezar a facturar.
            </p>
          </div>
        </div>
      </section>

      {/* 5. SECCIÓN DE PLANES Y COMPARATIVA */}
      <section id="planes">
        <PlansComparison />
      </section>

      {/* 6. PREGUNTAS FRECUENTES (FAQ INTERACTIVO) */}
      <section className="space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Preguntas Frecuentes
          </h2>
          <p className="text-stone-500 text-sm">
            Todo lo que necesitás saber antes de abrir tu tienda en La Trastienda:
          </p>
        </div>

        <FaqAccordion />
      </section>

      {/* 7. CTA FINAL */}
      <section className="text-center bg-stone-900 text-white rounded-3xl p-8 sm:p-14 space-y-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Empezá a vender online hoy mismo
        </h2>
        <p className="text-stone-400 max-w-xl mx-auto text-sm sm:text-base">
          Probá la plataforma durante 14 días sin costo ni tarjeta de crédito. Tu tienda queda activa en menos de 2 minutos.
        </p>
        <Link
          href="/nuevo"
          className="inline-flex items-center gap-2 bg-white text-stone-950 hover:bg-stone-100 font-extrabold px-8 py-3.5 rounded-xl shadow-md transition"
        >
          <Zap className="w-4 h-4 text-amber-500" />
          <span>Crear mi Tienda Gratis</span>
        </Link>
      </section>
    </div>
  );
}
