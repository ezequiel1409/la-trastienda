/**
 * Tipos de Dominio de la Tienda y el Comercio
 */

export type StoreRubro =
  | "MODA_INDUMENTARIA"
  | "CALZADO"
  | "FERRETERIA"
  | "ALMACEN_KIOSCO"
  | "DECO_HOGAR"
  | "GASTRONOMIA"
  | "GENERAL";

export type PaymentGatewayType =
  | "MERCADOPAGO"
  | "PAYWAY"
  | "MODO"
  | "TRANSFER"
  | "CASH";

export type TenantSubscriptionStatus =
  | "TRIAL_ACTIVE"
  | "ACTIVE_PAID"
  | "GRACE_PERIOD"
  | "SUSPENDED"
  | "DEPROVISIONED";

export interface StoreTenant {
  id: string; // uuid
  slug: string; // ej: "calzados-tito"
  name: string; // ej: "Calzados Tito"
  rubro: StoreRubro;
  whatsappNumber: string; // ej: "+5491145678901"
  adminEmail: string;
  adminInitialPassword?: string;
  enabledPaymentGateways: PaymentGatewayType[];

  // Infraestructura asignada
  cloudD1DatabaseId?: string;
  cloudD1DatabaseName?: string;
  gitRepoFullName?: string; // ej: "usuario/tienda-calzados-tito"
  liveUrl?: string; // ej: "https://calzados-tito.workers.dev"

  // Ciclo de vida y cobros
  subscriptionStatus: TenantSubscriptionStatus;
  trialEndsAt: number; // timestamp ms
  paidUntil?: number; // timestamp ms
  monthlyPriceArs: number;

  createdAt: number;
  updatedAt: number;
}

export interface CreateStoreInput {
  name: string;
  slug: string;
  rubro: StoreRubro;
  whatsappNumber: string;
  adminEmail: string;
  adminPassword?: string;
  enabledPaymentGateways?: PaymentGatewayType[];
  bankName?: string | null;
  cbu?: string | null;
  alias?: string | null;
  cuit?: string | null;
}
