// Carrega as variáveis de ambiente
import dotenv from "dotenv";
dotenv.config();

// Variáveis de ambiente necessárias
const env = {
  PORT: process.env.PORT!,
}

export default env;