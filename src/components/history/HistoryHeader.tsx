import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'

export default function HistoryHeader({ num, link }: { num: number, link: string }) {
	const navigate = useNavigate()
	return (
		<div className="flex flex-col sm:flex-row items-center justify-between gap-5 mb-6">
			<h1 className="text-2xl font-bold text-foreground">
				{num > 0 ? `${num} Challenges Completed` : "No Challenges Completed Yet"}
			</h1>

			<Button className='shadow-xl' onClick={() => navigate(link)}>
				/* Go to Dashboard */
			</Button>
		</div>
	)
}
