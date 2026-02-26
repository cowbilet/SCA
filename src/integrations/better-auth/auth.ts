import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/index.server";
import "dotenv/config"
// import { location, role } from "@/db/schema.server";
import { tanstackStartCookies } from "better-auth/tanstack-start";

export const auth = betterAuth({
    secret: process.env.BETTER_AUTH_SECRET!,
    baseUrl: process.env.PUBLIC_BETTER_AUTH_URL!,
    database: drizzleAdapter(db, {
        provider: "pg",
        usePlural: true,
    }),
    emailAndPassword: {
        enabled: true,
    },
    advanced: {
        database: {
            generateId: false,
        }
    },
    user: {
        additionalFields: {
            state: {
                type: "string",
                required: true,
                // validate: (value: string) => Object.values(location.enumValues).includes(value as typeof location.enumValues[number]),

            },
            role: {
                type: "string",
                required: true,
                // validate: (value: string) => Object.values(role.enumValues).includes(value as typeof role.enumValues[number]),
            },
            // name: {
            //     type: "string",
            //     required: true,
            // } 
        }
    },
    plugins: [
        tanstackStartCookies(),
    ]
});