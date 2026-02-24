import { Request, Response, NextFunction } from "express";
import { BadRequestError, NotAuthorizedError, NotFoundError } from "../../errors.js";
import type { NewUser, UserResponse, RefreshToken } from "../../db/schema.js";
import { createUser, getUserByEmail, getUserByID, updateUserEmailAndPassword, updateUserToChirpyRedByID } from "../../db/queries/users.js";
import { hashPassword, checkPasswordHash, makeJWT, makeRefreshToken, getBearerToken, validateJWT } from "../../auth.js";
import { config } from "../../config.js";
import { createRefreshToken } from "../../db/queries/refreshTokens.js";

type WebhookEvent = {
    event: string,
    data: {
        userId: string
    }
}

export async function webhookUpgradeUser(req: Request, res: Response, next: NextFunction) {
    const params = validateEvent(req);

    if (params.event !== "user.upgraded") {
        res.sendStatus(204);
        return;
    }

    const user = await getUserByID(params.data.userId);

    if (!user) {
        throw new NotFoundError(`User with ID ${params.data.userId} not found`);
    }

    const upgraded = await updateUserToChirpyRedByID(user.id);

    res.sendStatus(204);
}

function validateEvent(req: Request) {
    const params: WebhookEvent = req.body;
    
    if (!params) {
        throw new BadRequestError("Invalid JSON, could not parse");
    }
    if (!params.event || !params.data || !params.data.userId) {
        throw new BadRequestError("Invalid JSON format, Webhook requires event and data with User ID");
    }

    return params;
}