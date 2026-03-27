import { useMutation, useQueryClient } from '@tanstack/react-query'
import { reviewSubmission } from '../api/reviewSubmission'
import type { StudentChallenge } from '@/types/schemas/challenges'
import type { Award } from '@/types/awards'
import type { Challenge } from '@/types/challenges'
import { challengeQueryOptions } from '@/hooks/useChallenge'
import { usePendingOptions } from '@/hooks/usePending'

export function useReviewSubmission(
    studentId: string,
    award: Award,
    challenge: Challenge,
) {
    const queryClient = useQueryClient()
    const { queryKey: challengeKey } = challengeQueryOptions(award, challenge, studentId)
    const { queryKey: pendingProposalsKey } = usePendingOptions()
    
    return useMutation({
        mutationKey: ['reviewSubmission', studentId, award, challenge],
        mutationFn: (data: { notes: string; accepted: boolean }) =>
            reviewSubmission({
                data: { studentId, award, challenge, ...data },
            }),
        onMutate: async (data) => {
            await queryClient.cancelQueries({ queryKey: challengeKey })
            await queryClient.cancelQueries({ queryKey: pendingProposalsKey })
            const previousChallenge =
                queryClient.getQueryData(challengeKey)
            if (!previousChallenge) {
                return { previousChallenge }
            }

            const newChallenge = generateNewChallengeData(
                previousChallenge,
                data.accepted,
                data.notes,
            )
            queryClient.setQueryData(challengeKey, newChallenge)

            return { previousChallenge }
        },
        onError: (_error, _data, context) => {
            if (context?.previousChallenge) {
                queryClient.setQueryData(
                    challengeKey,
                    context.previousChallenge,
                )
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: challengeKey })
        },
    })
}

function generateNewStudentChallenge(
    previousStudentChallenge: StudentChallenge,
    accepted: boolean,
    note: string,
): StudentChallenge {
    if (previousStudentChallenge.status === 'pending mentor') {
        return {
            ...previousStudentChallenge,
            status: accepted ? 'pending assessor' : 'rejected mentor',
            mentorNote: note,
        }
    }

    if (previousStudentChallenge.status === 'pending assessor') {
        return {
            ...previousStudentChallenge,
            status: accepted ? 'completed' : 'rejected assessor',
            assessorNote: note,
        }
    }

    return previousStudentChallenge
}

function generateNewChallengeData(
    previousChallengeData: StudentChallenge,
    accepted: boolean,
    note: string,
): StudentChallenge {
    return {
        ...previousChallengeData,
        ...generateNewStudentChallenge(previousChallengeData, accepted, note),
    }
}
