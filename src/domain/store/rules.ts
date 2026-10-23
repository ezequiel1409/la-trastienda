import { ValidationError } from "../errors";
import { CreateStoreInput, StoreRubro } from "./types";

const RESERVED_SLUGS = new Set([
  "admin",
  "api",
  "app",
  "auth",
  "billing",
  "dashboard",
  "latrastienda",
  "login",
  "nuevo",
  "status",
  "support",
  "test",
  "trastienda",
  "www",
]);

const VALID_RUBROS: StoreRubro[] = [
  "MODA_INDUMENTARIA",
  "CALZADO",
  "FERRETERIA",
  "ALMACEN_KIOSCO",
  "DECO_HOGAR",
  "GASTRONOMIA",
  "GENERAL",
];

/**
 * Normaliza un nombre comercial a slug apto para URL y repos
 * Ej: "Don Tito: Calzados & Moda!" -> "don-tito-calzados-moda"
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita acentos
    .replace(/[^a-z0-9\s-]/g, "") // quita caracteres inválidos
    .replace(/\s+/g, "-") // espacios a guiones
    .replace(/-+/g, "-") // múltiples guiones a uno
    .replace(/^-+/, "") // limpia guiones al inicio
    .replace(/-+$/, ""); // limpia guiones al final
}

/**
 * Valida de forma estricta los datos de entrada para la creación de una tienda
 */
export function validateStoreInput(input: CreateStoreInput): void {
  const fields: Record<string, string> = {};

  // 1. Nombre comercial
  if (!input.name || input.name.trim().length < 2) {
    fields.name = "El nombre del comercio debe tener al menos 2 caracteres.";
  } else if (input.name.trim().length > 60) {
    fields.name = "El nombre del comercio no puede superar los 60 caracteres.";
  }

  // 2. Slug
  const cleanSlug = slugify(input.slug || input.name || "");
  if (!cleanSlug || cleanSlug.length < 3) {
    fields.slug = "El subdominio/slug debe tener al menos 3 caracteres.";
  } else if (cleanSlug.length > 40) {
    fields.slug = "El subdominio/slug no puede superar los 40 caracteres.";
  } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(cleanSlug)) {
    fields.slug = "El subdominio solo puede contener letras minúsculas, números y guiones simples.";
  } else if (RESERVED_SLUGS.has(cleanSlug)) {
    fields.slug = `El nombre '${cleanSlug}' está reservado por el sistema. Por favor elegí otro.`;
  }

  // 3. Rubro
  if (!VALID_RUBROS.includes(input.rubro)) {
    fields.rubro = "El rubro seleccionado no es válido.";
  }

  // 4. WhatsApp
  const phoneClean = (input.whatsappNumber || "").replace(/[^0-9+]/g, "");
  if (!phoneClean || phoneClean.length < 8) {
    fields.whatsappNumber = "Ingresá un número de WhatsApp válido (ej: +54 9 11 1234 5678).";
  }

  // 5. Email de administrador
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!input.adminEmail || !emailRegex.test(input.adminEmail.trim())) {
    fields.adminEmail = "Ingresá un correo electrónico válido para tu cuenta de administrador.";
  }

  // 6. Contraseña (si se proporciona)
  if (input.adminPassword && input.adminPassword.length < 6) {
    fields.adminPassword = "La contraseña debe tener al menos 6 caracteres.";
  }

  if (Object.keys(fields).length > 0) {
    throw new ValidationError("Revisá los datos ingresados en el formulario.", fields);
  }
}
