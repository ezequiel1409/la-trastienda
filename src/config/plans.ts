export type PlanId = "INICIAL" | "PROFESIONAL" | "ESCALA";

export interface PlanFeature {
  name: string;
  included: boolean;
  note?: string;
}

export interface StorePlan {
  id: PlanId;
  name: string;
  badge?: string;
  description: string;
  priceMonthlyArs: number;
  priceAnnualMonthlyArs: number; // Precio con descuento anual
  recommended?: boolean;
  highlightFeatures: string[];
  specs: {
    commissionPercent: number; // 0% en todos
    maxProducts: string;
    transactionalEmails: string;
    customDomain: boolean;
    paymentGateways: string;
    qrMarketingKit: boolean;
    supportLevel: string;
    customDevelopmentHours: string;
  };
}

export const STORE_PLANS: Record<PlanId, StorePlan> = {
  INICIAL: {
    id: "INICIAL",
    name: "Plan Emprendedor",
    description: "Ideal para marcas que venden por Instagram y WhatsApp y quieren automatizar sus pedidos.",
    priceMonthlyArs: 24900,
    priceAnnualMonthlyArs: 19900,
    highlightFeatures: [
      "0% comisión por venta",
      "Hasta 100 productos con stock y variantes",
      "Pedidos directos por WhatsApp",
      "Transferencia bancaria con descuento y comprobante",
      "Subdominio gratuito incluido",
    ],
    specs: {
      commissionPercent: 0,
      maxProducts: "Hasta 100 productos",
      transactionalEmails: "No incluidas (coordinación vía WhatsApp)",
      customDomain: false,
      paymentGateways: "Transferencia bancaria y Efectivo",
      qrMarketingKit: true,
      supportLevel: "Soporte estándar por correo y tickets",
      customDevelopmentHours: "No incluye",
    },
  },

  PROFESIONAL: {
    id: "PROFESIONAL",
    name: "Plan Profesional",
    badge: "Más Elegido",
    recommended: true,
    description: "Para marcas de indumentaria, calzado y comercios con local físico que buscan escala.",
    priceMonthlyArs: 44900,
    priceAnnualMonthlyArs: 36900,
    highlightFeatures: [
      "0% comisión por venta",
      "Productos y variantes ilimitadas",
      "Emails automáticos de confirmación y despacho",
      "Mercado Pago, MODO, Payway y Tarjetas integradas",
      "Conexión de dominio propio (.com o .com.ar)",
      "Banners programables y cupones de descuento",
    ],
    specs: {
      commissionPercent: 0,
      maxProducts: "Ilimitados",
      transactionalEmails: "Emails automáticos para comprador y comercio",
      customDomain: true,
      paymentGateways: "Mercado Pago, MODO, Payway, CBU/CVU y Efectivo",
      qrMarketingKit: true,
      supportLevel: "Soporte prioritario por WhatsApp",
      customDevelopmentHours: "1 hora mensual de asistencia técnica",
    },
  },

  ESCALA: {
    id: "ESCALA",
    name: "Plan Escala & Custom",
    badge: "Para Marcas",
    description: "Para empresas consolidadas que requieren infraestructura dedicada y soporte continuo.",
    priceMonthlyArs: 79900,
    priceAnnualMonthlyArs: 64900,
    highlightFeatures: [
      "0% comisión por venta",
      "Infraestructura dedicada y de máxima velocidad",
      "Servidor de correo propio (alta tasa de entrega)",
      "Integración con logística y seguimiento de envíos",
      "Horas mensuales de desarrollo a medida incluidas",
      "Acceso y respaldo de código fuente privado",
    ],
    specs: {
      commissionPercent: 0,
      maxProducts: "Ilimitados",
      transactionalEmails: "Servidor SMTP exclusivo con dominio propio",
      customDomain: true,
      paymentGateways: "Todas las pasarelas + pasarelas personalizadas",
      qrMarketingKit: true,
      supportLevel: "Soporte dedicado 1 a 1 por WhatsApp con el desarrollador",
      customDevelopmentHours: "4 horas mensuales de desarrollo a medida",
    },
  },
};
