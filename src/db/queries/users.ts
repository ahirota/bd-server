import { db } from "../index.js";
import { type NewUser, users } from "../schema.js";

// CREATE
export async function createUser(user: NewUser) {
    const [result] = await db
        .insert(users)
        .values(user)
        .onConflictDoNothing()
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