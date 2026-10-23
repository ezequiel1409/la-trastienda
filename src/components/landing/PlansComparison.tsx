"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ArrowRight, Zap, HelpCircle } from "lucide-react";
import { STORE_PLANS, PlanId } from "@/config/plans";

export function PlansComparison() {
  const [annualBilling, setAnnualBilling] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanId>("PROFESIONAL");

  const formatArs = (num: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(num);
  };

  const planList = Object.values(STORE_PLANS);

  return (
    <div className="space-y-12">
      {/* HEADER Y TOGGLE ANUAL */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-700 bg-stone-100 border border-stone-200 px-3 py-1 rounded-full uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5 text-amber-600" />
          <span>Planes Transparentes · 14 días de prueba gratis</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          Elegí el plan que mejor acompaña el ritmo de tu negocio
        </h2>
        <p className="text-stone-600 text-sm sm:text-base">
          Todos los planes incluyen <strong>0% de comisión por venta</strong> y 14 días de prueba sin ingresar tarjeta de crédito.
        </p>

        {/* TOGGLE ANUAL */}
        <div className="pt-2 flex items-center justify-center gap-3 text-xs sm:text-sm font-semibold text-stone-700">
          <span className={!annualBilling ? "text-stone-950 font-bold" : "text-stone-400"}>
            Facturación Mensual
          </span>
          <button
            type="button"
            onClick={() => setAnnualBilling(!annualBilling)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
              annualBilling ? "bg-stone-900 justify-end" : "bg-stone-300 justify-start"
            }`}
          >
            <div className="bg-white w-4 h-4 rounded-full shadow-md" />
          </button>
          <span className={annualBilling ? "text-stone-950 font-bold flex items-center gap-1.5" : "text-stone-400"}>
            <span>Facturación Anual</span>
            <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
              Ahorrá 2 meses
            </span>
          </span>
        </div>
      </div>

      {/* TARJETAS DE PLANES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {planList.map((plan) => {
          const isRec = plan.recommended;
          const price = annualBilling ? plan.priceAnnualMonthlyArs : plan.priceMonthlyArs;

          return (
            <div
              key={plan.id}
              className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all relative ${
                isRec
                  ? "bg-stone-950 text-white shadow-xl ring-2 ring-stone-900"
                  : "bg-white text-stone-900 border border-stone-200 shadow-xs"
              }`}
            >
              {plan.badge && (
                <div
                  className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
                    isRec ? "bg-emerald-500 text-stone-950 shadow-sm" : "bg-stone-800 text-white"
                  }`}
                >
                  {plan.badge}
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold tracking-tight">{plan.name}</h3>
                  <p className={`text-xs mt-1.5 leading-relaxed ${isRec ? "text-stone-300" : "text-stone-500"}`}>
                    {plan.description}
                  </p>
                </div>

                <div className="border-y border-stone-200/20 py-4">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight">
                      {formatArs(price)}
                    </span>
                    <span className={`text-xs ${isRec ? "text-stone-400" : "text-stone-500"}`}>
                      / mes
                    </span>
                  </div>
                  {annualBilling && (
                    <p className={`text-[11px] mt-1 ${isRec ? "text-emerald-400" : "text-emerald-700"}`}>
                      Facturado anualmente ({formatArs(price * 12)} / año)
                    </p>
                  )}
                </div>

                <ul className="space-y-3 text-xs sm:text-sm">
                  {plan.highlightFeatures.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <Check
                        className={`w-4 h-4 shrink-0 mt-0.5 ${
                          isRec ? "text-emerald-400" : "text-emerald-600"
                        }`}
                      />
                      <span className={isRec ? "text-stone-200" : "text-stone-700"}>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <Link
                  href={`/nuevo?plan=${plan.id}`}
                  className={`w-full inline-flex items-center justify-center gap-2 font-bold text-sm px-6 py-3 rounded-xl transition shadow-xs ${
                    isRec
                      ? "bg-white text-stone-950 hover:bg-stone-100"
                      : "bg-stone-900 text-white hover:bg-stone-800"
                  }`}
                >
                  <span>Probar 14 días gratis</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* TABLA COMPARATIVA DETALLADA */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="border-b border-stone-100 pb-4">
          <h3 className="text-lg font-bold text-stone-900">
            Comparativa detallada de características
          </h3>
          <p className="text-xs text-stone-500">
            Conocé en detalle lo que incluye cada nivel de infraestructura y servicios.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-stone-50 text-stone-700 font-bold border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Característica</th>
                <th className="py-3 px-4">Emprendedor</th>
                <th className="py-3 px-4 bg-stone-100/70 font-black text-stone-950">Profesional</th>
                <th className="py-3 px-4">Escala & Custom</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-600">
              <tr>
                <td className="py-3.5 px-4 font-semibold text-stone-900">Comisión por venta</td>
                <td className="py-3.5 px-4 font-bold text-emerald-600">0%</td>
                <td className="py-3.5 px-4 font-bold text-emerald-600 bg-stone-50/50">0%</td>
                <td className="py-3.5 px-4 font-bold text-emerald-600">0%</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-stone-900">Límite de productos</td>
                <td className="py-3.5 px-4">Hasta 100 productos</td>
                <td className="py-3.5 px-4 font-bold text-stone-900 bg-stone-50/50">Ilimitados</td>
                <td className="py-3.5 px-4 font-bold text-stone-900">Ilimitados</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-stone-900">
                  Correos automáticos (Emails transaccionales)
                </td>
                <td className="py-3.5 px-4 text-stone-400">Vía WhatsApp</td>
                <td className="py-3.5 px-4 text-stone-900 bg-stone-50/50">
                  <span className="font-bold">Incluidos</span> (Confirmación de compra, despacho y pago)
                </td>
                <td className="py-3.5 px-4 text-stone-900">
                  <span className="font-bold">Servidor SMTP exclusivo</span> con tu propio dominio
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-stone-900">Pasarelas de cobro</td>
                <td className="py-3.5 px-4">CBU/CVU y Efectivo</td>
                <td className="py-3.5 px-4 font-medium text-stone-900 bg-stone-50/50">
                  Mercado Pago, MODO, Payway, Tarjetas y CBU
                </td>
                <td className="py-3.5 px-4 font-medium text-stone-900">
                  Todas las pasarelas + pasarelas a medida
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-stone-900">Dominio propio (.com / .com.ar)</td>
                <td className="py-3.5 px-4 text-stone-400">Subdominio gratis</td>
                <td className="py-3.5 px-4 font-bold text-emerald-600 bg-stone-50/50">Incluido</td>
                <td className="py-3.5 px-4 font-bold text-emerald-600">Incluido</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-stone-900">Horas de desarrollo a medida</td>
                <td className="py-3.5 px-4 text-stone-400">—</td>
                <td className="py-3.5 px-4 font-medium text-stone-900 bg-stone-50/50">1 hora mensual de soporte</td>
                <td className="py-3.5 px-4 font-bold text-stone-900">4 horas mensuales de código personalizado</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-stone-900">Nivel de soporte</td>
                <td className="py-3.5 px-4">Email y tickets</td>
                <td className="py-3.5 px-4 font-bold text-stone-900 bg-stone-50/50">WhatsApp prioritario</td>
                <td className="py-3.5 px-4 font-bold text-stone-900">Soporte directo 1 a 1 con desarrollador</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-stone-900">Cartel con QR para mostrador físico</td>
                <td className="py-3.5 px-4 font-bold text-emerald-600">Incluido</td>
                <td className="py-3.5 px-4 font-bold text-emerald-600 bg-stone-50/50">Incluido</td>
                <td className="py-3.5 px-4 font-bold text-emerald-600">Incluido</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
