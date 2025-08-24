import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'

export default function DashboardHeader({ name, link }: { name: string, link: string }) {
	const navigate = useNavigate()
	return (
		<div className="flex flex-col sm:flex-row items-center justify-between gap-5 mb-6">
			<h1 className="text-3xl font-bold text-foreground">
				Welcome back, {name}!
			</h1>
			<Button className='shadow-xl' onClick={() => navigate(link)}>
				/* Create New Challenge */
			</Button>
		</div>
	)
}
