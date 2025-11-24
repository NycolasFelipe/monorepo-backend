import express from "express";

// Controllers
import { HealthController } from "../controllers";

const router = express.Router();

router.all(/(.+)/, HealthController.checkHealth);

export default router;