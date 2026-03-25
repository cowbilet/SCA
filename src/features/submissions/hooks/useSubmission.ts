import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createSubmission } from '../api/createSubmission'
import type { Award } from '@/types/awards'
import type { Challenge } from '@/types/challenges'
import type { StudentChallengeWithProposalAndSubmission } from '@/types/schemas/challenges'
import { useSession } from '@/integrations/better-auth/authClient'
import { queryKeys } from '@/hooks/queryKeys'

export function useSubmission({
    award,
    challenge,
}: {
    award: Award
    challenge: Challenge
}) {
    const queryClient = useQueryClient()
    const { data: user } = useSession()
    const studentId = user?.user.id
    return useMutation({
        mutationFn: (data: { note: string }) => createSubmission({ data: { ...data, award, challenge } }),
        onMutate: async (newSubmission) => {
            if (!studentId) {
                throw new Error('User ID must be provided')
            }
            const challengeKey = queryKeys.challenges.detail(
                award,
                challenge,
                studentId,
            )
            await queryClient.cancelQueries({ queryKey: challengeKey })

            const previousChallenge = queryClient.getQueryData<StudentChallengeWithProposalAndSubmission>(challengeKey)
            queryClient.setQueryData<StudentChallengeWithProposalAndSubmission>(challengeKey, (old: StudentChallengeWithProposalAndSubmission | undefined) => {
                if (!old) return old
                return {
                    ...old,
                    student_challenge: {
                        ...old.student_challenge,
                        note: newSubmission.note,
                        status: 'pending mentor',
                    },
                }
            })
            return { previousChallenge }
        },
        onSettled: () => {
            const challengeKey = queryKeys.challenges.detail(
                award,
                challenge,
                studentId!,
            )
            queryClient.invalidateQueries({ queryKey: challengeKey })
        },
        onError: (err, newSubmission, context) => {
            const challengeKey = queryKeys.challenges.detail(
                award,
                challenge,
                studentId!,
            )
            queryClient.setQueryData(challengeKey, context?.previousChallenge)
        },
    })
}