/**
 * Clases de error de Dominio (Clean Architecture)
 */

export abstract class DomainError extends Error {
  public abstract readonly code: string;
  public readonly statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}

export class ValidationError extends DomainError {
  public readonly code = "VALIDATION_ERROR";
  public readonly fields?: Record<string, string>;

  constructor(message: string, fields?: Record<string, string>) {
    super(message, 422);
    this.fields = fields;
  }
}

export class SlugAlreadyExistsError extends DomainError {
  public readonly code = "SLUG_ALREADY_EXISTS";

  constructor(slug: string) {
    super(`El subdominio '${slug}' ya está en uso por otro comercio.`, 409);
  }
}

export class ProvisioningFailedError extends DomainError {
  public readonly code = "PROVISIONING_FAILED";
  public readonly step?: string;

  constructor(message: string, step?: string) {
    super(message, 500);
    this.step = step;
  }
}

export class TenantNotFoundError extends DomainError {
  public readonly code = "TENANT_NOT_FOUND";

  constructor(identifier: string) {
    super(`No se encontró el comercio '${identifier}'.`, 404);
  }
}
