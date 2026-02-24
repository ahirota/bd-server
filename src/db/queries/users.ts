import { eq, and, isNull } from "drizzle-orm";
import { db } from "../index.js";
import { type NewUser, users, refreshTokens } from "../schema.js";

// CREATE
export async function createUser(user: NewUser) {
    const [result] = await db
        .insert(users)
        .values(user)
        .onConflictDoNothing()
        .returning();
    return result;
}

// READ
export async function getUserByID(id: string) {
    const [result] = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
    return result;
}

export async function getUserByEmail(email: string) {
    const [result] = await db
        .select({
            id: users.id,
            createdAt: users.createdAt,
            updatedAt: users.updatedAt,
            hashedPassword: users.hashedPassword,
            email: users.email,
            isChirpyRed: users.isChirpyRed,
            refreshToken: refreshTokens.token
        })
        .from(users)
        .where(and(eq(users.email, email), isNull(refreshTokens.revokedAt)))
        .leftJoin(refreshTokens, eq(users.id, refreshTokens.userId))
    return result;
}

export async function getUserFromRefreshToken(refreshToken: string) {
    const [result] = await db
        .select({
            id: users.id,
            createdAt: users.createdAt,
            updatedAt: users.updatedAt,
            hashedPassword: users.hashedPassword,
            email: users.email,
            isChirpyRed: users.isChirpyRed,
            refreshToken: refreshTokens.token
        })
        .from(refreshTokens)
        .where(and(eq(refreshTokens.token, refreshToken)))
        .innerJoin(users, eq(users.id, refreshTokens.userId))
    return result;
}

// UPDATE
export async function updateUserEmailAndPassword(id: string, parameters: NewUser) {
    const [result] = await db
        .update(users)
        .set(parameters)
        .where(eq(users.id, id))
        .returning();
    return result;
}

export async function updateUserToChirpyRedByID(id: string) {
    const [result] = await db
        .update(users)
        .set({isChirpyRed: true})
        .where(eq(users.id, id))
        .returning();
    return result;
}

// DELETE
export async function deleteUsers() {
    const result = await db
        .delete(users)
        .returning();
    return result;
}