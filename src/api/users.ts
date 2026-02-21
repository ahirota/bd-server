import { Request, Response, NextFunction } from "express";
import { BadRequestError, NotAuthorizedError, NotFoundError } from "../errors.js";
import type { NewUser, UserResponse } from "../db/schema.js";
import { createUser, getUserByEmail } from "../db/queries/users.js";
import { hashPassword, checkPasswordHash, makeJWT } from "../auth.js";
import { config } from "../config.js";

type UserParameters = {
    email: string;
    password: string;
    expiresInSeconds?: number;
};

export async function handlerCreateUser(req: Request, res: Response, next: NextFunction) {
    const params = validateUser(req);

    const hashedPassword = await hashPassword(params.password);

    const userParams = {
        email: params.email,
        hashedPassword: hashedPassword
    } satisfies NewUser;

    const user = await createUser(userParams);

    if (!user) {
        throw new Error(`Could not create User`);
    }

    const safeUser: UserResponse = {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
    }

    res.status(201).json(safeUser);
}

export async function handlerLoginUser(req: Request, res: Response, next: NextFunction) {
    const params = validateUser(req);

    const user = await getUserByEmail(params.email);
    
    if (!user) {
        throw new NotAuthorizedError(`incorrect email or password`);
    }
    if (!await checkPasswordHash(params.password, user.hashedPassword)) {
        throw new NotAuthorizedError(`incorrect email or password`);
    }

    const expiration = (params.expiresInSeconds && params.expiresInSeconds < 3600) ? params.expiresInSeconds : 3600

    const token = makeJWT(user.id, expiration, config.api.jwtSecret);

    const safeUser: UserResponse = {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
        token: token
    }

    res.status(200).json(safeUser);
}

function validateUser(req: Request): UserParameters {
    const params: UserParameters = req.body;

    if (!params) {
        throw new BadRequestError("Invalid JSON, could not parse");
    }
    if (!params.email && !params.password) {
        throw new BadRequestError("Invalid JSON format, user requires email and password parameters");
    }

    return params
}