import { NextFunction, Request, Response } from "express";

// Interfaces
import { IHealth } from "../interfaces";

export class HealthController {
  async checkHealth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: IHealth = {
        status: "OK",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        service: "Gateway Service",
      }
      res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  }
}

export default new HealthController();