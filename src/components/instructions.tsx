import {
    Notification,
    NotificationBody,
    NotificationHeader,
} from './notification'

export default function Instructions({
    title,
    description,
    className,
    ...props
}: {
    title: string
    description: string
} & React.HTMLAttributes<HTMLDivElement>) {
    return (
        <Notification className={className} {...props}>
            <NotificationHeader className="font-bold text-lg">
                {title}
            </NotificationHeader>
            <NotificationBody>{description}</NotificationBody>
        </Notification>
    )
}
