/**
 * Verifica se há variáveis de ambiente faltando e notifica ou lança um erro se alguma estiver ausente.
 * 
 * Esta função é útil para validação inicial em aplicações, garantindo que todas
 * as variáveis de ambiente necessárias estejam definidas antes da execução.
 * 
 * @function
 * @param {Record<string, unknown>} env - Objeto contendo as variáveis de ambiente a serem validadas.
 *                                        As chaves representam os nomes das variáveis e os valores
 *                                        são os valores a serem verificados.
 * 
 * @param {Function} [errorMessageHandler] - Função callback opcional para tratamento personalizado de erros.
 *                                           Recebe dois parâmetros: message (string) e status (number).
 *                                           Se não fornecido, usa console.error como padrão.
 * 
 * @returns {void} Não retorna valor. A função notifica sobre variáveis faltantes ou completa silenciosamente.
 * 
 * @example
 * // Uso típico na inicialização da aplicação
 * const envVars = {
 *   DATABASE_URL: process.env.DATABASE_URL,
 *   API_KEY: process.env.API_KEY,
 *   PORT: process.env.PORT
 * };
 * 
 * warnMissingEnv(envVars); // Exibe erro no console se alguma variável estiver faltando
 * 
 * @example
 * // Com handler personalizado
 * warnMissingEnv(envVars, (message, status) => {
 *   logger.error(`Status ${status}: ${message}`);
 *   process.exit(1);
 * });
 * 
 * @example
 * // Validação bem-sucedida
 * warnMissingEnv({ 
 *   DB_USER: 'admin', 
 *   DB_PASS: 'secret', 
 *   HOST: 'localhost' 
 * }); // Não exibe erro
 * 
 * @description
 * Processo de validação:
 * 1. Recebe um objeto com variáveis de ambiente
 * 2. Filtra as entradas onde o valor é falsy (null, undefined, '', 0, false)
 * 3. Se encontrar variáveis faltantes, notifica através do handler ou console.error
 * 4. Se todas as variáveis estiverem presentes, a função termina silenciosamente
 * 
 * @note A função considera valores falsy como ausentes: null, undefined, "", 0, false
 * @note Ideal para ser chamada no startup da aplicação
 * @note Fornece feedback claro sobre quais variáveis específicas estão faltando
 * 
 * @warning Esta função não valida o formato ou tipo das variáveis, apenas sua existência
 * @warning Valores como "0" ou "" (string vazia) são considerados faltantes
 */
function warnMissingEnv(
  env: Record<string, unknown>,
  errorMessageHandler?: (message: string, status: number) => void
): void {
  // Filtra as entradas do objeto para encontrar variáveis faltantes
  const missingVariables = Object.entries(env)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingVariables.length === 0) return;

  const message = `[warnMissingEnv] Variáveis de ambiente necessárias não encontradas: ${missingVariables.join(', ')}`;
  const status = 500;

  if (errorMessageHandler) {
    errorMessageHandler(message, status);
  } else {
    console.error(`Error ${status}: ${message}`);
  }
}

export default warnMissingEnv;