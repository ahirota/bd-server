import { Request, Response } from "express";
import { cfg } from "../config.js";

export function handlerMetrics(req: Request, res: Response) {
    res.set('Content-Type', 'text/html; charset=utf-8');
    const content = `<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${cfg.fileserverHits} times!</p>
  </body>
</html>`
    res.write(content)
    res.status(200).end();
}

export function handlerReset(req: Request, res: Response) {
    cfg.fileserverHits = 0;
    res.write(`Fileserver Hit Count Reset to ${cfg.fileserverHits}`);
    res.end();
}