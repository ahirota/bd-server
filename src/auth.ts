import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { NotAuthorizedError } from "./errors";

export async function hashPassword(password: string): Promise<string> {
    return await argon2.hash(password);
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
    if (!password) return false;
    try {
        return await argon2.verify(hash, password);
    } catch {
        return false;
    }
}

type Payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

const ISSUER = "chirpy";

export function makeJWT(userID: string, expiresIn: number, secret: string): string {
    const issuedAt = Math.floor(Date.now() / 1000);
    const expiresAt = issuedAt + expiresIn;

    const payload = {
        iss: ISSUER,
        sub: userID,
        iat: issuedAt,
        exp: expiresAt
    } satisfies Payload
    
    const token = jwt.sign(payload, secret, { algorithm: "HS256" });

    return token;
}

export function validateJWT(tokenString: string, secret: string): string {
    let decoded: Payload;
    try {
        decoded = jwt.verify(tokenString, secret) as JwtPayload;
    } catch (e) {
        throw new NotAuthorizedError(`Invalid token`);
    }
    
    if (decoded.iss !== ISSUER) {
        throw new NotAuthorizedError(`Invalid issuer`);
    }

    if (!decoded.sub) {
        throw new NotAuthorizedError(`No user ID in token`);
    }
    return decoded.sub;
}