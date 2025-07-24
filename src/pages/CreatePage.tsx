import Create from '@/components/create/Create'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function CreatePage() {
	return (
		<div className='w-full min-h-screen'>
			<nav className='border-b bg-background/50 backdrop-blur-md w-full'>
				<div className='max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-start items-center h-16'>
					<Link to='/dashboard'>
						<Button variant='outline'>
							<ArrowLeft className='h-4 w-4' />
							Back to Home
						</Button>
					</Link>
				</div>
			</nav>
			<div className='max-w-2xl mx-auto space-y-6 m-10'>
				<Create />
			</div>
		</div>
	)
}
