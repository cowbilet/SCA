import { Award } from "../awards";
import { z } from "zod";
import { validateAward } from "../guards/awards";
export const awardSchema = z.string().refine((award): award is Award => validateAward(award), {
    message: 'Invalid award',
})