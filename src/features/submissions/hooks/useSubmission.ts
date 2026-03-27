import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createSubmission } from '../api/createSubmission'
import type { Award } from '@/types/awards'
import type { Challenge } from '@/types/challenges'
import { useSession } from '@/integrations/better-auth/authClient'
import { challengeQueryOptions } from '@/hooks/useChallenge'

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
    const { queryKey: challengeKey } = challengeQueryOptions(award, challenge, studentId ?? '')
    
    return useMutation({
        mutationFn: (data: { note: string }) =>
            createSubmission({ data: { ...data, award, challenge } }),
        onMutate: async (newSubmission) => {
            if (!studentId) {
                throw new Error('User ID must be provided')
            }
            await queryClient.cancelQueries({ queryKey: challengeKey })

            const previousChallenge = queryClient.getQueryData(challengeKey)

            if (previousChallenge) {
                queryClient.setQueryData(challengeKey, {
                    ...previousChallenge,
                    reflection: newSubmission.note,
                    status: 'pending mentor',
                })
            }
            return { previousChallenge }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: challengeKey })
        },
        onError: (_err, _newSubmission, context) => {
            queryClient.setQueryData(challengeKey, context?.previousChallenge)
        },
    })
}
