import { Request, Response, NextFunction } from "express";
import {  NotAuthorizedError } from "../errors.js";
import type { RefreshToken } from "../db/schema.js";
import { getUserFromRefreshToken } from "../db/queries/users.js";
import { makeJWT, getBearerToken } from "../auth.js";
import { config } from "../config.js";
import { getRefreshTokenByToken, revokeRefreshToken } from "../db/queries/refreshTokens.js";

export async function handlerRefreshAccessToken(req: Request, res: Response, next: NextFunction) {
    const bearerToken = getBearerToken(req);
    const refreshToken = await getRefreshTokenByToken(bearerToken);
    if (!refreshToken) {
        throw new NotAuthorizedError(`Authorization Bearer Not Present.`);
    }
    validateRefreshToken(refreshToken);
    const user = await getUserFromRefreshToken(refreshToken.token);
    const accessToken = makeJWT(user.id, config.api.jwtExp, config.api.jwtSecret);
    res.status(200).json({ token: accessToken });
}

export async function handlerRevokeRefreshToken(req: Request, res: Response, next: NextFunction) {
    const bearerToken = getBearerToken(req);
    const refreshToken = await getRefreshTokenByToken(bearerToken);
    if (!refreshToken) {
        throw new NotAuthorizedError(`Authorization Bearer Not Present.`);
    }
    const revoked = await revokeRefreshToken(refreshToken.token);
    res.sendStatus(204);
}

function validateRefreshToken(token: RefreshToken) {
    if (token.revokedAt) {
        throw new NotAuthorizedError(`Your access has been revoked.`);
    }
    if (new Date(token.expiresAt) < new Date()) {
        throw new NotAuthorizedError(`Your credentials have expired.`);
    }
}