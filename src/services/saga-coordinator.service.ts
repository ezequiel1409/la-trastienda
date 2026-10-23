import { IObservabilityPort } from "../domain/ports/observability.port";

export type CompensationAction = () => Promise<void>;

interface RegisteredStep {
  name: string;
  compensate: CompensationAction;
}

/**
 * Coordinador de Sagas para Transacciones Compensatorias (Rollback LIFO)
 */
export class SagaCoordinator {
  private compensations: RegisteredStep[] = [];

  constructor(
    private readonly logger: IObservabilityPort,
    private readonly jobId: string
  ) {}

  /**
   * Registra una acción que debe revertirse si algo falla más adelante
   */
  registerCompensation(stepName: string, action: CompensationAction): void {
    this.compensations.push({ name: stepName, compensate: action });
    this.logger.info(`[SAGA] Acción compensatoria registrada para '${stepName}'`, { jobId: this.jobId });
  }

  /**
   * Ejecuta todas las compensaciones en orden inverso (LIFO)
   */
  async rollback(): Promise<void> {
    if (this.compensations.length === 0) return;

    this.logger.warn(`[SAGA ROLLBACK INICIADO] Revirtiendo ${this.compensations.length} pasos en orden inverso...`, {
      jobId: this.jobId,
    });

    // Invertir para hacer LIFO
    const toRevert = [...this.compensations].reverse();

    for (const step of toRevert) {
      try {
        this.logger.warn(`[SAGA COMPENSACIÓN] Revirtiendo paso '${step.name}'...`, { jobId: this.jobId });
        await step.compensate();
        this.logger.info(`[SAGA COMPENSACIÓN] Paso '${step.name}' revertido exitosamente.`, { jobId: this.jobId });
      } catch (err) {
        this.logger.error(`[SAGA COMPENSACIÓN FALLIDA] No se pudo compensar el paso '${step.name}':`, err, {
          jobId: this.jobId,
        });
      }
    }

    this.logger.warn(`[SAGA ROLLBACK FINALIZADO] Recursos limpiados con éxito.`, { jobId: this.jobId });
    this.compensations = [];
  }
}
