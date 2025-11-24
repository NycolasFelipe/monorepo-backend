import app from "./app";

// Valida as variáveis de ambiente e alerta sobre quaisquer faltantes
import env from "@config/env";

const PORT = parseInt(env.GATEWAY_PORT);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});