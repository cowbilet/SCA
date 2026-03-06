import { z } from "zod";

export const CreateLogEntrySchema = z.object({
    date: z.coerce.date<string>().refine((date) => {
        const today = new Date()
        return date <= today
    }, {
        message: 'Date cannot be in the future',
    }),
    description: z.string(),
})