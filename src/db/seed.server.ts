import dotenv from 'dotenv';
dotenv.config({ path: '../../.env.local' });
import {  users } from "~drizzle/schema.ts";
import { db } from "./index.server";

async function seed() {
    await db.insert(users).values([
        { role: "student", name: "John Doe"},
        { role: "mentor", name: "Jane Smith"},
        { role: "student", name: "Emily Johnson" },
    ]);
}
seed().then(() => {
    console.log("Seeding completed.");
}).catch((error) => {
    console.error("Error seeding database:", error);
});