import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { type RefreshToken, refreshTokens } from "../schema.js";

// CREATE
export async function createRefreshToken(token: RefreshToken) {
    const [result] = await db
        .insert(refreshTokens)
        .values(token)
        .onConflictDoNothing()
        .returning();
    return result;
}

// READ
export async function getRefreshTokenByToken(token: string) {
    const [result] = await db
        .select()
        .from(refreshTokens)
        .where(eq(refreshTokens.token, token));
    return result;
}

// UPDATE
export async function revokeRefreshToken(token: string) {
    const [result] = await db
        .update(refreshTokens)
        .set({revokedAt: new Date()})
        .where(eq(refreshTokens.token, token));
    return result;
}
