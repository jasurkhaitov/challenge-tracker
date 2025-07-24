import Mem from '../../assets/mem.webp'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/clerk-react'

export default function EmptyDashboard() {
	const navigate = useNavigate()

	const { user } = useUser()

	return (
		<main className='flex-col py-10 text-center w-full h-screen flex items-center justify-center'>
			<img
				src={Mem}
				alt='Funny dog meme illustrating no challenges'
				className='w-60 h-auto rounded-lg mb-5'
			/>
			<h2 className='text-3xl font-bold mb-1'>
				Welcome to {user?.firstName}'s page
			</h2>
			<p className='text-base mb-5 font-medium text-gray-500 dark:text-gray-400'>
				No challenges yet. Start your first one!
			</p>
			<Button onClick={() => navigate('/create')}>
				/* Create New Challenge */
			</Button>
		</main>
	)
}
