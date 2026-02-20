import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../errors.js";
import { NewUser } from "../db/schema.js";
import { createUser } from "../db/queries/users.js";

export async function handlerCreateUser(req: Request, res: Response, next: NextFunction) {
    type parameters = {
        email: string;
    };

    const params: parameters = req.body;

    if (!params) {
        throw new BadRequestError("Invalid JSON, could not parse");
    }
    if (!("email" in params)) {
        throw new BadRequestError("Invalid JSON format, email parameter required for user");
    }

    const user = {
        email: params.email,
    } satisfies NewUser;

    const created = await createUser(user);

    if (!created) {
        throw new Error(`Could not create User`);
    }

    res.status(201).json(created);
}