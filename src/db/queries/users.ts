import { eq } from "drizzle-orm";
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

// READ
export async function getUserByEmail(email: string) {
    const [result] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
    return result;
}

// DELETE
export async function deleteUsers() {
    const result = await db
        .delete(users)
        .returning();
    return result;
}