import type { HTMLAttributes, ReactNode } from 'react'
import type { SubmissionState } from '@/types/awards'
import {
    Notification,
    NotificationBody,
    NotificationHeader,
} from '@/components/notification'

export const positiveClass = 'bg-green-100 border-green-500 text-green-700'
export const negativeClass = 'bg-red-100 border-red-500 text-red-700'

export default function Feedback<
    T extends {
        status: SubmissionState
        mentorNote: string | null
        assessorNote: string | null
    },
>({ data }: { data: T }) {
    const comments: Array<ReactNode> = []
    if (data.status === 'pending mentor' || data.status === 'not started') {
        return comments
    }
    switch (data.status) {
        case 'pending assessor':
            if (data.mentorNote) {
                comments.push(
                    <FeedbackNotification
                        key="mentorFeedback"
                        feedback={data.mentorNote}
                        title={'Mentor'}
                        className={positiveClass}
                    />,
                )
            }
            break
        case 'rejected mentor':
            if (data.mentorNote) {
                comments.push(
                    <FeedbackNotification
                        key="mentorFeedback"
                        feedback={data.mentorNote}
                        title={'Mentor'}
                        className={negativeClass}
                    />,
                )
            }
            break
        case 'rejected assessor':
            if (data.assessorNote) {
                comments.push(
                    <FeedbackNotification
                        key="assessorFeedback"
                        feedback={data.assessorNote}
                        title={'Assessor'}
                        className={negativeClass}
                    />,
                )
            }
            if (data.mentorNote) {
                comments.push(
                    <FeedbackNotification
                        key="mentorFeedback"
                        feedback={data.mentorNote}
                        title={'Mentor'}
                        className={positiveClass}
                    />,
                )
            }
            break
        case 'completed':
            if (data.assessorNote) {
                comments.push(
                    <FeedbackNotification
                        key="assessorFeedback"
                        feedback={data.assessorNote}
                        title={'Assessor'}
                        className={positiveClass}
                    />,
                )
            }
            if (data.mentorNote) {
                comments.push(
                    <FeedbackNotification
                        key="mentorFeedback"
                        feedback={data.mentorNote}
                        title={'Mentor'}
                        className={positiveClass}
                    />,
                )
            }
            break
    }
    return comments
}
function FeedbackNotification({
    feedback,
    title,
    ...props
}: { feedback: string; title?: string } & HTMLAttributes<HTMLDivElement>) {
    return (
        <Notification {...props}>
            <NotificationHeader className="font-bold text-lg">
                📝 Feedback from {title || 'Mentor'}
            </NotificationHeader>
            <NotificationBody>{feedback}</NotificationBody>
        </Notification>
    )
}
