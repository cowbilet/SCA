import { z } from 'zod'
import { validateAward } from '../guards/awards'
import type { Award } from '../awards'

export const awardSchema = z
    .string()
    .refine((award): award is Award => validateAward(award), {
        message: 'Invalid award',
    })
