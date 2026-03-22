import type { role } from '@/db/schema'

export type Role = (typeof role.enumValues)[number]
