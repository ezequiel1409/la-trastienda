import { IObservabilityPort, LogContext } from "../../domain/ports/observability.port";

export class ConsoleLoggerAdapter implements IObservabilityPort {
  private format(level: string, message: string, context?: LogContext): string {
    const time = new Date().toISOString();
    const ctx = context ? ` [${JSON.stringify(context)}]` : "";
    return `[${time}] [${level}] ${message}${ctx}`;
  }

  info(message: string, context?: LogContext): void {
    console.log(this.format("INFO", message, context));
  }

  warn(message: string, context?: LogContext): void {
    console.warn(this.format("WARN", message, context));
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errDetails = error instanceof Error ? { errorName: error.name, errorMsg: error.message, stack: error.stack } : { rawError: error };
    console.error(this.format("ERROR", message, { ...context, ...errDetails }));
  }
}
