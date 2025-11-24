/** Configurações para o retry com backoff exponencial */
export interface IRetryConfig {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  factor?: number;
  retryCondition?: (error: any) => boolean;
}