"use client";

import { useState } from "react";
import { Calculator, Check, ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";

export function SavingsCalculator() {
  const [monthlySales, setMonthlySales] = useState<number>(1500000);

  // Comisión promedio de Mercado Libre (14%)
  const mcnmeli = Math.round(monthlySales * 0.14);

  // Comisión promedio Tiendanube (Abono ~$15.000 + 2% por transacción)
  const tiendanubeCost = Math.round(15000 + monthlySales * 0.02);

  // La Trastienda: $15.000 fijo mensual, 0% comisiones
  const laTrastiendaCost = 15000;

  // Ahorro mensual respecto a Tiendanube y ML
  const monthlySavingsVsTN = Math.max(0, tiendanubeCost - laTrastiendaCost);
  const annualSavingsVsTN = monthlySavingsVsTN * 12;

  const formatArs = (val: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="bg-stone-900 text-stone-100 rounded-3xl p-6 sm:p-12 shadow-md">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 bg-amber-950/60 border border-amber-800/80 px-3 py-1 rounded-full uppercase tracking-wider">
            <Calculator className="w-3.5 h-3.5" />
            <span>Simulador de Ahorro Real</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            ¿Cuánto dinero estás regalando en comisiones?
          </h2>
          <p className="text-stone-400 text-sm sm:text-base max-w-xl mx-auto">
            A diferencia de otras plataformas que te cobran un porcentaje de cada venta que hacés, en La Trastienda tu comisión es del <strong>0%</strong>.
          </p>
        </div>

        {/* SLIDER DE VENTAS */}
        <div className="bg-stone-800/80 border border-stone-700/80 rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <label className="text-sm font-semibold text-stone-300">
              Tus ventas mensuales estimadas:
            </label>
            <span className="text-2xl font-black text-white font-mono">
              {formatArs(monthlySales)}
            </span>
          </div>

          <input
            type="range"
            min={300000}
            max={8000000}
            step={100000}
            value={monthlySales}
            onChange={(e) => setMonthlySales(Number(e.target.value))}
            className="w-full h-2 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />

          <div className="flex justify-between text-[11px] text-stone-500 font-mono">
            <span>$300.000</span>
            <span>$4.000.000</span>
            <span>$8.000.000+</span>
          </div>
        </div>

        {/* COMPARATIVA DE COSTOS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* MERCADO LIBRE */}
          <div className="bg-stone-800/40 border border-stone-700/50 rounded-2xl p-5 space-y-2">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
              En Mercado Libre (~14%)
            </span>
            <p className="text-2xl font-bold text-red-400 font-mono">
              {formatArs(mcnmeli)} <span className="text-xs font-normal text-stone-400">/mes</span>
            </p>
            <p className="text-xs text-stone-500">
              Te retienen una comisión enorme por cada producto vendido.
            </p>
          </div>

          {/* TIENDANUBE */}
          <div className="bg-stone-800/40 border border-stone-700/50 rounded-2xl p-5 space-y-2">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
              En Tiendanube (Plan + 2%)
            </span>
            <p className="text-2xl font-bold text-amber-300 font-mono">
              {formatArs(tiendanubeCost)} <span className="text-xs font-normal text-stone-400">/mes</span>
            </p>
            <p className="text-xs text-stone-500">
              Abono mensual + porcentaje por cada venta procesada.
            </p>
          </div>

          {/* LA TRASTIENDA */}
          <div className="bg-emerald-950/60 border border-emerald-500/50 rounded-2xl p-5 space-y-2 relative overflow-hidden">
            <div className="absolute top-2 right-2 text-[10px] font-black bg-emerald-500 text-stone-950 px-2 py-0.5 rounded-full uppercase">
              0% Comisión
            </div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              En La Trastienda
            </span>
            <p className="text-2xl font-bold text-white font-mono">
              $15.000 <span className="text-xs font-normal text-emerald-300">/mes fijo</span>
            </p>
            <p className="text-xs text-emerald-200/80">
              Cero comisiones. No importa si vendés $1M o $10M.
            </p>
          </div>
        </div>

        {/* BANNER RESULTADO DE AHORRO */}
        <div className="bg-gradient-to-r from-emerald-900/60 to-stone-800 border border-emerald-500/40 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-emerald-400 text-sm font-bold">
              <TrendingUp className="w-4 h-4" />
              <span>Ahorro proyectado para tu negocio</span>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white">
              {formatArs(annualSavingsVsTN)}{" "}
              <span className="text-sm font-normal text-stone-300">al año en tu bolsillo</span>
            </p>
            <p className="text-xs text-stone-400">
              Dinero limpio que podés reinvertir en stock, publicidad o ganancia personal.
            </p>
          </div>

          <Link
            href="/nuevo"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-sm font-extrabold px-6 py-3 rounded-xl transition shrink-0 shadow-md"
          >
            <span>Empezar a ahorrar hoy</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
