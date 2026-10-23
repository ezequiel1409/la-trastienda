"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroDomainInput() {
  const [storeName, setStoreName] = useState("");
  const router = useRouter();

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    const query = storeName.trim() ? `?name=${encodeURIComponent(storeName.trim())}` : "";
    router.push(`/nuevo${query}`);
  };

  return (
    <form onSubmit={handleStart} className="w-full max-w-xl mx-auto pt-2">
      <div className="flex flex-col sm:flex-row items-center gap-2.5 bg-white p-2 sm:p-2.5 rounded-2xl border border-stone-300 shadow-md focus-within:ring-2 focus-within:ring-stone-900 focus-within:border-stone-900 transition">
        <div className="flex-1 w-full px-3 py-1 flex items-center gap-2">
          <span className="text-stone-400 font-bold text-sm hidden sm:inline select-none">
            latrastienda.com/
          </span>
          <input
            type="text"
            placeholder="nombre-de-tu-marca"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="w-full font-medium text-stone-900 placeholder:text-stone-400 focus:outline-none text-sm sm:text-base bg-transparent"
          />
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm sm:text-base px-6 py-3 rounded-xl shadow-xs transition shrink-0"
        >
          <span>Crear Tienda</span>
          <ArrowRight className="w-4 h-4 text-stone-300" />
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 pt-3 text-xs text-stone-500">
        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
        <span>14 días de prueba gratis · No requiere tarjeta de crédito</span>
      </div>
    </form>
  );
}
