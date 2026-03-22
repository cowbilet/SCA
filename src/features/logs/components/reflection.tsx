export default function Reflection({
    reflection,
}: {
    reflection: string | null
}) {
    if (!reflection) {
        return null
    }
    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold">Reflection</h2>
            <p>{reflection}</p>
        </div>
    )
}
