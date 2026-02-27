import { useMutation } from "@tanstack/react-query";
import { createUserProposal } from "../api/createUserProposal";
import { reviewProposal } from "../api/reviewProposal";
import { Award } from "@/types/awards";
import { Challenge } from "@/types/challenges";

export function useReviewProposal(studentId: string, award: Award, challenge: Challenge) {
    return useMutation({
        mutationFn: (data: {notes: string, accepted: boolean }) => reviewProposal({data: { studentId, award, challenge, ...data }}),
    })
}