import warnMissingEnv from "../lib/warnMissingEnv";

// Carrega as variáveis de ambiente
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

// Variáveis de ambiente necessárias
const env = {
  // Configurações do gateway
  GATEWAY_PORT: process.env.GATEWAY_PORT!,

  // Configurações do banco de dados
  DB_NAME: process.env.DB_NAME!,
  DB_HOST: process.env.DB_HOST!,
  DB_USER: process.env.DB_USER!,
  DB_PASSWORD: process.env.DB_PASSWORD!,
  DB_PORT: process.env.DB_PORT!,
}

// Verifica se todas as variáveis de ambiente necessárias estão definidas
warnMissingEnv(env);

export default env;