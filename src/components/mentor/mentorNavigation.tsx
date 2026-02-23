export default function MentorNavigation() {
    return (
        <div className="flex flex-col gap-4 w-full p-4 drop-shadow-2xl border-2 border-gray-400 rounded-lg">
            <div className="flex flex-row gap-2">
                <h2 className="text-2xl font-bold">
                    Award: 
                </h2>
                <button className="bg-orange-700 text-white px-4 py-2 rounded-lg">
                    Bronze
                </button>
                <button className="bg-gray-700 text-white px-4 py-2 rounded-lg">
                    Silver
                </button>
                <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg">
                    Gold
                </button>
            </div>
            <div className="flex flex-row gap-2">
                <h2 className="text-2xl font-bold">
                    Challenge:
                </h2>
                <button className="bg-blue-700 text-white px-4 py-2 rounded-lg">
                    Relationship
                </button>
                <button className="bg-green-700 text-white px-4 py-2 rounded-lg">
                    Community
                </button>
                <button className="bg-purple-700 text-white px-4 py-2 rounded-lg">
                    Challenge
                </button>
                <button className="bg-red-700 text-white px-4 py-2 rounded-lg">
                    Service
                </button>
            </div>
        </div>
    )
}