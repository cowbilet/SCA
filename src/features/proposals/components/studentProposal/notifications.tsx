import type { Proposal } from '@/types/proposal'
export default function Notifications({proposal}: {proposal: Proposal}) {
    return (
        <div className="w-full p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded">
            <h2 className="text-lg font-bold mb-2">📋 Step 1: Create Your Proposal</h2>
            <p>Before you can start logging activities, you need to submit a proposal describing what you plan to do. Your mentor will review it first, and if approved, it will be sent to the assessor for final approval.</p>
        </div>
    )
}