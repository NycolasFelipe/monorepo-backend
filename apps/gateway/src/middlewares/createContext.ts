import { NextFunction, Request, Response } from "express";
import { RequestHandler } from "express-serve-static-core";

// Interfaces
import { IGatewayConstructor } from "../interfaces";

/**
 * Factory function para criar middleware de contexto do Gateway
 * 
 * @param {string} serviceName - Nome do serviço para identificação (ex: "API Payment", "API Order")
 * @param {string | number} port - Porta do serviço de destino para a requisição
 * @param {string[]} customHeadersToForward - Lista de headers customizados para repassar (opcional)
 * @returns {Function} Middleware do Express configurado com o contexto do gateway
 * 
 * @description
 * Este middleware factory cria um contexto padronizado para o Gateway Service,
 * capturando informações essenciais da requisição HTTP e preparando-as para
 * serem consumidas pelo GatewayController.
 * 
 * @example
 * // Uso em aplicação Express
 * app.use('/payment', createContext("API Payment", 2001));
 * app.use('/order', createContext("API Order", 2002));
 * 
 * @example
 * // Uso com headers customizados
 * app.use('/payment', createContext("API Payment", 2001, ["custom-token", "x-correlation-id"]));
 * 
 * @example
 * // O middleware popula res.locals.request com:
 * {
 *   SERVICE_NAME: "API Payment",
 *   PORT: "2001",
 *   REQUEST_AUTH_HEADER: "Bearer token123",
 *   REQUEST_URL: "/payment/api/process",
 *   REQUEST_METHOD: "GET",
 *   REQUEST_BODY: { ... },
 *   CUSTOM_HEADERS: {
 *     "custom-token": "custom-token-value"
 *   }
 * }
 */
const createContext = (
  serviceName: string, 
  port: string | number, 
  customHeadersToForward: string[] = []
): RequestHandler => {
  /**
   * Middleware que configura o contexto do Gateway Service
   */
  return (req: Request, res: Response, next: NextFunction) => {
    // Coleta headers customizados para repassar
    const customHeaders: Record<string, string> = {};
    
    customHeadersToForward.forEach(headerName => {
      const headerValue = req.headers[headerName.toLowerCase()];
      if (headerValue) {
        customHeaders[headerName] = Array.isArray(headerValue) ? headerValue[0]! : headerValue;
      }
    });

    // Configura o objeto de contexto do gateway no res.locals
    res.locals.request = {
      // Identificador do serviço para logs e mensagens de erro
      SERVICE_NAME: serviceName,

      // Porta do serviço de destino
      PORT: port.toString(),

      // Header de autorização da requisição original
      REQUEST_AUTH_HEADER: req.headers.authorization,

      // URL completa da requisição original
      REQUEST_URL: req.originalUrl,

      // Método HTTP da requisição (GET, POST, PUT, DELETE, etc.)
      REQUEST_METHOD: req.method,

      // Corpo da requisição (para POST, PUT, PATCH)
      REQUEST_BODY: req.body,

      // Headers customizados para repassar adiante
      CUSTOM_HEADERS: customHeaders,
    } as IGatewayConstructor;

    // Prossegue para o próximo middleware/controller
    next();
  }
}

export default createContext;