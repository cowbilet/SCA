import { ProposalSchema } from "./schemas/proposal"
import { z } from "zod"
export type Proposal = z.infer<typeof ProposalSchema>