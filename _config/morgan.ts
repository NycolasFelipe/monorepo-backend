import { Request } from "express";

const morganOptions = {
  skip: function (req: Request) {
    const isMethodOptions = req.method === "OPTIONS";
    const isHealthCheck = req.originalUrl.includes("health");
    return isMethodOptions || isHealthCheck;
  }
}

export default morganOptions;