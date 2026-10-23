/**
 * Puerto de Observabilidad y Logs Estructurados
 */

export interface LogContext {
  jobId?: string;
  traceId?: string;
  step?: string;
  storeSlug?: string;
  durationMs?: number;
  [key: string]: unknown;
}

export interface IObservabilityPort {
  info(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  error(message: string, error?: Error | unknown, context?: LogContext): void;
}
