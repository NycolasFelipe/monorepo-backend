import sequelize from "./config/sequelize";

// Inicializa a conexão com o banco de dados
sequelize
  .then(async (db) => {
    try {
      // Sincroniza os modelos Sequelize com o banco de dados
      await db.sync({ force: false });
      console.log("Banco de dados sincronizado com sucesso");

    } catch (error) {
      // Log de erro detalhado em caso de falha na sincronização
      console.error("Erro na sincronização do banco de dados:", error);
    }
  })
  .catch((error) => {
    // Log de erro em caso de falha na conexão inicial
    console.error("Erro na conexão com o banco de dados:", error);
  });
