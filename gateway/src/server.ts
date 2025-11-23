// Valida as variáveis de ambiente e alerta sobre quaisquer faltantes
import env from "./config/env";
import warnMissingEnv from "@lib/warnMissingEnv";

warnMissingEnv(env);

const PORT = parseInt(env.PORT);

import app from "./app";

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});