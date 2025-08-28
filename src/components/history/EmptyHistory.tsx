import africanBoy from '../../assets/africanBoy.webp'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function EmptyHistory() {
	const navigate = useNavigate()

	return (
		<main className='flex-col text-center w-full h-screen flex items-center justify-center'>
			<div className="overflow-hidden rounded-lg">
				<img
					src={africanBoy}
					alt='Funny dog meme illustrating no challenges'
					className='w-50 h-auto translate-y-[-60px]'
				/>
			</div>
			<h2 className='text-3xl font-bold mb-1'>
				Welcome to History page
			</h2>
			<p className='text-base mb-5 font-medium text-gray-500 dark:text-gray-400'>
				No challenges completed yet. Keep it up!
			</p>
			<Button onClick={() => navigate('/dashboard')}>
				/* Back to Dashboard */
			</Button>
		</main>
	)
}
