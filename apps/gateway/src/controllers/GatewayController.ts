import { NextFunction, Request, Response } from "express";

// Interfaces
import { IGatewayConstructor } from "../interfaces";

// Services
import GatewayService from "../services/GatewayService";

/**
 * Controller responsável por orquestrar requisições através do Gateway Service
 */
export class GatewayController {
  /** Processa requisições HTTP através do Gateway Service */
  async makeRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    // Recupera configurações do gateway do contexto da resposta
    const properties = res.locals.request as IGatewayConstructor;

    // Instancia o serviço de gateway com as propriedades configuradas
    const gatewayService = new GatewayService(properties);

    try {
      // Executa a requisição HTTP através do gateway
      const response = await gatewayService.prepareRequest();

      // Extrai status, dados e headers da resposta
      const { status, data, headers, contentType } = response;

      // Configura headers da resposta se existirem
      if (headers) {
        Object.entries(headers).forEach(([key, value]) => {
          // Não sobrescreve headers críticos do Express, a menos que necessário
          if (key.toLowerCase() !== 'content-length') {
            res.setHeader(key, value);
          }
        });
      }

      // Configura content-type específico se disponível
      if (contentType) {
        res.setHeader('Content-Type', contentType);
      }

      // Para arquivos binários (Buffer), envia diretamente
      if (Buffer.isBuffer(data)) {
        // Se não tem content-disposition header, define um padrão para download
        if (!headers?.['content-disposition'] && !res.getHeader('content-disposition')) {
          const filename = this.extractFilenameFromUrl(properties.REQUEST_URL) || 'download';
          res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        }

        res.status(status).send(data);
        return;
      }

      // Para respostas JSON ou texto, envia normalmente
      res.status(status).send(data);

    } catch (error) {
      // Encaminha qualquer erro para o middleware de tratamento de erros
      next(error);
    }
  }

  /**
   * Extrai um nome de arquivo da URL para usar como fallback no content-disposition
   * @private
   * @param {string} url - URL da requisição
   * @returns {string} Nome do arquivo extraído
   */
  private extractFilenameFromUrl(url: string): string {
    const segments = url.split('/');
    const lastSegment = segments[segments.length - 1];

    // Remove query parameters se existirem
    const filename = lastSegment?.split('?')[0];

    // Retorna apenas se parecer um nome de arquivo com extensão
    return filename?.includes('.') ? filename : '';
  }
}

export default new GatewayController();