import { Request, Response, NextFunction } from "express";
import { cfg } from "../config.js";

export function middlewareMetricsInc(req: Request, res: Response, next: NextFunction) {
  cfg.fileserverHits++;
  next();
}