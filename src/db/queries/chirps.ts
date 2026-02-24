import { asc, desc, eq, like } from "drizzle-orm";
import { db } from "../index.js";
import { type NewChirp, chirps } from "../schema.js";

// CREATE
export async function createChirp(chirp: NewChirp) {
    const [result] = await db
        .insert(chirps)
        .values(chirp)
        .onConflictDoNothing()
        .returning();
    return result;
}

// READ
export async function getAllChirpsWithOptionalParameters(...args: string[]) {
    const [userId, sortMethod] = args;

    let authorSearch = undefined;
    if (userId !== "") {
        authorSearch = eq(chirps.userId, userId)
    }

    let sort = asc(chirps.createdAt)
    if (sortMethod == "desc") {
        sort = desc(chirps.createdAt)
    }

    const result = await db
        .select()
        .from(chirps)
        .where(authorSearch)
        .orderBy(sort);
    return result;
}

export async function getChirpByID(chirpId: string) {
    const [result] = await db
        .select()
        .from(chirps)
        .where(eq(chirps.id, chirpId));
    return result;
}

// DELETE
export async function deleteChirpByID(chirpId: string) {
    const [result] = await db
        .delete(chirps)
        .where(eq(chirps.id, chirpId))
        .returning();
    return result;
}