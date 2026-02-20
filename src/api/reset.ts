import { Request, Response } from "express";
import { config } from "../config.js";
import { ForbiddenError } from "../errors.js";
import { deleteUsers } from "../db/queries/users.js";

export async function handlerReset(req: Request, res: Response) {
    if (config.api.platform !== "dev") {
        throw new ForbiddenError('Forbidden: You are not allowed to reset the App.');
    }
    config.api.fileserverHits = 0;
    res.write(`Fileserver Hit Count Reset to ${config.api.fileserverHits}\n`);
    const deleted = await deleteUsers();
    res.write(`Removed {${deleted.length}} User(s) From Database`);
    res.end();
}