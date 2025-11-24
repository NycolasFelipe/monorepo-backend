// Importação de módulos principais e dependências
import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// Importação das rotas da aplicação
import {
  routesHealth
} from "./routes";

// Importação dos middlewares
import errorHandler from "@middlewares/errorHandler";
import optionsMorgan from "@config/morgan";
import optionsRateLimit from "@config/rateLimit";

// Criação da instância do Express
const app = express();

// Configuração de middlewares globais
app.use(morgan("dev", optionsMorgan));
app.use(rateLimit(optionsRateLimit));
app.use(cors());
app.use(helmet());
app.use(express.json());

// Rotas da aplicação
app.use("/health", routesHealth);

// Middlewares
app.use(errorHandler);

export default app;
