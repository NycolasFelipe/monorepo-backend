import ErrorMessage from "@errors/ErrorMessage";

// Interfaces
import { IGatewayConstructor, IRetryConfig, ISendRequestResponse } from "../interfaces";

/**
 * Serviço gateway para centralizar e gerenciar requisições HTTP
 */
export class GatewayService {
  private SERVICE_NAME: string;
  private PORT: string;
  private REQUEST_AUTH_HEADER: string;
  private REQUEST_URL: string;
  private REQUEST_METHOD: string;
  private REQUEST_BODY: any;
  private CUSTOM_HEADERS: Record<string, string>;
  private retryConfig: IRetryConfig;

  /**
   * Construtor da classe GatewayService
   * @param {IGatewayConstructor} properties - Propriedades de configuração do gateway
   * @param {IRetryConfig} retryConfig - Configurações para retry com backoff
   */
  constructor(properties: IGatewayConstructor, retryConfig: IRetryConfig = {}) {
    this.SERVICE_NAME = properties.SERVICE_NAME;
    this.PORT = properties.PORT;
    this.REQUEST_AUTH_HEADER = properties.REQUEST_AUTH_HEADER;
    this.REQUEST_URL = properties.REQUEST_URL;
    this.REQUEST_METHOD = properties.REQUEST_METHOD;
    this.REQUEST_BODY = properties.REQUEST_BODY;
    this.CUSTOM_HEADERS = properties.CUSTOM_HEADERS || {};

    // Configurações padrão para o retry
    this.retryConfig = {
      maxRetries: retryConfig.maxRetries ?? 3,
      initialDelay: retryConfig.initialDelay ?? 1000,
      maxDelay: retryConfig.maxDelay ?? 30000,
      factor: retryConfig.factor ?? 2,
      retryCondition: retryConfig.retryCondition ?? this.defaultRetryCondition
    }
  }

  /**
   * Condição padrão para determinar se uma requisição deve ser retentada
   * @private
   * @param {any} error - Erro ocorrido na requisição
   * @returns {boolean} True se deve retentar
   */
  private defaultRetryCondition(error: any): boolean {
    // Retenta em erros de rede, timeout e status codes 5xx
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return true; // Erros de rede
    }

    if (error instanceof ErrorMessage) {
      const status = error?.status || 500;
      return status >= 500;
    }

    return false;
  }

  /**
   * Calcula o delay para o próximo retry usando backoff exponencial
   * @private
   * @param {number} attempt - Número da tentativa atual
   * @returns {number} Delay em milissegundos
   */
  private calculateDelay(attempt: number): number {
    const delay = this.retryConfig.initialDelay! * Math.pow(this.retryConfig.factor!, attempt - 1);
    return Math.min(delay, this.retryConfig.maxDelay!);
  }

  /**
   * Aguarda um determinado tempo antes do próximo retry
   * @private
   * @param {number} delay - Delay em milissegundos
   * @returns {Promise<void>}
   */
  private async wait(delay: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  /**
   * Executa uma função com retry e backoff exponencial
   * @private
   * @template T - Tipo do retorno da função
   * @param {() => Promise<T>} fn - Função a ser executada
   * @param {string} operationName - Nome da operação para logs
   * @returns {Promise<T>} Resultado da função
   * @throws {ErrorMessage} Erro após todas as tentativas
   */
  private async executeWithRetry<T>(
    fn: () => Promise<T>,
    operationName: string
  ): Promise<T> {
    let lastError: any;

    for (let attempt = 1; attempt <= this.retryConfig.maxRetries!; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;

        // Verifica se deve retentar baseado na condição configurada
        const shouldRetry = this.retryConfig.retryCondition!(error) &&
          attempt < this.retryConfig.maxRetries!;

        if (shouldRetry) {
          const delay = this.calculateDelay(attempt);
          console.warn(
            `[${this.SERVICE_NAME}] Tentativa ${attempt}/${this.retryConfig.maxRetries} falhou para ${operationName}. ` +
            `Retentando em ${delay}ms. Erro: ${(error as any)?.message}`
          );

          await this.wait(delay);
        } else {
          break;
        }
      }
    }

    console.error(
      `[${this.SERVICE_NAME}] Todas as ${this.retryConfig.maxRetries} tentativas falharam para ${operationName}`
    );
    throw lastError;
  }

  /**
   * Configurações comuns para as requisições HTTP
   * @private
   * @param {string} method - Método HTTP (GET, POST, PUT, etc.)
   * @param {string} headerAuth - Token de autorização para o header
   * @param {any} data - Dados para o corpo da requisição
   * @returns {RequestInit} Objeto de configuração para fetch API
   */
  private getRequestConfig(method: string, headerAuth: string, data?: any): RequestInit {
    const body = ["GET", "HEAD", "OPTIONS"].includes(method) ? null : JSON.stringify(data);

    // Headers base
    const headers: Record<string, string> = {
      "Authorization": headerAuth,
      "Content-Type": "application/json",
    };

    // Adiciona headers customizados, sobrescrevendo headers base se necessário
    Object.assign(headers, this.CUSTOM_HEADERS);

    return {
      method,
      headers,
      body
    }
  }

  /**
   * Constrói a URL final removendo o prefixo da URL original
   * Exemplo: "/store/api/v1/orders" → "/api/v1/orders"
   * @private
   * @param {string} requestUrl - URL original com prefixo
   * @returns {string} URL formatada sem o prefixo inicial
   */
  private buildRequestUrl(requestUrl: string): string {
    const regex = /^\/[^\/]+/;
    return requestUrl.replace(regex, "");
  }

  /**
   * Processa a resposta baseada no tipo de conteúdo
   * @private
   * @param {Response} response - Objeto Response do fetch
   * @returns {Promise<any>} Dados processados (ArrayBuffer, Blob, JSON, etc.)
   */
  private async processResponse(response: Response): Promise<{
    data: any; contentType: string; headers: Record<string, string>
  }> {
    const contentType = response.headers.get('content-type') || '';
    const headers: Record<string, string> = {};

    // Copia headers importantes para repassar
    const importantHeaders = ['content-type', 'content-disposition', 'content-length'];
    importantHeaders.forEach(header => {
      const value = response.headers.get(header);
      if (value) headers[header] = value;
    });

    let data;

    if (contentType.includes('application/octet-stream') ||
      contentType.includes('application/pdf') ||
      contentType.includes('image/') ||
      contentType.includes('audio/') ||
      contentType.includes('video/')) {
      const arrayBuffer = await response.arrayBuffer();
      data = Buffer.from(arrayBuffer);
    } else if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    return {
      data,
      contentType,
      headers
    }
  }

  /**
   * Método genérico para executar requisições HTTP
   * @private
   * @template T - Tipo genérico para o dado de resposta
   * @param {string} url - URL completa da requisição
   * @param {RequestInit} config - Configurações do fetch
   * @param {string} errorMessage - Mensagem de erro personalizada
   * @returns {Promise<ISendRequestResponse>} Promise com status e dados da resposta
   * @throws {ErrorMessage} Erro customizado em caso de falha
   */
  private async sendRequest<T>(
    url: string,
    config: RequestInit,
    errorMessage: string
  ): Promise<ISendRequestResponse> {
    // Executa a requisição fetch
    const response = await fetch(url, config);

    // Extrai status code da resposta
    const status = response.status;

    // Processa a resposta baseada no tipo de conteúdo
    const { data, contentType, headers } = await this.processResponse(response);

    // Retorna objeto padronizado com status, dados e headers
    return {
      data,
      status,
      headers: {
        ...headers,
        'content-type': contentType
      },
      contentType
    }
  }

  /**
   * Prepara e executa a requisição completa com base nas configurações
   * @public
   * @returns {Promise<ISendRequestResponse>} Promise com resposta da requisição
   */
  async prepareRequest(): Promise<ISendRequestResponse> {
    // Constrói a URL com base no host e porta
    const host = this.SERVICE_NAME;
    const baseUrl = `http://${host}:${this.PORT}`;

    // Constrói URL final combinando base + URL formatada
    const url = baseUrl + this.buildRequestUrl(this.REQUEST_URL);

    // Obtém configurações do fetch
    const config = this.getRequestConfig(this.REQUEST_METHOD, this.REQUEST_AUTH_HEADER, this.REQUEST_BODY);

    // Mensagem de erro personalizada
    const errorMessage = `[${this.SERVICE_NAME}] Erro ao realizar requisição.`;

    // Executa a requisição com retry
    const result = await this.executeWithRetry(
      () => this.sendRequest(url, config, errorMessage),
      `${this.REQUEST_METHOD} ${this.REQUEST_URL}`
    );

    return result;
  }
}

export default GatewayService;