import { Sequelize } from "sequelize-typescript";
import models from "../models/index";

// Config
import env from "@config/env";

/** Função assíncrona para configuração do banco */
async function setupDatabase() {
  // 1. Criar banco se não existir
  const setupSequelize = new Sequelize({
    dialect: "mysql",
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    host: env.DB_HOST,
    port: Number(env.DB_PORT),
    logging: false,
  });

  try {
    await setupSequelize.query(`CREATE DATABASE IF NOT EXISTS ${env.DB_NAME}`);
    console.log(`✅ Banco ${env.DB_NAME} verificado/criado com sucesso`);
  } finally {
    await setupSequelize.close();
  }

  // 2. Criar instância principal conectada ao banco
  const mainSequelize = new Sequelize({
    dialect: "mysql",
    database: env.DB_NAME,
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    host: env.DB_HOST,
    port: Number(env.DB_PORT),
    logging: false,
    models,
    timezone: "-03:00",
  });

  await mainSequelize.sync();
  return mainSequelize;
}

// Exportar instância configurada
const sequelize = (async () => await setupDatabase())();
export default sequelize;