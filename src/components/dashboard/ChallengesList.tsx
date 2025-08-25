import type { ChallengeWithCompletions } from 'convex/challenges'
import ChallengeCard from "./ChallengeCard"

interface ChallengesListProps {
	challenges: ChallengeWithCompletions[]
}

export default function ChallengesList({ challenges }: ChallengesListProps) {
	return (
		<div className="flex flex-col gap-5">
			{challenges.map((challenge) => (
				<ChallengeCard key={challenge._id} challenge={challenge} />
			))}
		</div>
	)
}
