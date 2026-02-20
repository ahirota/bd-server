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
