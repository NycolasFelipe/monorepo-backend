import { NextFunction, Request, Response } from "express";

// Definição da interface de erro personalizada
interface IRequestError {
  message: string;
  status: number;
  code?: string;
  field?: string;
}

/** Tipo para funções de tratamento de erro que verificam e processam erros específicos */
type ErrorHandler = (err: any, req: Request) => IRequestError | null;

/** Lista de handlers de erro em ordem de prioridade de execução */
const errorHandlers: ErrorHandler[] = [
  // Handlers para erros customizados
  handleCustomError,
  handleEmptyRequestBody,
  handleJwtError,

  // Handler para erro genérico
  handleGenericError
];

/** Middleware principal de tratamento de erros */
const errorHandlerMiddleware = (
  err: Error | IRequestError | any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = handleError(err, req);
  logError(err);
  sendErrorResponse(res, error);
}

/** Processa o erro através dos handlers */
function handleError(err: any, req: Request): IRequestError {
  // Itera pela lista de handlers até encontrar o primeiro que processe o erro
  for (const handler of errorHandlers) {
    const error = handler(err, req);
    if (error) return error;
  }
  return { status: 500, message: "Erro interno do servidor" }
}

/** Registra o erro no console */
function logError(err: any): void {
  console.error('Erro:', err);
}

/** Envia resposta de erro formatada para o cliente */
function sendErrorResponse(res: Response, error: IRequestError): void {
  res.status(error.status).json({ message: error.message });
  field: error.field ? { field: error.field } : undefined
  if (error.field) {
    res.status(error.status).json({ message: error.message, field: error.field });
  }
}


// Implementações específicas dos handlers

/** Trata erros customizados que implementam a interface IRequestError */
function handleCustomError(err: any): IRequestError | null {
  if ('status' in err && 'message' in err) {
    return err as IRequestError;
  }
  return null;
}

/** Trata requisições POST com corpo vazio */
function handleEmptyRequestBody(_: any, req: Request): IRequestError | null {
  if (req.method === "POST" && (req.body === undefined || Object.keys(req.body).length === 0)) {
    return { status: 400, message: "O corpo da requisição está ausente ou vazio." }
  }
  return null;
}

/** Trata erros relacionados a JWT */
function handleJwtError(err: any): IRequestError | null {
  if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
    return { status: 401, message: "Token inválido ou expirado." }
  }
  return null;
}

/** Handler genérico para erros não tratados */
function handleGenericError(): IRequestError {
  return { status: 500, message: "Erro interno do servidor" }
}

export default errorHandlerMiddleware;