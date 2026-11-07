import { CheckHealthUseCase } from '../../application/use-cases/system/checkHealth.useCase.js';

export interface HealthUseCasesComposition {
  checkHealthUseCase: CheckHealthUseCase;
}

export function buildHealthUseCases(): HealthUseCasesComposition {
  return {
    checkHealthUseCase: new CheckHealthUseCase(),
  };
}
