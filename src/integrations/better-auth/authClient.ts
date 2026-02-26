import { createAuthClient } from "better-auth/client";

import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "./auth";


export const authClient = createAuthClient({
    baseURL: process.env.PUBLIC_BETTER_AUTH_URL!,
    plugins: [
        inferAdditionalFields<typeof auth>()
    ]
});