import { asc } from "drizzle-orm";
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
export async function getAllChirps() {
    const result = await db
        .select()
        .from(chirps)
        .orderBy(asc(chirps.createdAt));
    return result;
}