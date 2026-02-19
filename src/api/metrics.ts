import { Request, Response } from "express";
import { cfg } from "../config.js";

export function handlerMetrics(req: Request, res: Response) {
  res.set('Content-Type', 'text/plain; charset=utf-8');
  res.status(200).send(`Hits: ${cfg.fileserverHits}`);
}

export function handlerReset(req: Request, res: Response) {
  cfg.fileserverHits = 0;
  res.write(`Fileserver Hit Count Reset to ${cfg.fileserverHits}`);
  res.end();
}