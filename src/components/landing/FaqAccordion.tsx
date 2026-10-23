"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: "¿Cobran comisión por las ventas que hago en mi tienda?",
    answer:
      "No, absolutamente 0% de comisión. A diferencia de plataformas que te cobran un porcentaje sobre cada producto que vendés, en La Trastienda tu abono es 100% fijo. Toda la recaudación va directo a tu cuenta bancaria o tu Mercado Pago sin intermediarios.",
  },
  {
    question: "¿Qué pasa cuando terminan los 14 días de prueba gratis?",
    answer:
      "Al día 14 podés activar tu abono mensual fijo mediante una simple transferencia bancaria. Si decidís no continuar, tu tienda se pausa automáticamente sin que se te cobre nada (nunca te pedimos tarjeta de crédito para arrancar).",
  },
  {
    question: "¿Puedo conectar mi propio dominio .com o .com.ar?",
    answer:
      "¡Sí! Tu tienda inicia con una dirección gratuita .workers.dev y podés conectar tu dominio personalizado propio (.com, .com.ar, .shop, etc.) cuando quieras con una simple configuración de DNS.",
  },
  {
    question: "¿Cómo cobran mis clientes en la tienda?",
    answer:
      "La tienda viene configurada con todas las opciones populares de Argentina: Transferencia bancaria con descuento automático (CBU/CVU y carga de comprobante), Mercado Pago, MODO, Payway y cobro en efectivo al retirar.",
  },
  {
    question: "¿Necesito conocimientos técnicos o saber programar?",
    answer:
      "Para nada. El sistema se encarga de fabricar tu tienda, crear la base de datos y configurar la infraestructura. Vos solo entrás a tu panel de control a subir tus fotos, precios y talles como si usaras una red social.",
  },
  {
    question: "¿Tiene control de variantes (talles y colores) y stock?",
    answer:
      "Sí, cuenta con gestión profesional de variantes con fotos asociadas a cada color, talles numéricos o alfanuméricos y reserva automática de stock para que nunca sobrevendas una prenda o artículo.",
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="max-w-3xl mx-auto divide-y divide-stone-200 border-y border-stone-200">
      {FAQS.map((faq, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div key={idx} className="py-5">
            <button
              onClick={() => toggle(idx)}
              className="w-full flex items-center justify-between gap-4 text-left font-bold text-stone-900 hover:text-stone-700 transition"
            >
              <span className="text-base sm:text-lg">{faq.question}</span>
              <ChevronDown
                className={`w-5 h-5 text-stone-400 transition-transform duration-200 shrink-0 ${
                  isOpen ? "rotate-180 text-stone-900" : ""
                }`}
              />
            </button>

            {isOpen && (
              <p className="mt-3 text-sm sm:text-base text-stone-600 leading-relaxed pr-8">
                {faq.answer}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
